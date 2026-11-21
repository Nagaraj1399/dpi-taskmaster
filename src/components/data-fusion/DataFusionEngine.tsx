import React from 'react';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import type { BricsCountry, CitizenGrievance, FusionResult } from '../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { CARD_SURFACE_CLASS, PRIMARY_BUTTON_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';
import { FusionPillarsGrid } from './FusionPillarsGrid';
import { FusionPipelineSteps } from './FusionPipelineSteps';
import { ProvenanceAuditCard } from './ProvenanceAuditCard';

interface DataFusionEngineProps {
  currentCountry: BricsCountry;
  selectedGrievance: CitizenGrievance | null;
  fusionResult: FusionResult | null;
  isLoading: boolean;
  errorMessage?: string | null;
  onRunFusion: (grievance: CitizenGrievance) => void;
  onOpenTelemetry: () => void;
}

/**
 * Displays the multi-stage AI governance data-fusion pipeline along with explicit loading,
 * honest upstream failure, empty, and grounded analysis views.
 */
export const DataFusionEngine: React.FC<DataFusionEngineProps> = ({
  currentCountry,
  selectedGrievance,
  fusionResult,
  isLoading,
  errorMessage,
  onRunFusion,
  onOpenTelemetry,
}) => {
  const { t } = useLanguage();

  return (
    <div id="ai-data-fusion-engine" className="space-y-6">
      {/* Engine Status Header */}
      <div className={`${CARD_SURFACE_CLASS} p-6 relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>{t('fusion.header.badge', 'AI Governance Data-Fusion Engine')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('fusion.title', 'Cross-Reference & Telemetry Fusion Engine')}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {t(
                'fusion.subtitle',
                'Fuses real-time regional citizen voice/text submissions with official baseline demographic datasets, infrastructure indices, and public investment plans.'
              )}
            </p>
          </div>

          {selectedGrievance && (
            <button
              id="btn-re-execute-fusion"
              type="button"
              disabled={isLoading}
              onClick={() => onRunFusion(selectedGrievance)}
              className={PRIMARY_BUTTON_CLASS}
            >
              <Sparkles
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{isLoading ? 'Executing Fusion AI...' : 'Re-Execute Fusion Analysis'}</span>
            </button>
          )}
        </div>

        <FusionPipelineSteps currentCountry={currentCountry} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className={`${CARD_SURFACE_CLASS} p-10 text-center space-y-3`}
        >
          <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin mx-auto" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-900">
            Running Server-Side AI Data Fusion...
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Correlating {selectedGrievance?.region ?? currentCountry.name} telemetry against{' '}
            {currentCountry.censusAgency} and capital registries.
          </p>
        </div>
      )}

      {/* Honest Failure State */}
      {!isLoading && errorMessage && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-red-900">AI Data Fusion Failed</h3>
              <p className="text-xs text-red-800 font-medium">{errorMessage}</p>
            </div>
          </div>

          {selectedGrievance && (
            <button
              type="button"
              onClick={() => onRunFusion(selectedGrievance)}
              className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Retry Fusion Analysis
            </button>
          )}
        </div>
      )}

      {/* Main Analysis Container */}
      {!isLoading && fusionResult ? (
        <div className="space-y-6">
          <div className={`${CARD_SURFACE_CLASS} p-6`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Fused Grievance: {fusionResult.grievanceId}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Region: <strong className="text-slate-900">{fusionResult.region}</strong>
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Sector: <strong className="text-emerald-700">{fusionResult.sector}</strong>
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {fusionResult.summaryAnalysis}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center min-w-[170px] shrink-0 shadow-xs">
                <div className="text-[11px] uppercase tracking-wider text-amber-900 font-bold">
                  Infrastructure Gap Score
                </div>
                <div className="text-3xl font-extrabold text-amber-800 mt-1 font-mono">
                  {fusionResult.infrastructureGapAnalysis.gapSeverityScore}
                  <span className="text-sm text-amber-700 font-sans">/100</span>
                </div>
                <div className="text-[11px] text-amber-900 font-bold mt-1">
                  Deterministic Baseline Score
                </div>
              </div>
            </div>
          </div>

          <FusionPillarsGrid fusionResult={fusionResult} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${CARD_SURFACE_CLASS} p-6 space-y-4`}>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>{t('fusion.recs.title', 'Actionable Governance Interventions')}</span>
              </h4>

              <div className="space-y-2.5">
                {fusionResult.actionableRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`${SUBTLE_PANEL_CLASS} p-3.5 flex items-start space-x-3`}
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <ProvenanceAuditCard
              provenance={fusionResult.provenance}
              onOpenTelemetry={onOpenTelemetry}
            />
          </div>
        </div>
      ) : (
        !isLoading &&
        !errorMessage && (
          <div className={`${CARD_SURFACE_CLASS} p-12 text-center space-y-4`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900">No Active Data Fusion Ingested</h3>
              <p className="text-xs text-slate-600 mt-1">
                Select or record a citizen grievance from the Citizen Ingestion Hub to execute
                multi-jurisdictional AI cross-referencing.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};
