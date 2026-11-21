/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { CitizenIngestionHub } from './components/citizen-ingestion/CitizenIngestionHub';
import { DataFusionEngine } from './components/data-fusion/DataFusionEngine';
import { GovernmentDatasetsExplorer } from './components/datasets-explorer/GovernmentDatasetsExplorer';
import { GisHeatmapView } from './components/GisHeatmapView';
import { MetricRibbon } from './components/MetricRibbon';
import { Navbar } from './components/Navbar';
import { PolicymakerDashboard } from './components/PolicymakerDashboard';
import { SubmissionPackageView } from './components/submission-package/SubmissionPackageView';
import { TelemetryModal } from './components/TelemetryModal';
import { TrackHeader } from './components/TrackHeader';
import { BRICS_COUNTRIES, INITIAL_CITIZEN_GRIEVANCES } from './shared/bricsData';
import type {
  ApiErrorResponse,
  AppTab,
  BricsCountry,
  BricsCountryCode,
  CitizenGrievance,
  DatasetVerificationResult,
  FusionResult,
} from './shared/types';

interface FusionApiResponse {
  success: boolean;
  result?: FusionResult;
  error?: ApiErrorResponse['error'];
}

type FusionFetchOutcome =
  | { status: 'aborted' }
  | { status: 'ok'; result: FusionResult }
  | { status: 'error'; message: string };

async function fetchFusionAnalysis(
  grievance: CitizenGrievance,
  signal: AbortSignal
): Promise<FusionFetchOutcome> {
  try {
    const response = await fetch('/api/fusion/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        grievance,
        countryCode: grievance.countryCode,
      }),
    });

    const data = (await response.json()) as FusionApiResponse;
    if (signal.aborted) {
      return { status: 'aborted' };
    }

    if (!response.ok || !data.success || !data.result) {
      return {
        status: 'error',
        message:
          data.error?.message ?? `Server fusion analysis failed with status ${response.status}.`,
      };
    }

    return { status: 'ok', result: data.result };
  } catch (err: unknown) {
    if (signal.aborted) {
      return { status: 'aborted' };
    }
    return {
      status: 'error',
      message:
        err instanceof Error
          ? `Unable to reach the AI fusion service: ${err.message}`
          : 'Unable to reach the AI fusion service.',
    };
  }
}

/**
 * Root CivicPulse BRICS application coordinating multi-jurisdictional dataset baselines,
 * citizen telemetry intake, server-side AI fusion, and policymaker analytics.
 */
