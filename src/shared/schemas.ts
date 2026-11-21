import { z } from 'zod';
import {
  BRICS_COUNTRY_CODES,
  FORBIDDEN_OBJECT_KEYS,
  HEALTH_CENTERS_MAX_PER_10K,
  SCORE_MAX,
  SCORE_MIN,
} from './constants.js';

/**
 * Recursively checks any parsed JSON value for prototype-pollution keys
 * (`__proto__`, `constructor`, `prototype`).
 */
export function hasForbiddenObjectKeys(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  if (seen.has(value)) {
    return false;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenObjectKeys(item, seen));
  }

  for (const key of Object.getOwnPropertyNames(value)) {
    if (FORBIDDEN_OBJECT_KEYS.has(key)) {
      return true;
    }
    const record = value as Record<string, unknown>;
    if (hasForbiddenObjectKeys(record[key], seen)) {
      return true;
    }
  }
  return false;
}

/** Zod schema validating an allowlisted BRICS+ country code. */
export const BricsCountryCodeSchema = z.enum(BRICS_COUNTRY_CODES);

/** Zod schema validating national demographic census metrics. */
export const DemographicsSchema = z.object({
  totalPopulation: z.string().trim().min(1, 'Total population is required').max(64),
  ruralPercentage: z.number().min(SCORE_MIN).max(SCORE_MAX),
  urbanPercentage: z.number().min(SCORE_MIN).max(SCORE_MAX),
  densityPerKm2: z.number().min(0).max(100_000),
  vulnerableDemographicIndex: z.number().min(SCORE_MIN).max(SCORE_MAX),
  literacyRate: z.number().min(SCORE_MIN).max(SCORE_MAX),
});

/** Zod schema validating normalized infrastructure baseline indices. */
export const InfrastructureIndexSchema = z.object({
  pavedRoadScore: z.number().min(SCORE_MIN).max(SCORE_MAX),
  waterSanitationCoverage: z.number().min(SCORE_MIN).max(SCORE_MAX),
  healthCentersPer10k: z.number().min(0).max(HEALTH_CENTERS_MAX_PER_10K),
  broadbandConnectivity: z.number().min(SCORE_MIN).max(SCORE_MAX),
  powerGridReliability: z.number().min(SCORE_MIN).max(SCORE_MAX),
});

/** Zod schema validating an individual public investment program entry. */
export const PublicInvestmentProgramSchema = z.object({
  name: z.string().trim().min(1, 'Program name is required').max(200),
  tamilName: z.string().trim().max(200).optional(),
  budgetUSD: z.string().trim().min(1, 'Program budget is required').max(80),
  sector: z.enum([
    'Roads & Highways',
    'Water & Sanitation',
    'Healthcare',
    'Digital & Power',
    'Education',
  ]),
  status: z.enum(['On Track', 'Delayed', 'Critical Review', 'Completed']),
});

/** Zod schema validating national public investment plans. */
export const PublicInvestmentSchema = z.object({
  fiscalYear: z.string().trim().min(1).max(32),
  totalBudgetUSD: z.string().trim().min(1, 'Total budget outlay is required').max(80),
  allocatedProjectsCount: z.number().int().min(0),
  disbursementRate: z.number().min(SCORE_MIN).max(SCORE_MAX),
  topPrograms: z
    .array(PublicInvestmentProgramSchema)
    .min(1, 'At least one public investment program is required'),
});

/** Zod schema validating WHO/FAO/Copernicus environmental & health feeds. */
export const PublicDataFeedsSchema = z.object({
  whoHealthIndex: z.number().min(SCORE_MIN).max(SCORE_MAX),
  faoAgriWaterStress: z.number().min(SCORE_MIN).max(SCORE_MAX),
  copernicusSatelliteHeatScore: z.number().min(SCORE_MIN).max(SCORE_MAX),
  meteorologicalAlertLevel: z.enum(['Normal', 'Advisory', 'Critical Flood/Drought']),
});

/** Zod schema validating a full BRICS country dataset object (also used for JSON import). */
export const BricsCountrySchema = z.object({
  code: BricsCountryCodeSchema,
  name: z.string().trim().min(1).max(120),
  nativeName: z.string().trim().min(1).max(120),
  flag: z.string().trim().min(1).max(16),
  capital: z.string().trim().min(1).max(120),
  populationMillions: z.number().min(0),
  openDataPortalName: z.string().trim().min(1).max(180),
  openDataPortalUrl: z.string().url(),
  censusAgency: z.string().trim().min(1).max(180),
  primaryLanguages: z.array(z.string().trim().min(1)).min(1),
  sampleRegions: z.array(z.string().trim().min(1)).min(1),
  demographics: DemographicsSchema,
  infrastructureIndex: InfrastructureIndexSchema,
  publicInvestment: PublicInvestmentSchema,
  publicDataFeeds: PublicDataFeedsSchema,
  lastVerifiedTimestamp: z.string().optional(),
  sha256Digest: z.string().optional(),
});

