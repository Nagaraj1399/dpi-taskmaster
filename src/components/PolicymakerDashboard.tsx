import React, { useState } from 'react';
import { 
  Landmark, AlertTriangle, TrendingUp, DollarSign, Users, 
  CheckCircle2, Filter, ArrowUpRight, ShieldCheck, Download, 
  ExternalLink, Sparkles, FileSpreadsheet, Eye, Activity
} from 'lucide-react';
import { DEMAND_HOTSPOTS, POLICYMAKER_RECOMMENDATIONS, BRICS_COUNTRIES } from '../data/bricsData';
import { BricsCountryCode, DemandHotspot, PolicymakerProjectRecommendation } from '../types';

interface PolicymakerDashboardProps {
  selectedCountryCode: BricsCountryCode;
  onSelectCountry: (code: BricsCountryCode) => void;
  onOpenTelemetry: () => void;
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  selectedCountryCode,
  onSelectCountry,
  onOpenTelemetry,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activeView, setActiveView] = useState<'recommendations' | 'hotspots'>('recommendations');

  const filteredRecs = POLICYMAKER_RECOMMENDATIONS.filter(
    (rec) => (selectedSector === 'All' || rec.sector.includes(selectedSector))
  );

  const filteredHotspots = DEMAND_HOTSPOTS.filter(
    (spot) => (selectedSector === 'All' || spot.sector.includes(selectedSector))
  );

  return (
    <div id="policymaker-dashboard" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Landmark className="w-3.5 h-3.5 text-amber-600" />
              <span>National Planning & Policymaker Strategic Intelligence</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              BRICS Demand Hotspots & High-Priority Project Recommendations
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Synthesizes large datasets across 11 BRICS member states combining citizen feedback with national demographic data, infrastructure indices, and capital investment budgets to recommend high-priority interventions for national policymakers.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs shrink-0">
            <button
              onClick={() => setActiveView('recommendations')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeView === 'recommendations' ? 'bg-white text-emerald-800 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>High-Priority Projects</span>
            </button>
            <button
              onClick={() => setActiveView('hotspots')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeView === 'hotspots' ? 'bg-white text-emerald-800 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Demand Hotspots</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs">
          <span className="text-slate-500 font-bold mr-1">Filter Sector:</span>
          {['All', 'Water & Sanitation', 'Roads & Highways', 'Healthcare', 'Digital & Power'].map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedSector === sector
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Grid */}
      {activeView === 'recommendations' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Recommended Priority Projects for National Planning Commissions</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono font-bold">
              {filteredRecs.length} Actionable Policy Directives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRecs.map((rec) => {
              const country = BRICS_COUNTRIES[rec.countryCode];
              return (
                <div 
                  key={rec.id} 
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 space-y-4 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Tag & Priority */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{country?.flag}</span>
                        <div>
                          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                            {country?.name} • {rec.sector}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 leading-snug">
                            {rec.projectName}
                          </h4>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                        rec.priorityLevel.includes('Immediate')
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {rec.priorityLevel}
                      </span>
                    </div>

                    {/* Fused Evidence Rationale */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        <span>Fused Multi-Dataset Evidence Rationale:</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {rec.fusedEvidenceRationale}
                      </p>
                    </div>

                    {/* Metrics Banner */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 font-medium block">Est. Capital Outlay:</span>
                        <span className="text-sm font-extrabold text-amber-700 mt-0.5 block font-mono">
                          {rec.estimatedCostUSD}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 font-medium block">Beneficiaries:</span>
                        <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block font-mono">
                          {rec.projectedBeneficiaries.toLocaleString()} Citizens
                        </span>
                      </div>
                    </div>

                    {/* Recommended Procurement Action */}
                    <div className="text-xs text-slate-700 space-y-1 pt-1 font-medium">
                      <span className="font-bold text-slate-900">Recommended Executive Action:</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {rec.recommendedProcurementAction}
                      </p>
                    </div>
                  </div>

                  {/* Footer Source Attribution */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono font-medium">
                    <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rec.dpgComplianceStandard}</span>
                    </div>
                    <span>Datasets: {rec.sourceBaselineDatasets.length} Verified Sources</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Demand Hotspots Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Surfaced Demand Hotspots across BRICS Nations</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono font-bold">
              Prioritized by Gap Severity & Telemetry Volume
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHotspots.map((spot) => {
              const country = BRICS_COUNTRIES[spot.countryCode];
              return (
                <div key={spot.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{country?.flag}</span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 leading-tight">{spot.region}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{spot.sector}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                      Rank #{spot.urgencyRank}
                    </span>
                  </div>

                  {/* Gap & Demand Score Bars */}
                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-medium">
                        <span className="text-slate-600">Demand Intensity (Citizen Voice/Text):</span>
                        <strong className="text-emerald-700 font-mono font-bold">{spot.demandIntensityScore}/100</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${spot.demandIntensityScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-medium">
                        <span className="text-slate-600">Infrastructure Gap Index:</span>
                        <strong className="text-amber-700 font-mono font-bold">{spot.infrastructureGapIndex}/100</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${spot.infrastructureGapIndex}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Impacted Pop & Program Status */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium">Reported Grievances:</span>
                      <strong className="text-slate-900 block mt-0.5 font-bold">{spot.reportedGrievanceCount} Ingested</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium">Active Program Outlay:</span>
                      <strong className="text-amber-800 block mt-0.5 truncate font-bold">{spot.budgetAllocatedUSD}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">Recommended Intervention:</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {spot.recommendedIntervention}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
