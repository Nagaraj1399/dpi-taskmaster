import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, ArrowRight, Activity, Users, 
  DollarSign, CheckCircle2, AlertCircle, Terminal, 
  Copy, Check, FileText, ChevronRight, Layers, Radio
} from 'lucide-react';
import { BricsCountry, CitizenGrievance, FusionResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DataFusionEngineProps {
  currentCountry: BricsCountry;
  selectedGrievance: CitizenGrievance | null;
  fusionResult: FusionResult | null;
  isLoading: boolean;
  onRunFusion: (grievance: CitizenGrievance) => void;
  onOpenTelemetry: () => void;
}

export const DataFusionEngine: React.FC<DataFusionEngineProps> = ({
  currentCountry,
  selectedGrievance,
  fusionResult,
  isLoading,
  onRunFusion,
  onOpenTelemetry,
}) => {
  const { t } = useLanguage();
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div id="ai-data-fusion-engine" className="space-y-6">
      {/* Engine Status Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('fusion.header.badge', 'AI Governance Data-Fusion Engine')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('fusion.title', 'Cross-Reference & Telemetry Fusion Engine')}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {t('fusion.subtitle', 'Fuses real-time regional citizen voice/text submissions with official baseline demographic datasets, infrastructure indices, and public investment plans.')}
            </p>
          </div>

          {selectedGrievance && (
            <button
              id="btn-re-execute-fusion"
              disabled={isLoading}
              onClick={() => onRunFusion(selectedGrievance)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Executing Fusion AI...' : 'Re-Execute Fusion Analysis'}</span>
            </button>
          )}
        </div>

        {/* Multi-Step Pipeline Visualizer */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-emerald-700 font-mono">01. INGESTION</span>
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">Voice & Messaging Ingestion</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Voice IVR, WhatsApp, SMS</div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-700 font-mono">02. CENSUS</span>
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">Demographic Overlay</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{currentCountry.censusAgency.split(' ')[0]} Board</div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-cyan-700 font-mono">03. INDICES</span>
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">Infrastructure Baseline</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Roads, Water, Health, Net</div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-700 font-mono">04. BUDGET</span>
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">Public Investment Align</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Capital Program Outlay</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Container */}
      {fusionResult ? (
        <div className="space-y-6">
          {/* Top Summary Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Fused Grievance: {fusionResult.grievanceId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Region: <strong className="text-slate-900">{fusionResult.region}</strong>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Sector: <strong className="text-emerald-700">{fusionResult.sector}</strong>
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {fusionResult.summaryAnalysis}
                </p>
              </div>

              {/* Gap Severity Badge */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center min-w-[170px] shrink-0 shadow-xs">
                <div className="text-[11px] uppercase tracking-wider text-amber-900 font-bold">Infrastructure Gap Score</div>
                <div className="text-3xl font-extrabold text-amber-700 mt-1 font-mono">
                  {fusionResult.infrastructureGapAnalysis.gapSeverityScore}<span className="text-sm text-amber-600 font-sans">/100</span>
                </div>
                <div className="text-[11px] text-amber-800 font-bold mt-1">High Fiscal Urgency</div>
              </div>
            </div>
          </div>

          {/* 3 Pillar Cross-Reference Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Demographic Fusion */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Demographic Context</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Census & Density Impact</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-medium block">Estimated Impacted Population:</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                    {fusionResult.demographicContext.affectedPopulationEst.toLocaleString()} Citizens
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-medium block">Vulnerability Weight:</span>
                  <span className="text-sm font-bold text-blue-700 mt-0.5 block">
                    {fusionResult.demographicContext.vulnerabilityWeight} / 100 Index
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Authority: <strong className="text-slate-700">{fusionResult.demographicContext.censusSource}</strong>
                </div>
              </div>
            </div>

            {/* Pillar 2: Infrastructure Baseline Cross-Ref */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200">
                <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Infrastructure Index</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Baseline vs Reported Gap</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-medium block">Baseline Regional Index Score:</span>
                  <span className="text-base font-extrabold text-cyan-800 mt-0.5 block">
                    {fusionResult.infrastructureGapAnalysis.baselineIndex} / 100
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-medium block">Reported Infrastructure Deficiency:</span>
                  <span className="text-xs text-slate-700 mt-0.5 block italic leading-relaxed line-clamp-3">
                    "{fusionResult.infrastructureGapAnalysis.reportedDeficiency}"
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Dataset Ref: <strong className="text-slate-700">{fusionResult.infrastructureGapAnalysis.officialDatasetReference}</strong>
                </div>
              </div>
            </div>

            {/* Pillar 3: Public Investment Alignment */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Public Investment Alignment</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Fiscal Program Allocation</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-medium block">Matching National Program:</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {fusionResult.publicInvestmentAlignment.matchingProgramName}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-amber-800 font-bold">{fusionResult.publicInvestmentAlignment.allocatedAmountUSD}</span>
                    <span className="text-slate-500 font-medium">Status: <strong className="text-emerald-700">{fusionResult.publicInvestmentAlignment.disbursementStatus}</strong></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-medium block">Fiscal Variance Finding:</span>
                  <span className="text-xs text-slate-700 mt-0.5 block leading-relaxed">
                    {fusionResult.publicInvestmentAlignment.fiscalVarianceNote}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Policy Recommendations & Zero Hallucination Proof */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommendations */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {t('fusion.recs.title', 'Actionable Governance Interventions')}
              </h4>

              <div className="space-y-2.5">
                {fusionResult.actionableRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start space-x-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero-Hallucination & Provenance Audit */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero-Hallucination Guardrail
                </h4>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                  {fusionResult.zeroHallucinationProof.provenanceConfidenceScore}% Trust
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-500 block font-bold">Authorized Portals Consulted:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 mt-1 space-y-0.5">
                    {fusionResult.zeroHallucinationProof.authorizedPortalsConsulted.map((portal, i) => (
                      <li key={i} className="truncate">{portal}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div className="text-slate-500 flex items-center justify-between font-semibold">
                    <span>Provenance SHA-256:</span>
                    <button
                      onClick={() => handleCopyHash(fusionResult.zeroHallucinationProof.verificationHash)}
                      className="text-emerald-700 hover:text-emerald-900 p-1"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-slate-800 truncate mt-0.5 font-bold">
                    {fusionResult.zeroHallucinationProof.verificationHash}
                  </div>
                </div>

                <button
                  id="btn-inspect-telemetry"
                  onClick={onOpenTelemetry}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 border border-emerald-200 transition-all shadow-xs"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspect JSON Data Fusion Telemetry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No Active Data Fusion Ingested</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select or record a citizen grievance from the Citizen Ingestion Hub to execute multi-jurisdictional AI cross-referencing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
