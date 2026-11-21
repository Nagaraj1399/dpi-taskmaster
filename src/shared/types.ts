import { BRICS_COUNTRY_CODES } from './constants.js';

/** Valid BRICS+ country code union derived from the allowlist. */
export type BricsCountryCode = (typeof BRICS_COUNTRY_CODES)[number];

/** Public investment sector categories. */
export type InvestmentSector =
  'Roads & Highways' | 'Water & Sanitation' | 'Healthcare' | 'Digital & Power' | 'Education';

/** Citizen grievance sector categories. */
export type GrievanceSector =
  | 'Roads & Highways'
  | 'Water & Sanitation'
  | 'Healthcare'
  | 'Digital & Power'
  | 'Public Sanitation';

/** Capital program execution status. */
export type ProgramStatus = 'On Track' | 'Delayed' | 'Critical Review' | 'Completed';

/** Meteorological alert classification. */
export type MeteorologicalAlertLevel = 'Normal' | 'Advisory' | 'Critical Flood/Drought';

/** Citizen grievance urgency rating. */
export type GrievanceUrgency = 'Low' | 'Medium' | 'High' | 'Emergency';

/** Public investment program entry within a country baseline. */
export interface PublicInvestmentProgram {
  name: string;
  tamilName?: string;
  budgetUSD: string;
  sector: InvestmentSector;
  status: ProgramStatus;
}

/** Complete baseline dataset profile for a BRICS member or partner nation. */
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
    vulnerableDemographicIndex: number;
    literacyRate: number;
  };
  infrastructureIndex: {
    pavedRoadScore: number;
    waterSanitationCoverage: number;
    healthCentersPer10k: number;
    broadbandConnectivity: number;
    powerGridReliability: number;
  };
  publicInvestment: {
    fiscalYear: string;
    totalBudgetUSD: string;
    allocatedProjectsCount: number;
    disbursementRate: number;
    topPrograms: PublicInvestmentProgram[];
  };
  publicDataFeeds: {
    whoHealthIndex: number;
    faoAgriWaterStress: number;
    copernicusSatelliteHeatScore: number;
    meteorologicalAlertLevel: MeteorologicalAlertLevel;
  };
  lastVerifiedTimestamp?: string;
  sha256Digest?: string;
}

/** Supported citizen ingestion channels. */
export type GrievanceChannel =
  'Voice IVR' | 'Messaging Apps' | 'Web Portals' | 'SMS Telephony' | 'Multimodal Photo Inspection';

/** Citizen grievance record submitted for fusion analysis. */
export interface CitizenGrievance {
  id: string;
  countryCode: BricsCountryCode;
  region: string;
  channel: GrievanceChannel;
  originalText: string;
  originalLanguage: string;
  englishTranslation?: string;
  sector: GrievanceSector;
  urgency: GrievanceUrgency;
  timestamp: string;
  citizenContactAnonymized: string;
  audioDurationSeconds?: number;
  photoUrl?: string;
  photoDescription?: string;
  visionDamageScore?: number;
  status: 'Ingested' | 'Processing Fusion' | 'Cross-Referenced' | 'Action Routed';
}

/** Spatial demand hotspot entry for policymaker prioritization. */
export interface DemandHotspot {
  id: string;
  countryCode: BricsCountryCode;
  region: string;
  sector: string;
  demandIntensityScore: number;
  reportedGrievanceCount: number;
  affectedPopulationEst: number;
  infrastructureGapIndex: number;
  activePublicProject: string;
  budgetAllocatedUSD: string;
  disbursementVelocity: 'On Track' | 'Stalled' | 'Under-funded';
  recommendedIntervention: string;
  urgencyRank: 1 | 2 | 3 | 4 | 5;
}

/** Recommended policy intervention project for national planning commissions. */
export interface PolicymakerProjectRecommendation {
  id: string;
  countryCode: BricsCountryCode;
  projectName: string;
  sector:
    | 'Roads & Highways'
    | 'Water & Sanitation'
    | 'Healthcare'
    | 'Digital & Power'
    | 'Agricultural Irrigation';
  priorityLevel: 'Immediate (0-30 Days)' | 'High Priority (Q1)' | 'Strategic Planning';
  estimatedCostUSD: string;
  projectedBeneficiaries: number;
  fusedEvidenceRationale: string;
  sourceBaselineDatasets: string[];
  recommendedProcurementAction: string;
  dpgComplianceStandard: 'DPG Verified' | 'Audit Ready';
}

/** Interoperable telemetry metadata attached to a fusion response. */
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

/** Complete AI data fusion output returned by `/api/fusion/analyze`. */
export interface FusionResult {
  grievanceId: string;
  timestamp: string;
  countryCode: BricsCountryCode;
  region: string;
  sector: string;
  summaryAnalysis: string;
  englishTranslation?: string;
  demographicContext: {
    affectedPopulationEst: number;
    vulnerabilityWeight: number;
    censusSource: string;
  };
  infrastructureGapAnalysis: {
    baselineIndex: number;
    reportedDeficiency: string;
    gapSeverityScore: number;
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
  provenance: {
    authorizedPortalsConsulted: string[];
    payloadSha256: string;
    aiModelUsed: string;
    dataTimestamp: string;
  };
}

/** Configuration for connecting an external government open-data REST API. */
export interface CustomApiEndpointConfig {
  endpointUrl: string;
  apiKey?: string;
  authHeaderType: 'Bearer' | 'ApiKey' | 'Custom' | 'None';
  customHeaderKey?: string;
  customHeaderValue?: string;
  syncIntervalMinutes: number;
  lastSyncStatus: 'Connected' | 'Pending Verification' | 'Failed' | 'Idle';
  lastSyncTimestamp?: string;
}

/** Individual validation check produced by dataset verification. */
export interface DatasetVerificationCheck {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  severity: 'success' | 'warning' | 'error';
}

/** Result of real schema validation, canonical SHA-256 digesting, and optional endpoint probing. */
export interface DatasetVerificationResult {
  verified: boolean;
  timestamp: string;
  checksPassed: number;
  checksTotal: number;
  sha256Digest: string;
  checks: DatasetVerificationCheck[];
  endpointStatus?: {
    probed: boolean;
    url?: string;
    httpStatus?: number;
    responseTimeMs?: number;
    error?: string;
  };
  appliedToState: boolean;
}

/** Output returned by `/api/vision/analyze-photo`. */
export interface VisionAnalysisResult {
  detectedIssue: string;
  severityScore: number;
  infrastructureCategory: string;
  estimatedRepairUrgency: string;
  featuresIdentified: string[];
  aiModelUsed: string;
}

/** Output returned by `/api/voice/process-ivr`. */
export interface IvrProcessResult {
  caller: string;
  keypadOption: string;
  speechLanguageDetected: string;
  ivrNode: string;
  processedAt: string;
  dpgCompliance: boolean;
  extractedText: string;
}

/** Standard structured error response returned by all `/api/*` endpoints on failure. */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
}

/** Application navigation tabs. */
export type AppTab = 'fusion' | 'ingestion' | 'policy' | 'datasets' | 'gis' | 'package';