export default function App() {
  const [countries, setCountries] =
    useState<Record<BricsCountryCode, BricsCountry>>(BRICS_COUNTRIES);
  const [selectedCountryCode, setSelectedCountryCode] = useState<BricsCountryCode>('IN');
  const [activeTab, setActiveTab] = useState<AppTab>('fusion');
  const [grievances, setGrievances] = useState<CitizenGrievance[]>(INITIAL_CITIZEN_GRIEVANCES);
  const [selectedGrievance, setSelectedGrievance] = useState<CitizenGrievance | null>(
    INITIAL_CITIZEN_GRIEVANCES[0] ?? null
  );
  const [fusionResult, setFusionResult] = useState<FusionResult | null>(null);
  const [fusionError, setFusionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(INITIAL_CITIZEN_GRIEVANCES.length > 0);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState<boolean>(false);
  const fusionAbortRef = useRef<AbortController | null>(null);

  const currentCountry = countries[selectedCountryCode] ?? countries.IN;

  const handleUpdateCountryDataset = (
    updatedCountry: BricsCountry,
    verification?: DatasetVerificationResult
  ) => {
    if (verification && !verification.verified) {
      return;
    }
    setCountries((prev) => ({
      ...prev,
      [updatedCountry.code]: updatedCountry,
    }));
  };

  const handleRunFusion = useCallback(async (grievance: CitizenGrievance) => {
    fusionAbortRef.current?.abort();
    const controller = new AbortController();
    fusionAbortRef.current = controller;

    setIsLoading(true);
    setFusionError(null);
    setSelectedGrievance(grievance);
    setSelectedCountryCode(grievance.countryCode);

    const outcome = await fetchFusionAnalysis(grievance, controller.signal);
    if (outcome.status === 'aborted') {
      return;
    }

    if (outcome.status === 'ok') {
      setFusionResult(outcome.result);
    } else {
      setFusionResult(null);
      setFusionError(outcome.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initialGrievance = INITIAL_CITIZEN_GRIEVANCES[0];
    if (!initialGrievance) {
      return;
    }

    fusionAbortRef.current?.abort();
    const controller = new AbortController();
    fusionAbortRef.current = controller;

    void fetchFusionAnalysis(initialGrievance, controller.signal).then((outcome) => {
      if (outcome.status === 'aborted') {
        return;
      }
      if (outcome.status === 'ok') {
        setFusionResult(outcome.result);
      } else {
        setFusionResult(null);
        setFusionError(outcome.message);
      }
      setIsLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, []);

  const handleGrievanceSubmitted = (newGrievance: CitizenGrievance) => {
    setGrievances((prev) => [newGrievance, ...prev]);
    setSelectedGrievance(newGrievance);
    setActiveTab('fusion');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <TrackHeader onOpenSubmissionPackage={() => setActiveTab('package')} />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCountryCode={selectedCountryCode}
        onOpenTelemetry={() => setIsTelemetryModalOpen(true)}
      />

      <MetricRibbon
        selectedCountryCode={selectedCountryCode}
        totalGrievancesCount={grievances.length}
      />

      <CountrySelector
        selectedCountryCode={selectedCountryCode}
        onSelectCountry={(code) => {
          setSelectedCountryCode(code);
          const matching = grievances.find((item) => item.countryCode === code);
          if (matching) {
            void handleRunFusion(matching);
          }
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'fusion' && (
          <DataFusionEngine
            currentCountry={currentCountry}
            selectedGrievance={selectedGrievance}
            fusionResult={fusionResult}
            isLoading={isLoading}
            errorMessage={fusionError}
            onRunFusion={(grievance) => {
              void handleRunFusion(grievance);
            }}
            onOpenTelemetry={() => setIsTelemetryModalOpen(true)}
          />
        )}

        {activeTab === 'policy' && (
          <PolicymakerDashboard
            selectedCountryCode={selectedCountryCode}
            onSelectCountry={setSelectedCountryCode}
            onOpenTelemetry={() => setIsTelemetryModalOpen(true)}
          />
        )}

        {activeTab === 'ingestion' && (
          <CitizenIngestionHub
            currentCountry={currentCountry}
            onGrievanceSubmitted={handleGrievanceSubmitted}
            onTriggerFusion={(grievance) => {
              setActiveTab('fusion');
              void handleRunFusion(grievance);
            }}
          />
        )}

        {activeTab === 'datasets' && (
          <GovernmentDatasetsExplorer
            currentCountry={currentCountry}
            onUpdateCountryData={handleUpdateCountryDataset}
          />
        )}

        {activeTab === 'gis' && (
          <GisHeatmapView
            selectedCountryCode={selectedCountryCode}
            onSelectCountry={setSelectedCountryCode}
            grievances={grievances}
          />
        )}

        {activeTab === 'package' && (
          <SubmissionPackageView
            currentCountry={currentCountry}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      <TelemetryModal
        isOpen={isTelemetryModalOpen}
        onClose={() => setIsTelemetryModalOpen(false)}
        fusionResult={fusionResult}
        selectedCountryName={currentCountry.name}
      />

      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">CivicPulse BRICS</span>
            <span className="text-slate-300" aria-hidden="true">
              •
            </span>
            <span>Digital Public Good (DPG) Architecture</span>
            <span className="text-slate-300" aria-hidden="true">
              •
            </span>
            <span className="text-emerald-700 font-mono font-semibold">
              11 Sovereign States Configured
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsTelemetryModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-mono font-medium underline"
            >
              Schema Telemetry API Feed
            </button>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <span className="text-slate-600">Open-Data Grounded &amp; Zod Validated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
