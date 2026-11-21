import crypto from 'crypto';
import net from 'net';
import { BRICS_COUNTRIES } from '../../shared/bricsData.js';
import { EXTERNAL_API_PROBE_TIMEOUT_MS, SCORE_MAX, SCORE_MIN } from '../../shared/constants.js';
import {
  DemographicsSchema,
  InfrastructureIndexSchema,
  PublicInvestmentSchema,
} from '../../shared/schemas.js';
import type {
  BricsCountry,
  BricsCountryCode,
  CustomApiEndpointConfig,
  DatasetVerificationCheck,
  DatasetVerificationResult,
} from '../../shared/types.js';
import type { Logger } from '../logger.js';

/** Function signature for probing external URLs (injectable for deterministic testing). */
export type FetchLike = typeof fetch;

interface DatasetCheckSpec {
  id: string;
  name: string;
  evaluate: (dataset: BricsCountry) => { passed: boolean; message: string };
}

/**
 * Table-driven schema and bounds checks applied to every country baseline dataset.
 */
const DATASET_CHECK_SPECS: readonly DatasetCheckSpec[] = [
  {
    id: 'demographics_schema',
    name: 'Demographic Census Integrity',
    evaluate: (dataset) => {
      const parsed = DemographicsSchema.safeParse(dataset.demographics);
      if (!parsed.success) {
        return {
          passed: false,
          message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        };
      }
      const d = parsed.data;
      const sum = Math.round((d.ruralPercentage + d.urbanPercentage) * 10) / 10;
      if (sum < SCORE_MIN || sum > SCORE_MAX + 0.5) {
        return {
          passed: false,
          message: `Rural (${d.ruralPercentage}%) + Urban (${d.urbanPercentage}%) cannot exceed 100%.`,
        };
      }
      return {
        passed: true,
        message: `Census metrics valid: Pop ${d.totalPopulation}, Rural/Urban ${d.ruralPercentage}%/${d.urbanPercentage}%, Density ${d.densityPerKm2}/km².`,
      };
    },
  },
  {
    id: 'infrastructure_schema',
    name: 'Infrastructure Baseline Index Schema',
    evaluate: (dataset) => {
      const parsed = InfrastructureIndexSchema.safeParse(dataset.infrastructureIndex);
      if (!parsed.success) {
        return {
          passed: false,
          message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        };
      }
      const idx = parsed.data;
      return {
        passed: true,
        message: `Indices within bounds: Roads ${idx.pavedRoadScore}/100, Water ${idx.waterSanitationCoverage}%, Clinics ${idx.healthCentersPer10k}/10k, Broadband ${idx.broadbandConnectivity}%.`,
      };
    },
  },
  {
    id: 'investment_schema',
    name: 'Capital Budget & Public Investment Validation',
    evaluate: (dataset) => {
      const parsed = PublicInvestmentSchema.safeParse(dataset.publicInvestment);
      if (!parsed.success) {
        return {
          passed: false,
          message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        };
      }
      const inv = parsed.data;
      return {
        passed: true,
        message: `Total Outlay: ${inv.totalBudgetUSD} (Disbursement: ${inv.disbursementRate}%) with ${inv.topPrograms.length} active programs validated.`,
      };
    },
  },
];

/**
 * Deterministically serializes an arbitrary JSON value with sorted object keys
 * so canonical SHA-256 digests are reproducible across invocations.
 */
