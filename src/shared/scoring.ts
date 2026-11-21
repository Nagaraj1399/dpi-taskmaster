import {
  GAP_SCORE_BASE_OFFSET,
  GAP_SCORE_CEILING,
  GAP_SCORE_FLOOR,
  HEALTH_CENTERS_SCORE_MULTIPLIER,
  SCORE_MAX,
  URGENCY_MULTIPLIERS,
} from './constants.js';
import type {
  BricsCountry,
  GrievanceSector,
  GrievanceUrgency,
  PublicInvestmentProgram,
} from './types.js';

/**
 * Resolves the normalized 0-100 baseline infrastructure index for a country and sector.
 */
export function computeSectorBaselineIndex(country: BricsCountry, sector: GrievanceSector): number {
  const idx = country.infrastructureIndex;
  switch (sector) {
    case 'Roads & Highways':
      return idx.pavedRoadScore;
    case 'Water & Sanitation':
    case 'Public Sanitation':
      return idx.waterSanitationCoverage;
    case 'Healthcare':
      return Math.min(SCORE_MAX, idx.healthCentersPer10k * HEALTH_CENTERS_SCORE_MULTIPLIER);
    case 'Digital & Power':
      return idx.broadbandConnectivity;
  }
}

/**
 * Computes a deterministic infrastructure gap severity score (15-98) from
 * the sector baseline deficit and citizen urgency multiplier.
 */
export function computeInfrastructureGapScore(
  country: BricsCountry,
  sector: GrievanceSector,
  urgency: GrievanceUrgency
): number {
  const baselineScore = computeSectorBaselineIndex(country, sector);
  const multiplier = URGENCY_MULTIPLIERS[urgency];
  const rawScore = (SCORE_MAX - baselineScore) * multiplier + GAP_SCORE_BASE_OFFSET;
  return Math.min(GAP_SCORE_CEILING, Math.round(Math.max(GAP_SCORE_FLOOR, rawScore)));
}

/**
 * Finds the best matching public investment program for a given sector,
 * safely returning `null` if the country has no configured programs.
 */
export function findMatchingInvestmentProgram(
  country: BricsCountry,
  sector: GrievanceSector
): PublicInvestmentProgram | null {
  const programs = country.publicInvestment.topPrograms;
  if (programs.length === 0) {
    return null;
  }

  const sectorKeyword = sector.toLowerCase().split(' ')[0] ?? '';
  const match = programs.find((p) => p.sector.toLowerCase().includes(sectorKeyword));
  return match ?? programs[0] ?? null;
}
