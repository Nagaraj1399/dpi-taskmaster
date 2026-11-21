import type { BricsCountry, PublicInvestmentProgram } from '../../shared/types';

/** Stable preset identifier union. */
export type DatasetPresetId = 'mospi_2024' | 'jal_jeevan' | 'tamil_nadu' | 'nhai_roads';

/** Configuration descriptor for an official dataset preset. */
export interface DatasetPreset {
  id: DatasetPresetId;
  title: string;
  description: string;
  accentClass: string;
  apply: (prev: BricsCountry) => BricsCountry;
}

const JAL_JEEVAN_PROGRAM_KEY = 'Jal Jeevan Mission (Har Ghar Jal - Rural Tap Water)';
const PMGSY_PROGRAM_KEY = 'Pradhan Mantri Gram Sadak Yojana (PMGSY Phase IV)';

function replaceOrPrependProgram(
  programs: PublicInvestmentProgram[],
  replacement: PublicInvestmentProgram,
  supersededNames: readonly string[]
): PublicInvestmentProgram[] {
  const supersededSet = new Set(supersededNames);
  return [replacement, ...programs.filter((p) => !supersededSet.has(p.name))];
}

/**
 * Curated official dataset presets using stable IDs and deterministic replacements.
 */
export const DATASET_PRESETS: readonly DatasetPreset[] = [
  {
    id: 'mospi_2024',
    title: 'MoSPI 2024-2025 Revised National Baseline',
    description: 'Updates population to 1.438B, 63.8% rural, literacy to 78.4%.',
    accentClass: 'text-emerald-700 hover:border-emerald-500',
    apply: (prev) => ({
      ...prev,
      demographics: {
        totalPopulation: '1,438,200,000',
        ruralPercentage: 63.8,
        urbanPercentage: 36.2,
        densityPerKm2: 438,
        vulnerableDemographicIndex: 39.5,
        literacyRate: 78.4,
      },
      censusAgency: 'Ministry of Statistics & Programme Implementation (MoSPI 2024 Baseline)',
    }),
  },
  {
    id: 'jal_jeevan',
    title: 'Jal Jeevan Mission Q3 Audit',
    description: 'Sets tap water to 79.4% and updates $43.8B water infrastructure outlay.',
    accentClass: 'text-cyan-700 hover:border-cyan-500',
    apply: (prev) => ({
      ...prev,
      infrastructureIndex: {
        ...prev.infrastructureIndex,
        waterSanitationCoverage: 79.4,
      },
      publicInvestment: {
        ...prev.publicInvestment,
        totalBudgetUSD: '$142.5 Billion (INR 11.8 Lakh Cr)',
        disbursementRate: 74.2,
        topPrograms: replaceOrPrependProgram(
          prev.publicInvestment.topPrograms,
          {
            name: JAL_JEEVAN_PROGRAM_KEY,
            tamilName: 'ஜல் ஜீவன் கிராமப்புற குடிநீர் திட்டம்',
            budgetUSD: '$43.8 Billion',
            sector: 'Water & Sanitation',
            status: 'On Track',
          },
          ['Jal Jeevan Mission (Har Ghar Jal)', JAL_JEEVAN_PROGRAM_KEY]
        ),
      },
    }),
  },
  {
    id: 'tamil_nadu',
    title: 'Tamil Nadu Regional Dataset',
    description:
      'Pop: 76.8M, 84 road score, 88% water, $38.5B state budget with priority programs.',
    accentClass: 'text-emerald-800 hover:border-emerald-500',
    apply: (prev) => ({
      ...prev,
      name: 'India - Tamil Nadu Sub-National Registry',
      nativeName: 'பாரதம் - தமிழ்நாடு',
      demographics: {
        totalPopulation: '76,860,000',
        ruralPercentage: 48.6,
        urbanPercentage: 51.4,
        densityPerKm2: 555,
        vulnerableDemographicIndex: 26.2,
        literacyRate: 83.2,
      },
      infrastructureIndex: {
        pavedRoadScore: 84,
        waterSanitationCoverage: 88,
        healthCentersPer10k: 3.4,
        broadbandConnectivity: 81,
        powerGridReliability: 94,
      },
      publicInvestment: {
        fiscalYear: 'FY 2025-2026',
        totalBudgetUSD: '$38.5 Billion (TN State Budget)',
        allocatedProjectsCount: 1420,
        disbursementRate: 81.5,
        topPrograms: [
          {
            name: 'Tamil Nadu Rural Water & Sanitation Mission',
            tamilName: 'தமிழ்நாடு ஊரக குடிநீர் மற்றும் சுகாதார திட்டம்',
            budgetUSD: '$4.8 Billion',
            sector: 'Water & Sanitation',
            status: 'On Track',
          },
          {
            name: 'Tamil Nadu State Highways & Rural Connectivity',
            tamilName: 'மாநில நெடுஞ்சாலைகள் மற்றும் ஊரக இணைப்பு திட்டம்',
            budgetUSD: '$7.2 Billion',
            sector: 'Roads & Highways',
            status: 'On Track',
          },
          {
            name: 'Makkalai Thedi Maruthuvam (Healthcare at Doorsteps)',
            tamilName: 'மக்களைத் தேடி மருத்துவம் திட்டம்',
            budgetUSD: '$2.1 Billion',
            sector: 'Healthcare',
            status: 'On Track',
          },
        ],
      },
    }),
  },
  {
    id: 'nhai_roads',
    title: 'PMGSY Rural Roads & NHAI Corridor Data',
    description: 'Sets road score to 78 and updates PMGSY Phase IV investment line.',
    accentClass: 'text-amber-800 hover:border-amber-500',
    apply: (prev) => ({
      ...prev,
      infrastructureIndex: {
        ...prev.infrastructureIndex,
        pavedRoadScore: 78,
      },
      publicInvestment: {
        ...prev.publicInvestment,
        topPrograms: replaceOrPrependProgram(
          prev.publicInvestment.topPrograms,
          {
            name: PMGSY_PROGRAM_KEY,
            tamilName: 'பிரதமர் கிராமப்புற சாலைகள் திட்டம் (PMGSY)',
            budgetUSD: '$28.4 Billion',
            sector: 'Roads & Highways',
            status: 'On Track',
          },
          ['Pradhan Mantri Gram Sadak Yojana (PMGSY)', PMGSY_PROGRAM_KEY]
        ),
      },
    }),
  },
];
