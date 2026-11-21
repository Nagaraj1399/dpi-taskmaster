import { describe, expect, it, vi } from 'vitest';
import { BRICS_COUNTRIES } from '../../shared/bricsData';
import type { Logger } from '../logger';
import {
  computeCanonicalSha256,
  createVerificationService,
  isBlockedHostnameOrIp,
} from '../services/verification';

const silentLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

describe('Dataset verification service and SSRF protections', () => {
  it('computes identical canonical SHA-256 digests regardless of object key insertion order', () => {
    const first = { a: 1, b: { x: 10, y: 20 } };
    const reordered = { b: { y: 20, x: 10 }, a: 1 };

    const hashA = computeCanonicalSha256(first);
    const hashB = computeCanonicalSha256(reordered);

    expect(hashA).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(hashA).toBe(hashB);
  });

  it('blocks loopback, private, IPv4-mapped IPv6, multicast, and cloud metadata addresses from SSRF probing', () => {
    expect(isBlockedHostnameOrIp('localhost')).toBe(true);
    expect(isBlockedHostnameOrIp('127.0.0.1')).toBe(true);
    expect(isBlockedHostnameOrIp('169.254.169.254')).toBe(true);
    expect(isBlockedHostnameOrIp('10.24.0.1')).toBe(true);
    expect(isBlockedHostnameOrIp('192.168.1.10')).toBe(true);
    expect(isBlockedHostnameOrIp('172.16.0.5')).toBe(true);
    expect(isBlockedHostnameOrIp('224.0.0.1')).toBe(true);
    expect(isBlockedHostnameOrIp('::1')).toBe(true);
    expect(isBlockedHostnameOrIp('::ffff:127.0.0.1')).toBe(true);
    expect(isBlockedHostnameOrIp('::ffff:7f00:1')).toBe(true);
    expect(isBlockedHostnameOrIp('::ffff:169.254.169.254')).toBe(true);
    expect(isBlockedHostnameOrIp('data.gov.in')).toBe(false);
    expect(isBlockedHostnameOrIp('8.8.8.8')).toBe(false);
  });

  it('ignores restricted hop-by-hop custom probe headers like Host', async () => {
    const okFetch = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 }));
    const service = createVerificationService(silentLogger, okFetch);

    await service.verifyAndSync({
      countryCode: 'IN',
      dataset: BRICS_COUNTRIES.IN,
      customApiConfig: {
        endpointUrl: 'https://api.data.gov.in/resource/test',
        authHeaderType: 'Custom',
        customHeaderKey: 'Host',
        customHeaderValue: 'evil.example',
        syncIntervalMinutes: 60,
        lastSyncStatus: 'Idle',
      },
    });

    const callInit = okFetch.mock.calls[0]?.[1];
    expect(callInit?.headers).toEqual({ Accept: 'application/json' });
  });

  it('does not persist dataset updates when schema verification fails', async () => {
    const service = createVerificationService(silentLogger);
    const originalPop = service.getCountry('IN').demographics.totalPopulation;

    const invalidDataset = {
      ...BRICS_COUNTRIES.IN,
      demographics: {
        ...BRICS_COUNTRIES.IN.demographics,
        totalPopulation: '999,999,999',
        ruralPercentage: 70,
        urbanPercentage: 60, // sum > 100 -> fails check
      },
    };

    const { verificationResult, updatedDataset } = await service.verifyAndSync({
      countryCode: 'IN',
      dataset: invalidDataset,
    });

    expect(verificationResult.verified).toBe(false);
    expect(verificationResult.appliedToState).toBe(false);
    expect(updatedDataset).toBeNull();
    expect(service.getCountry('IN').demographics.totalPopulation).toBe(originalPop);
  });

  it('probes configured external endpoint honestly and marks failure when remote returns HTTP 500', async () => {
    const failingFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 500 }));
    const service = createVerificationService(silentLogger, failingFetch);

    const { verificationResult, updatedDataset } = await service.verifyAndSync({
      countryCode: 'IN',
      dataset: BRICS_COUNTRIES.IN,
      customApiConfig: {
        endpointUrl: 'https://api.data.gov.in/resource/test',
        authHeaderType: 'None',
        syncIntervalMinutes: 60,
        lastSyncStatus: 'Idle',
      },
    });

    expect(failingFetch).toHaveBeenCalledTimes(1);
    expect(verificationResult.verified).toBe(false);
    expect(verificationResult.appliedToState).toBe(false);
    expect(verificationResult.endpointStatus?.probed).toBe(true);
    expect(verificationResult.endpointStatus?.httpStatus).toBe(500);
    expect(updatedDataset).toBeNull();
  });

  it('persists verified dataset when schema checks and remote probe both succeed', async () => {
    const okFetch = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 }));
    const service = createVerificationService(silentLogger, okFetch);

    const modified = {
      ...BRICS_COUNTRIES.IN,
      demographics: {
        ...BRICS_COUNTRIES.IN.demographics,
        totalPopulation: '1,440,000,000',
      },
    };

    const { verificationResult, updatedDataset } = await service.verifyAndSync({
      countryCode: 'IN',
      dataset: modified,
      customApiConfig: {
        endpointUrl: 'https://api.data.gov.in/resource/test',
        authHeaderType: 'Bearer',
        apiKey: 'demo-token',
        syncIntervalMinutes: 30,
        lastSyncStatus: 'Idle',
      },
    });

    expect(verificationResult.verified).toBe(true);
    expect(verificationResult.appliedToState).toBe(true);
    expect(updatedDataset?.demographics.totalPopulation).toBe('1,440,000,000');
    expect(service.getCountry('IN').demographics.totalPopulation).toBe('1,440,000,000');
  });
});