/** Zod schema validating custom government API connector settings. */
export const CustomApiEndpointConfigSchema = z.object({
  endpointUrl: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === 'https:' || parsed.protocol === 'http:';
        } catch {
          return false;
        }
      },
      { message: 'Endpoint URL must be a valid http:// or https:// URL' }
    ),
  apiKey: z.string().max(512).optional(),
  authHeaderType: z.enum(['Bearer', 'ApiKey', 'Custom', 'None']),
  customHeaderKey: z.string().max(128).optional(),
  customHeaderValue: z.string().max(512).optional(),
  syncIntervalMinutes: z.number().int().min(1).max(10_080),
  lastSyncStatus: z.enum(['Connected', 'Pending Verification', 'Failed', 'Idle']),
  lastSyncTimestamp: z.string().optional(),
});

/** Zod schema validating `POST /api/datasets/verify-and-sync` requests. */
export const VerifyAndSyncRequestSchema = z.object({
  countryCode: BricsCountryCodeSchema,
  dataset: BricsCountrySchema,
  customApiConfig: CustomApiEndpointConfigSchema.optional(),
});

/** Zod schema validating citizen grievance submissions in `/api/fusion/analyze`. */
export const CitizenGrievanceInputSchema = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  countryCode: BricsCountryCodeSchema.optional(),
  region: z.string().trim().min(1, 'Region is required').max(180),
  channel: z.enum([
    'Voice IVR',
    'Messaging Apps',
    'Web Portals',
    'SMS Telephony',
    'Multimodal Photo Inspection',
  ]),
  originalText: z.string().trim().min(3, 'Grievance text must be at least 3 characters').max(4_000),
  originalLanguage: z.string().trim().min(1).max(80),
  sector: z.enum([
    'Roads & Highways',
    'Water & Sanitation',
    'Healthcare',
    'Digital & Power',
    'Public Sanitation',
  ]),
  urgency: z.enum(['Low', 'Medium', 'High', 'Emergency']),
});

/** Zod schema validating `POST /api/fusion/analyze` requests. */
export const FusionAnalyzeRequestSchema = z.object({
  countryCode: BricsCountryCodeSchema,
  grievance: CitizenGrievanceInputSchema,
});

/** Zod schema validating structured JSON returned by Gemini for fusion analysis. */
export const FusionAiOutputSchema = z.object({
  summaryAnalysis: z.string().trim().min(1),
  englishTranslation: z.string().trim().optional(),
  affectedPopulationEst: z.number().int().min(1),
  vulnerabilityWeight: z.number().min(SCORE_MIN).max(SCORE_MAX).optional(),
  reportedDeficiency: z.string().trim().min(1),
  gapSeverityScore: z.number().int().min(1).max(SCORE_MAX),
  matchingProgramName: z.string().trim().min(1),
  allocatedAmountUSD: z.string().trim().optional(),
  disbursementStatus: z.string().trim().optional(),
  fiscalVarianceNote: z.string().trim().min(1),
  actionableRecommendations: z.array(z.string().trim().min(1)).min(1).max(6),
  authorizedPortalsConsulted: z.array(z.string().trim().min(1)).optional(),
});

/** Zod schema validating `POST /api/vision/analyze-photo` requests. */
export const VisionAnalyzeRequestSchema = z
  .object({
    photoUrl: z.string().url().optional(),
    imageBase64: z.string().min(16).optional(),
    sector: z.string().trim().max(80).optional(),
    countryCode: BricsCountryCodeSchema,
    region: z.string().trim().max(180).optional(),
  })
  .refine((data) => Boolean(data.imageBase64 || data.photoUrl), {
    message: 'Either imageBase64 or photoUrl is required for photo analysis',
  });

/** Zod schema validating structured JSON returned by Gemini Vision. */
export const VisionAiOutputSchema = z.object({
  detectedIssue: z.string().trim().min(1),
  severityScore: z.number().int().min(1).max(SCORE_MAX),
  infrastructureCategory: z.string().trim().min(1),
  estimatedRepairUrgency: z.string().trim().min(1),
  featuresIdentified: z.array(z.string().trim().min(1)).min(1),
});

/** Zod schema validating `POST /api/voice/process-ivr` requests. */
export const IvrProcessRequestSchema = z.object({
  callerPhone: z.string().trim().max(40).optional(),
  keypadSelection: z.string().trim().max(64).optional(),
  speechTranscript: z.string().trim().max(2_000).optional(),
  countryCode: BricsCountryCodeSchema,
});
