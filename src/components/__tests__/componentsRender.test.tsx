// @vitest-environment jsdom
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { LanguageProvider } from '../../context/LanguageContext';
import { BRICS_COUNTRIES, INITIAL_CITIZEN_GRIEVANCES } from '../../shared/bricsData';
import type { FusionResult } from '../../shared/types';
import { CountrySelector } from '../CountrySelector';
import { ErrorBoundary } from '../ErrorBoundary';
import { GisHeatmapView } from '../GisHeatmapView';
import { MetricRibbon } from '../MetricRibbon';
import { Navbar } from '../Navbar';
import { PolicymakerDashboard } from '../PolicymakerDashboard';
import { TelemetryModal } from '../TelemetryModal';
import { TrackHeader } from '../TrackHeader';
import { CitizenIngestionHub } from '../citizen-ingestion/CitizenIngestionHub';
import { usePhotoVisionAnalysis } from '../citizen-ingestion/hooks/usePhotoVisionAnalysis';
import { useVoiceRecorder } from '../citizen-ingestion/hooks/useVoiceRecorder';
import { DataFusionEngine } from '../data-fusion/DataFusionEngine';
import { DatasetStudioModal } from '../dataset-studio/DatasetStudioModal';
import { useDatasetDraft } from '../dataset-studio/hooks/useDatasetDraft';
import { useJsonIO } from '../dataset-studio/hooks/useJsonIO';
import { GovernmentDatasetsExplorer } from '../datasets-explorer/GovernmentDatasetsExplorer';
import { useQuickApiVerify } from '../datasets-explorer/hooks/useQuickApiVerify';
import { SubmissionPackageView } from '../submission-package/SubmissionPackageView';

const SAMPLE_FUSION_RESULT: FusionResult = {
  grievanceId: 'GRV-IN-1001',
  timestamp: '2026-08-18T10:00:00Z',
  countryCode: 'IN',
  region: 'Tamil Nadu (Madurai)',
  sector: 'Water & Sanitation',
  summaryAnalysis: 'Water supply pipeline ruptured affecting rural households.',
  demographicContext: {
    affectedPopulationEst: 84000,
    vulnerabilityWeight: 42.8,
    censusSource: 'Registrar General of India',
  },
  infrastructureGapAnalysis: {
    baselineIndex: 74,
    reportedDeficiency: 'Broken drinking water pipe',
    gapSeverityScore: 86,
    officialDatasetReference: 'Data.gov.in',
  },
  publicInvestmentAlignment: {
    allocatedBudgetFound: true,
    matchingProgramName: 'Jal Jeevan Mission',
    allocatedAmountUSD: '$43.8 Billion',
    disbursementStatus: 'On Track',
    fiscalVarianceNote: 'Funding available at district tier.',
  },
  actionableRecommendations: ['Dispatch district engineering team.'],
  telemetry: {
    brics_data_fusion_telemetry: {
      source_type: 'Official Government API',
      dataset_categories: ['Demographics', 'Infrastructure'],
      verification_status: 'Schema validated',
      dpg_compliance: true,
    },
    citizen_grievance_integration: {
      ingestion_channels: ['Voice IVR'],
      cross_reference_status: 'Fused',
    },
  },
  provenance: {
    authorizedPortalsConsulted: ['https://data.gov.in'],
    payloadSha256: 'sha256:0123456789abcdef',
    aiModelUsed: 'gemini-4-hydrogen',
    dataTimestamp: '2026-08-18T10:00:00Z',
  },
};

function ThrowOnRender(): never {
  throw new Error('Synthetic UI crash');
}

