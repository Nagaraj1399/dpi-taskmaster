export type BricsCountryCode = 
  | 'BR' // Brazil
  | 'RU' // Russia
  | 'IN' // India
  | 'CN' // China
  | 'ZA' // South Africa
  | 'EG' // Egypt
  | 'ET' // Ethiopia
  | 'IR' // Iran
  | 'SA' // Saudi Arabia
  | 'AE' // United Arab Emirates
  | 'ID'; // Indonesia (BRICS+ Partner)

export interface BricsCountry {
  code: BricsCountryCode;
  name: string;
  nativeName: string;
  flag: string;
  capital: string;
  populationMillions: number;
  openDataPortalName: string;
  openDataPortalUrl: string;
  censusAgency: string;
  primaryLanguages: string[];
  sampleRegions: string[];
  demographics: {
    totalPopulation: string;
    ruralPercentage: number;
    urbanPercentage: number;
    densityPerKm2: number;
    vulnerableDemographicIndex: number; // 0-100
    literacyRate: number;
  };
  infrastructureIndex: {
    pavedRoadScore: number; // 0-100
    waterSanitationCoverage: number; // %
    healthCentersPer10k: number;
    broadbandConnectivity: number; // %
    powerGridReliability: number; // %
  };
  publicInvestment: {
    fiscalYear: string;
    totalBudgetUSD: string;
    allocatedProjectsCount: number;
    disbursementRate: number; // %
    topPrograms: Array<{
      name: string;
      tamilName?: string;
      budgetUSD: string;
      sector: 'Roads & Highways' | 'Water & Sanitation' | 'Healthcare' | 'Digital & Power' | 'Education';
      status: 'On Track' | 'Delayed' | 'Critical Review' | 'Completed';
    }>;
  };
  // Public data from screenshot (FAO, WHO, Copernicus)
  publicDataFeeds: {
    whoHealthIndex: number; // 0-100
    faoAgriWaterStress: number; // %
    copernicusSatelliteHeatScore: number; // 0-100
    meteorologicalAlertLevel: 'Normal' | 'Advisory' | 'Critical Flood/Drought';
  };
}

export type GrievanceChannel = 'Voice IVR' | 'Messaging Apps' | 'Web Portals' | 'SMS Telephony' | 'Multimodal Photo Inspection';

export interface CitizenGrievance {
  id: string;
  countryCode: BricsCountryCode;
  region: string;
  channel: GrievanceChannel;
  originalText: string;
  originalLanguage: string;
  englishTranslation?: string;
  sector: 'Roads & Highways' | 'Water & Sanitation' | 'Healthcare' | 'Digital & Power' | 'Public Sanitation';
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  timestamp: string;
  citizenContactAnonymized: string;
  audioDurationSeconds?: number;
  photoUrl?: string;
  photoDescription?: string;
  visionDamageScore?: number; // 0-100
  status: 'Ingested' | 'Processing Fusion' | 'Cross-Referenced' | 'Action Routed';
}

export interface DemandHotspot {
  id: string;
  countryCode: BricsCountryCode;
  region: string;
  sector: string;
  demandIntensityScore: number; // 0-100
  reportedGrievanceCount: number;
  affectedPopulationEst: number;
  infrastructureGapIndex: number; // 0-100
  activePublicProject: string;
  budgetAllocatedUSD: string;
  disbursementVelocity: 'On Track' | 'Stalled' | 'Under-funded';
  recommendedIntervention: string;
  urgencyRank: 1 | 2 | 3 | 4 | 5;
}

export interface PolicymakerProjectRecommendation {
  id: string;
  countryCode: BricsCountryCode;
  projectName: string;
  sector: 'Roads & Highways' | 'Water & Sanitation' | 'Healthcare' | 'Digital & Power' | 'Agricultural Irrigation';
  priorityLevel: 'Immediate (0-30 Days)' | 'High Priority (Q1)' | 'Strategic Planning';
  estimatedCostUSD: string;
  projectedBeneficiaries: number;
  fusedEvidenceRationale: string;
  sourceBaselineDatasets: string[];
  recommendedProcurementAction: string;
  dpgComplianceStandard: 'DPG Verified' | 'Audit Ready';
}

export interface FusionResult {
  grievanceId: string;
  timestamp: string;
  countryCode: BricsCountryCode;
  region: string;
  sector: string;
  summaryAnalysis: string;
  demographicContext: {
    affectedPopulationEst: number;
    vulnerabilityWeight: number;
    censusSource: string;
  };
  infrastructureGapAnalysis: {
    baselineIndex: number;
    reportedDeficiency: string;
    gapSeverityScore: number; // 1-100
    officialDatasetReference: string;
  };
  publicInvestmentAlignment: {
    allocatedBudgetFound: boolean;
    matchingProgramName: string;
    allocatedAmountUSD: string;
    disbursementStatus: string;
    fiscalVarianceNote: string;
  };
  environmentalPublicDataOverlay?: {
    whoHealthContext: string;
    faoAgriContext: string;
    copernicusSatelliteContext: string;
  };
  actionableRecommendations: string[];
  telemetry: DataFusionTelemetry;
  zeroHallucinationProof: {
    authorizedPortalsConsulted: string[];
    verificationHash: string;
    provenanceConfidenceScore: number; // e.g. 99.8%
    dataTimestamp: string;
  };
}

export interface CustomApiEndpointConfig {
  endpointUrl: string;
  apiKey?: string;
  authHeaderType: 'Bearer' | 'ApiKey' | 'Custom' | 'None';
  customHeaderKey?: string;
  customHeaderValue?: string;
  syncIntervalMinutes: number;
  lastSyncStatus: 'Connected (200 OK)' | 'Pending Verification' | 'Failed' | 'Idle';
  lastSyncTimestamp?: string;
}

export interface DatasetVerificationCheck {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  severity: 'success' | 'warning' | 'error';
}

export interface DatasetVerificationResult {
  verified: boolean;
  timestamp: string;
  confidenceScore: number;
  sha256Proof: string;
  checks: DatasetVerificationCheck[];
  endpointStatus?: {
    httpStatus: number;
    responseTimeMs: number;
    serverSignature: string;
  };
  appliedToState: boolean;
}

export interface DataFusionTelemetry {
  brics_data_fusion_telemetry: {
    source_type: string;
    dataset_categories: string[];
    verification_status: string;
    dpg_compliance: boolean;
  };
  citizen_grievance_integration: {
    ingestion_channels: string[];
    cross_reference_status: string;
  };
}
