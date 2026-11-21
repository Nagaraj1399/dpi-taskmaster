import { describe, expect, it } from 'vitest';
import { BRICS_COUNTRIES } from '../bricsData';
import {
  computeInfrastructureGapScore,
  computeSectorBaselineIndex,
  findMatchingInvestmentProgram,
} from '../scoring';

describe('Deterministic infrastructure scoring and program matching', () => {
  it('computes sector baseline indices accurately and preserves zero baselines', () => {
    const india = BRICS_COUNTRIES.IN;
    expect(computeSectorBaselineIndex(india, 'Roads & Highways')).toBe(
      india.infrastructureIndex.pavedRoadScore
    );
    expect(computeSectorBaselineIndex(india, 'Water & Sanitation')).toBe(
      india.infrastructureIndex.waterSanitationCoverage
    );
    expect(computeSectorBaselineIndex(india, 'Public Sanitation')).toBe(
      india.infrastructureIndex.waterSanitationCoverage
    );
    expect(computeSectorBaselineIndex(india, 'Digital & Power')).toBe(
      india.infrastructureIndex.broadbandConnectivity
    );

    const zeroCountry = {
      ...india,
      infrastructureIndex: {
        pavedRoadScore: 0,
        waterSanitationCoverage: 0,
        healthCentersPer10k: 0,
        broadbandConnectivity: 0,
        powerGridReliability: 0,
      },
    };
    expect(computeSectorBaselineIndex(zeroCountry, 'Healthcare')).toBe(0);
    expect(computeSectorBaselineIndex(zeroCountry, 'Roads & Highways')).toBe(0);
  });

  it('clamps infrastructure gap score between 15 and 98 across urgencies', () => {
    const perfectCountry = {
      ...BRICS_COUNTRIES.AE,
      infrastructureIndex: {
        pavedRoadScore: 100,
        waterSanitationCoverage: 100,
        healthCentersPer10k: 10,
        broadbandConnectivity: 100,
        powerGridReliability: 100,
      },
    };
    const zeroCountry = {
      ...BRICS_COUNTRIES.ET,
      infrastructureIndex: {
        pavedRoadScore: 0,
        waterSanitationCoverage: 0,
        healthCentersPer10k: 0,
        broadbandConnectivity: 0,
        powerGridReliability: 0,
      },
    };

    expect(computeInfrastructureGapScore(perfectCountry, 'Water & Sanitation', 'Low')).toBe(15);
    expect(computeInfrastructureGapScore(zeroCountry, 'Water & Sanitation', 'Emergency')).toBe(98);
    expect(
      computeInfrastructureGapScore(BRICS_COUNTRIES.IN, 'Water & Sanitation', 'High')
    ).toBeGreaterThan(
      computeInfrastructureGapScore(BRICS_COUNTRIES.IN, 'Water & Sanitation', 'Low')
    );
  });

  it('finds matching capital programs and returns null safely on empty topPrograms', () => {
    const matchedWater = findMatchingInvestmentProgram(BRICS_COUNTRIES.IN, 'Water & Sanitation');
    expect(matchedWater?.sector).toBe('Water & Sanitation');

    const matchedHealthcareFallback = findMatchingInvestmentProgram(
      BRICS_COUNTRIES.IN,
      'Public Sanitation'
    );
    expect(matchedHealthcareFallback).not.toBeNull();

    const emptyProgramsCountry = {
      ...BRICS_COUNTRIES.IN,
      publicInvestment: {
        ...BRICS_COUNTRIES.IN.publicInvestment,
        topPrograms: [],
      },
    };
    expect(findMatchingInvestmentProgram(emptyProgramsCountry, 'Water & Sanitation')).toBeNull();
  });
});