describe('Major UI component render tests and supporting hooks', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            error: { code: 'AI_SERVICE_UNAVAILABLE', message: 'API key missing in test env' },
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders App with honest error banner when backend fusion fails', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    expect(screen.getAllByText(/CivicPulse/i).length).toBeGreaterThan(0);
    expect(await screen.findByRole('alert')).toHaveTextContent(/AI Data Fusion Failed/i);
  });

  it('renders Navbar, TrackHeader, MetricRibbon, and CountrySelector cleanly', () => {
    render(
      <LanguageProvider>
        <TrackHeader onOpenSubmissionPackage={vi.fn()} />
        <Navbar
          activeTab="fusion"
          setActiveTab={vi.fn()}
          selectedCountryCode="IN"
          onOpenTelemetry={vi.fn()}
        />
        <MetricRibbon selectedCountryCode="IN" totalGrievancesCount={4} />
        <CountrySelector selectedCountryCode="IN" onSelectCountry={vi.fn()} />
      </LanguageProvider>
    );

    expect(screen.getByRole('button', { name: /Track Requirements/i })).toBeInTheDocument();
    expect(screen.getByText(/Census Population/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /BR.*Brazil/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    expect(screen.getByRole('button', { name: /IN.*India/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('renders DataFusionEngine across empty, error, and populated states', () => {
    const { rerender } = render(
      <LanguageProvider>
        <DataFusionEngine
          currentCountry={BRICS_COUNTRIES.IN}
          selectedGrievance={null}
          fusionResult={null}
          isLoading={false}
          errorMessage={null}
          onRunFusion={vi.fn()}
          onOpenTelemetry={vi.fn()}
        />
      </LanguageProvider>
    );
    expect(screen.getByText(/No Active Data Fusion Ingested/i)).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <DataFusionEngine
          currentCountry={BRICS_COUNTRIES.IN}
          selectedGrievance={INITIAL_CITIZEN_GRIEVANCES[0] ?? null}
          fusionResult={null}
          isLoading={false}
          errorMessage="Upstream Gemini API timed out."
          onRunFusion={vi.fn()}
          onOpenTelemetry={vi.fn()}
        />
      </LanguageProvider>
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/Upstream Gemini API timed out/i);

    rerender(
      <LanguageProvider>
        <DataFusionEngine
          currentCountry={BRICS_COUNTRIES.IN}
          selectedGrievance={INITIAL_CITIZEN_GRIEVANCES[0] ?? null}
          fusionResult={SAMPLE_FUSION_RESULT}
          isLoading={false}
          errorMessage={null}
          onRunFusion={vi.fn()}
          onOpenTelemetry={vi.fn()}
        />
      </LanguageProvider>
    );
    expect(screen.getByText(/sha256:0123456789abcdef/i)).toBeInTheDocument();
  });

  it('renders CitizenIngestionHub, GovernmentDatasetsExplorer, PolicymakerDashboard, GisHeatmapView, and SubmissionPackageView', () => {
    render(
      <LanguageProvider>
        <CitizenIngestionHub
          currentCountry={BRICS_COUNTRIES.IN}
          onGrievanceSubmitted={vi.fn()}
          onTriggerFusion={vi.fn()}
        />
        <GovernmentDatasetsExplorer
          currentCountry={BRICS_COUNTRIES.IN}
          onUpdateCountryData={vi.fn()}
        />
        <PolicymakerDashboard
          selectedCountryCode="IN"
          onSelectCountry={vi.fn()}
          onOpenTelemetry={vi.fn()}
        />
        <GisHeatmapView
          selectedCountryCode="IN"
          onSelectCountry={vi.fn()}
          grievances={INITIAL_CITIZEN_GRIEVANCES}
        />
        <SubmissionPackageView currentCountry={BRICS_COUNTRIES.IN} onNavigateTab={vi.fn()} />
      </LanguageProvider>
    );

    expect(screen.getByText(/India Ingestion Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/India Official Repositories/i)).toBeInTheDocument();
    expect(
      screen.getByText(/BRICS Demand Hotspots & High-Priority Project Recommendations/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/India Spatial Intelligence/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Hackathon Evaluation Package & 12-Slide Pitch Deck/i)
    ).toBeInTheDocument();
  });

  it('renders DatasetStudioModal, TelemetryModal, and ErrorBoundary fallback cleanly', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <LanguageProvider>
        <DatasetStudioModal
          isOpen={true}
          onClose={vi.fn()}
          currentCountry={BRICS_COUNTRIES.IN}
          onSaveCountryData={vi.fn()}
        />
      </LanguageProvider>
    );
    expect(screen.getByText(/Official Dataset Studio & API Verification/i)).toBeInTheDocument();

    cleanup();
    render(
      <TelemetryModal
        isOpen={true}
        onClose={vi.fn()}
        fusionResult={SAMPLE_FUSION_RESULT}
        selectedCountryName="India"
      />
    );
    expect(screen.getByText(/JSON Data Fusion Telemetry/i)).toBeInTheDocument();

    cleanup();
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>
    );
    expect(screen.getByText(/CivicPulse Interface Error/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('exercises useDatasetDraft, useJsonIO, usePhotoVisionAnalysis, and useQuickApiVerify hooks', async () => {
    const onDirty = vi.fn();
    const { result: draftResult, rerender: rerenderDraft } = renderHook(
      ({ country, open }: { country: typeof BRICS_COUNTRIES.IN; open: boolean }) =>
        useDatasetDraft(country, open, onDirty),
      { initialProps: { country: BRICS_COUNTRIES.IN, open: true } }
    );
    act(() => {
      draftResult.current.updateCensusAgency('MoSPI Updated');
      draftResult.current.updateDemographicField('ruralPercentage', 0);
      draftResult.current.updateRuralUrbanSplit(62);
      draftResult.current.updateInfrastructureField('pavedRoadScore', 75);
      draftResult.current.updateInvestmentField('disbursementRate', 80);
      draftResult.current.updatePublicFeedField('whoHealthIndex', 88);
      draftResult.current.addProgram();
      draftResult.current.updateProgramField(0, 'status', 'Completed');
      draftResult.current.removeProgram(1);
      draftResult.current.updateApiConfigField('authHeaderType', 'Bearer');
      draftResult.current.applyPreset('mospi_2024');
    });
    expect(draftResult.current.formData.demographics.totalPopulation).toBe('1,438,200,000');
    expect(onDirty).toHaveBeenCalled();

    act(() => {
      draftResult.current.replaceDraft(BRICS_COUNTRIES.BR);
    });
    expect(draftResult.current.formData.code).toBe('BR');

    rerenderDraft({ country: BRICS_COUNTRIES.ZA, open: true });
    expect(draftResult.current.formData.code).toBe('ZA');

    const onApply = vi.fn();
    const { result: jsonHook } = renderHook(() => useJsonIO(onApply));
    act(() => {
      jsonHook.current.applyRawJson('{bad json');
    });
    expect(jsonHook.current.jsonError).toMatch(/Invalid JSON syntax/i);
    act(() => {
      jsonHook.current.applyRawJson('{"countryCode":"IN","__proto__":{"polluted":true}}');
    });
    expect(jsonHook.current.jsonError).toMatch(/forbidden prototype keys/i);
    act(() => {
      jsonHook.current.applyRawJson('{"invalid": true}');
    });
    expect(jsonHook.current.jsonError).toMatch(/schema validation failed/i);
    act(() => {
      jsonHook.current.clearMessages();
    });
    expect(jsonHook.current.jsonError).toBeNull();

    const createObjectURL = vi.fn(() => 'blob:test-url');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    act(() => {
      jsonHook.current.exportJson(BRICS_COUNTRIES.IN);
    });
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
    clickSpy.mockRestore();

    act(() => {
      jsonHook.current.applyRawJson(JSON.stringify(BRICS_COUNTRIES.BR));
    });
    expect(onApply).toHaveBeenCalledTimes(1);

    const file = new File([JSON.stringify(BRICS_COUNTRIES.EG)], 'egypt.json', {
      type: 'application/json',
    });
    const fakeInput = { files: [file], value: 'egypt.json' } as unknown as HTMLInputElement;
    await act(async () => {
      jsonHook.current.importJsonFile({ target: fakeInput } as ChangeEvent<HTMLInputElement>);
      await new Promise((resolve) => setTimeout(resolve, 25));
    });
    expect(onApply).toHaveBeenCalledTimes(2);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            result: {
              detectedIssue: 'Pothole cluster',
              severityScore: 77,
              infrastructureCategory: 'Roads & Highways',
              estimatedRepairUrgency: 'High',
              featuresIdentified: ['Asphalt fracture'],
              aiModelUsed: 'gemini-4-hydrogen',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );

    const { result: visionHook } = renderHook(() => usePhotoVisionAnalysis());
    await act(async () => {
      await visionHook.current.analyzePhoto({
        countryCode: 'IN',
        photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800',
      });
    });
    expect(visionHook.current.status).toBe('succeeded');
    expect(visionHook.current.analysis?.severityScore).toBe(77);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            error: { code: 'UPSTREAM_AI_ERROR', message: 'Vision timeout' },
          }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    await act(async () => {
      await visionHook.current.analyzePhoto({ countryCode: 'IN', imageBase64: 'aGVsbG8=' });
    });
    expect(visionHook.current.status).toBe('failed');
    expect(visionHook.current.errorMessage).toBe('Vision timeout');
    act(() => {
      visionHook.current.reset();
    });
    expect(visionHook.current.status).toBe('idle');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            verificationResult: {
              verified: true,
              timestamp: '2026-08-18T12:00:00Z',
              checksPassed: 4,
              checksTotal: 4,
              sha256Digest: 'sha256:verifyhash',
              checks: [],
              appliedToState: true,
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    const { result: quickHook } = renderHook(() => useQuickApiVerify());
    await act(async () => {
      await quickHook.current.verifyCountryDataset(BRICS_COUNTRIES.IN);
    });
    expect(quickHook.current.status).toBe('passed');
    expect(quickHook.current.lastDigest).toBe('sha256:verifyhash');

    const onTranscript = vi.fn();
    const { result: voiceHook } = renderHook(() => useVoiceRecorder('IN', onTranscript));
    await act(async () => {
      await voiceHook.current.startRecording();
    });
    expect(voiceHook.current.isRecording).toBe(true);
    expect(voiceHook.current.micNotice).toMatch(/Browser microphone unavailable/i);
    act(() => {
      voiceHook.current.stopRecording();
    });
    expect(voiceHook.current.isRecording).toBe(false);
    expect(voiceHook.current.hasAudioRecorded).toBe(true);
    expect(onTranscript).toHaveBeenCalledTimes(1);

    // Exercise MediaRecorder success path
    const stopTrack = vi.fn();
    class FakeMediaRecorder {
      public state = 'recording';
      public stream = { getTracks: () => [{ stop: stopTrack }] };
      public ondataavailable: ((ev: { data: Blob }) => void) | null = null;
      public onstop: (() => void) | null = null;
      public start(): void {
        this.ondataavailable?.({ data: new Blob(['audio'], { type: 'audio/webm' }) });
      }
      public stop(): void {
        this.state = 'inactive';
        this.onstop?.();
      }
    }
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue({}) },
    });

    const { result: mediaHook } = renderHook(() => useVoiceRecorder('BR', onTranscript));
    await act(async () => {
      await mediaHook.current.startRecording();
    });
    expect(mediaHook.current.isRecording).toBe(true);
    act(() => {
      mediaHook.current.stopRecording();
    });
    expect(stopTrack).toHaveBeenCalledTimes(1);
    expect(mediaHook.current.audioUrl).toBe('blob:test-url');
  });
});