export function canonicalJsonStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJsonStringify(item)).join(',')}]`;
  }
  const record = value as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const entries = sortedKeys
    .filter((key) => record[key] !== undefined)
    .map((key) => `${JSON.stringify(key)}:${canonicalJsonStringify(record[key])}`);
  return `{${entries.join(',')}}`;
}

/**
 * Computes a reproducible SHA-256 digest of the canonical JSON representation of `payload`.
 */
export function computeCanonicalSha256(payload: unknown): string {
  const canonical = canonicalJsonStringify(payload);
  return `sha256:${crypto.createHash('sha256').update(canonical).digest('hex')}`;
}

/** HTTP headers that must never be overridden by user-supplied external API connector configs. */
const RESTRICTED_PROBE_HEADERS = new Set([
  'host',
  'content-length',
  'transfer-encoding',
  'connection',
  'upgrade',
  'te',
  'cookie',
  'proxy-authorization',
]);

/**
 * Checks whether a hostname or IP address targets loopback, private, link-local,
 * multicast, or IPv4-mapped IPv6 internal networks.
 */
export function isBlockedHostnameOrIp(rawHostname: string): boolean {
  const hostname = rawHostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    !hostname ||
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return true;
  }

  const ipVersion = net.isIP(hostname);
  if (ipVersion === 4) {
    const octets = hostname.split('.').map(Number);
    const [a = -1, b = -1] = octets;
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true; // Multicast (224.0.0.0/4) & reserved/broadcast (240.0.0.0/4)
  } else if (ipVersion === 6) {
    if (hostname.startsWith('::ffff:')) {
      const mapped = hostname.slice('::ffff:'.length);
      if (net.isIP(mapped) === 4) {
        return isBlockedHostnameOrIp(mapped);
      }
      // Handle Node URL normalization of IPv4-mapped IPv6 to hex (e.g. ::ffff:7f00:1)
      const hexMatch = mapped.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
      if (hexMatch?.[1] && hexMatch[2]) {
        const hi = parseInt(hexMatch[1], 16);
        const lo = parseInt(hexMatch[2], 16);
        const ipv4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
        return isBlockedHostnameOrIp(ipv4);
      }
    }

    if (
      hostname === '::1' ||
      hostname === '::' ||
      hostname.startsWith('fe80:') ||
      hostname.startsWith('fc') ||
      hostname.startsWith('fd') ||
      hostname.startsWith('ff')
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Builds outbound authentication headers for external government API probes,
 * rejecting invalid header tokens or restricted hop-by-hop/host headers.
 */
function buildProbeHeaders(config: CustomApiEndpointConfig): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (config.authHeaderType === 'Bearer' && config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  } else if (config.authHeaderType === 'ApiKey' && config.apiKey) {
    headers['api-key'] = config.apiKey;
  } else if (
    config.authHeaderType === 'Custom' &&
    config.customHeaderKey &&
    config.customHeaderValue
  ) {
    const trimmedKey = config.customHeaderKey.trim();
    if (
      /^[a-zA-Z0-9-]+$/.test(trimmedKey) &&
      !RESTRICTED_PROBE_HEADERS.has(trimmedKey.toLowerCase())
    ) {
      headers[trimmedKey] = config.customHeaderValue;
    }
  }
  return headers;
}

/**
 * Performs an SSRF-checked HTTP probe against a configured external open-data API URL.
 */
export async function probeExternalEndpoint(
  config: CustomApiEndpointConfig,
  fetchFn: FetchLike = fetch
): Promise<{
  probed: boolean;
  url: string;
  httpStatus?: number;
  responseTimeMs?: number;
  error?: string;
}> {
  const trimmedUrl = config.endpointUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmedUrl);
  } catch {
    return { probed: false, url: trimmedUrl, error: 'Invalid endpoint URL format.' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return {
      probed: false,
      url: trimmedUrl,
      error: 'Endpoint URL must use https:// or http://.',
    };
  }

  if (isBlockedHostnameOrIp(parsed.hostname)) {
    return {
      probed: false,
      url: trimmedUrl,
      error: 'Blocked target host: loopback, private, and link-local addresses are not permitted.',
    };
  }

  const headers = buildProbeHeaders(config);
  const startMs = Date.now();
  try {
    let response = await fetchFn(parsed.toString(), {
      method: 'HEAD',
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(EXTERNAL_API_PROBE_TIMEOUT_MS),
    });

    if (response.status === 405) {
      response = await fetchFn(parsed.toString(), {
        method: 'GET',
        headers,
        redirect: 'manual',
        signal: AbortSignal.timeout(EXTERNAL_API_PROBE_TIMEOUT_MS),
      });
    }

    const responseTimeMs = Math.max(0, Date.now() - startMs);
    const okStatus = response.status >= 200 && response.status < 400;
    return {
      probed: true,
      url: trimmedUrl,
      httpStatus: response.status,
      responseTimeMs,
      ...(okStatus ? {} : { error: `Remote endpoint returned HTTP ${response.status}` }),
    };
  } catch (err: unknown) {
    const responseTimeMs = Math.max(0, Date.now() - startMs);
    const errorMsg = err instanceof Error ? err.message : 'Network request failed';
    return {
      probed: true,
      url: trimmedUrl,
      responseTimeMs,
      error: `Endpoint unreachable: ${errorMsg}`,
    };
  }
}

/** In-memory sovereign baseline dataset store with verification gating. */
export interface VerificationService {
  getAllCountries(): BricsCountry[];
  getCountry(code: BricsCountryCode): BricsCountry;
  verifyAndSync(params: {
    countryCode: BricsCountryCode;
    dataset: BricsCountry;
    customApiConfig?: CustomApiEndpointConfig;
  }): Promise<{
    verificationResult: DatasetVerificationResult;
    updatedDataset: BricsCountry | null;
  }>;
}

/**
 * Creates a `VerificationService` seeded with deep clones of the baseline BRICS country datasets.
 */
export function createVerificationService(
  logger: Logger,
  fetchFn: FetchLike = fetch
): VerificationService {
  const store: Record<BricsCountryCode, BricsCountry> = JSON.parse(
    JSON.stringify(BRICS_COUNTRIES)
  ) as Record<BricsCountryCode, BricsCountry>;

  return {
    getAllCountries(): BricsCountry[] {
      return Object.values(store);
    },

    getCountry(code: BricsCountryCode): BricsCountry {
      return store[code];
    },

    async verifyAndSync({ countryCode, dataset, customApiConfig }) {
      const checks: DatasetVerificationCheck[] = DATASET_CHECK_SPECS.map((spec) => {
        const result = spec.evaluate(dataset);
        return {
          id: spec.id,
          name: spec.name,
          passed: result.passed,
          message: result.message,
          severity: result.passed ? 'success' : 'error',
        };
      });

      let endpointStatus: DatasetVerificationResult['endpointStatus'] = { probed: false };

      if (customApiConfig && customApiConfig.endpointUrl.trim().length > 0) {
        const probe = await probeExternalEndpoint(customApiConfig, fetchFn);
        endpointStatus = probe;
        const probePassed = Boolean(probe.probed && !probe.error);
        checks.push({
          id: 'api_endpoint_ping',
          name: 'External REST API Reachability',
          passed: probePassed,
          message: probePassed
            ? `Endpoint ${probe.url} responded with HTTP ${probe.httpStatus} in ${probe.responseTimeMs}ms.`
            : (probe.error ?? 'External endpoint probe failed.'),
          severity: probePassed ? 'success' : 'error',
        });
      } else {
        checks.push({
          id: 'api_endpoint_ping',
          name: 'Direct Registry Validation Mode',
          passed: true,
          message:
            'Schema validated locally; no external REST endpoint URL was configured to probe.',
          severity: 'success',
        });
      }

      const checksPassed = checks.filter((c) => c.passed).length;
      const checksTotal = checks.length;
      const verified = checksPassed === checksTotal;
      const timestamp = new Date().toISOString();

      // Reproducible SHA-256 of the canonical dataset payload (excluding volatile metadata)
      const { lastVerifiedTimestamp: _ts, sha256Digest: _hash, ...canonicalDataset } = dataset;
      const sha256Digest = computeCanonicalSha256(canonicalDataset);

      let updatedDataset: BricsCountry | null = null;
      if (verified) {
        updatedDataset = {
          ...dataset,
          code: countryCode,
          lastVerifiedTimestamp: timestamp,
          sha256Digest,
        };
        store[countryCode] = updatedDataset;
        logger.info('Dataset verified and persisted', {
          countryCode,
          sha256Digest,
          endpointProbed: endpointStatus.probed,
        });
      } else {
        logger.warn('Dataset verification failed; persistence skipped', {
          countryCode,
          failedChecks: checks.filter((c) => !c.passed).map((c) => c.id),
        });
      }

      return {
        verificationResult: {
          verified,
          timestamp,
          checksPassed,
          checksTotal,
          sha256Digest,
          checks,
          endpointStatus,
          appliedToState: verified,
        },
        updatedDataset,
      };
    },
  };
}
