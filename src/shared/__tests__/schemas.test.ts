import { describe, expect, it } from 'vitest';
import { BRICS_COUNTRIES } from '../bricsData';
import { BRICS_COUNTRY_CODES } from '../constants';
import {
  BricsCountryCodeSchema,
  BricsCountrySchema,
  FusionAnalyzeRequestSchema,
  hasForbiddenObjectKeys,
  IvrProcessRequestSchema,
  VerifyAndSyncRequestSchema,
  VisionAnalyzeRequestSchema,
} from '../schemas';

describe('Zod validation schemas and prototype-pollution guards', () => {
  it('accepts every allowlisted BRICS country code and rejects unknown codes', () => {
    for (const code of BRICS_COUNTRY_CODES) {
      expect(BricsCountryCodeSchema.safeParse(code).success).toBe(true);
    }
    expect(BricsCountryCodeSchema.safeParse('US').success).toBe(false);
    expect(BricsCountryCodeSchema.safeParse('').success).toBe(false);
    expect(BricsCountryCodeSchema.safeParse('in').success).toBe(false);
  });

  it('detects __proto__, constructor, and prototype keys recursively', () => {
    const protoPayload: unknown = JSON.parse('{"nested":{"__proto__":{"polluted":true}}}');
    const constructorPayload: unknown = JSON.parse('{"items":[{"constructor":{"bad":1}}]}');
    const prototypePayload: unknown = JSON.parse('{"prototype":{}}');

    expect(hasForbiddenObjectKeys(protoPayload)).toBe(true);
    expect(hasForbiddenObjectKeys(constructorPayload)).toBe(true);
    expect(hasForbiddenObjectKeys(prototypePayload)).toBe(true);
    expect(hasForbiddenObjectKeys({ countryCode: 'IN', region: 'Madurai' })).toBe(false);
  });

  it('validates complete BRICS country datasets including explicit 0 metric values', () => {
    const zeroBaseline = {
      ...BRICS_COUNTRIES.IN,
      demographics: {
        ...BRICS_COUNTRIES.IN.demographics,
        ruralPercentage: 0,
        urbanPercentage: 100,
        densityPerKm2: 0,
        vulnerableDemographicIndex: 0,
        literacyRate: 0,
      },
      infrastructureIndex: {
        pavedRoadScore: 0,
        waterSanitationCoverage: 0,
        healthCentersPer10k: 0,
        broadbandConnectivity: 0,
        powerGridReliability: 0,
      },
    };

    expect(BricsCountrySchema.safeParse(zeroBaseline).success).toBe(true);
    expect(
      VerifyAndSyncRequestSchema.safeParse({
        countryCode: 'IN',
        dataset: zeroBaseline,
      }).success
    ).toBe(true);
  });

  it('rejects invalid fusion, vision, and IVR requests with clear field issues', () => {
    expect(
      FusionAnalyzeRequestSchema.safeParse({
        countryCode: 'ZZ',
        grievance: {
          region: 'Test',
          channel: 'Voice IVR',
          originalText: 'No',
          originalLanguage: 'Tamil',
          sector: 'Healthcare',
          urgency: 'High',
        },
      }).success
    ).toBe(false);

    expect(
      VisionAnalyzeRequestSchema.safeParse({
        countryCode: 'IN',
        region: 'Chennai',
      }).success
    ).toBe(false);

    expect(
      VisionAnalyzeRequestSchema.safeParse({
        countryCode: 'IN',
        photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800',
      }).success
    ).toBe(true);

    expect(
      IvrProcessRequestSchema.safeParse({
        countryCode: 'BR',
        keypadSelection: '1',
      }).success
    ).toBe(true);
  });
});
