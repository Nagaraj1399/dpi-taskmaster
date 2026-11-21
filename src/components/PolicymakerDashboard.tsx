import React, { useState } from 'react';
import { Activity, AlertTriangle, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import { BRICS_COUNTRIES, DEMAND_HOTSPOTS, POLICYMAKER_RECOMMENDATIONS } from '../shared/bricsData';
import type { BricsCountryCode } from '../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from './ui/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const SECTOR_FILTERS = [
  'All',
  'Water & Sanitation',
  'Roads & Highways',
  'Healthcare',
  'Digital & Power',
] as const;

interface PolicymakerDashboardProps {
  selectedCountryCode: BricsCountryCode;
  onSelectCountry: (code: BricsCountryCode) => void;
  onOpenTelemetry: () => void;
}

/**
 * Policymaker decision dashboard surfacing high-priority capital recommendations
 * and ranked regional demand hotspots across BRICS+ nations.
 */
export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  selectedCountryCode,
  onSelectCountry,
  onOpenTelemetry,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activeView, setActiveView] = useState<'recommendations' | 'hotspots'>('recommendations');

  const filteredRecs = POLICYMAKER_RECOMMENDATIONS.filter(
    (rec) => selectedSector === 'All' || rec.sector.includes(selectedSector)
  );

  const filteredHotspots = DEMAND_HOTSPOTS.filter(
    (spot) => selectedSector === 'All' || spot.sector.includes(selectedSector)
  );

  return (
    <div id="policymaker-dashboard" className="space-y-6">
      <Tabs
        value={activeView}
        onValueChange={(val) => setActiveView(val as 'recommendations' | 'hotspots')}
        className="space-y-6"
      >
        <div className={`${CARD_SURFACE_CLASS} p-6 relative overflow-hidden`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Landmark className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>National Planning &amp; Policymaker Strategic Intelligence</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                BRICS Demand Hotspots &amp; High-Priority Project Recommendations
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
                Synthesizes baseline datasets across 11 BRICS+ member states combining citizen
                feedback with demographic census data, infrastructure indices, and capital
                investment budgets.
              </p>
            </div>

            <TabsList className="shrink-0 p-1.5">
              <TabsTrigger value="recommendations" className="gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>High-Priority Projects</span>
              </TabsTrigger>
              <TabsTrigger value="hotspots" className="gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Demand Hotspots</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div
            className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs"
            role="group"
            aria-label="Filter projects by sector"
          >
            <span className="text-slate-600 font-bold mr-1">Filter Sector:</span>
            {SECTOR_FILTERS.map((sector) => {
              const isSelected = selectedSector === sector;
              return (
                <button
                  key={sector}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>

        <TabsContent value="recommendations" className="mt-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Recommended Priority Projects for National Planning Commissions</span>
            </h3>
            <span className="text-xs text-slate-600 font-mono font-bold">
              {filteredRecs.length} Actionable Policy Directives
            </span>
          </div>

          {filteredRecs.length === 0 ? (
            <div className={`${CARD_SURFACE_CLASS} p-8 text-center text-xs text-slate-600`}>
              No policy recommendations match sector &ldquo;{selectedSector}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRecs.map((rec) => {
                const country = BRICS_COUNTRIES[rec.countryCode];
                const isActiveCountry = rec.countryCode === selectedCountryCode;
                return (
                  <div
                    key={rec.id}
                    className={`${CARD_SURFACE_CLASS} hover:border-slate-300 p-5 space-y-4 transition-all flex flex-col justify-between ${
                      isActiveCountry ? 'ring-2 ring-emerald-500/20 border-emerald-300' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl" aria-hidden="true">
                            {country.flag}
                          </span>
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectCountry(rec.countryCode)}
                              className="text-[11px] font-mono font-bold text-slate-600 hover:text-emerald-700 uppercase tracking-wider block text-left"
                            >
                              {country.name} • {rec.sector}
                            </button>
                            <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 leading-snug">
                              {rec.projectName}
                            </h4>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                            rec.priorityLevel.includes('Immediate')
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rec.priorityLevel}
                        </span>
                      </div>

                      <div className={`${SUBTLE_PANEL_CLASS} p-3 space-y-1.5`}>
                        <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                          <Activity className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                          <span>Fused Multi-Dataset Evidence Rationale:</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {rec.fusedEvidenceRationale}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`${SUBTLE_PANEL_CLASS} p-2.5`}>
                          <span className="text-[11px] text-slate-600 font-medium block">
                            Est. Capital Outlay:
                          </span>
                          <span className="text-sm font-extrabold text-amber-800 mt-0.5 block font-mono">
                            {rec.estimatedCostUSD}
                          </span>
                        </div>
                        <div className={`${SUBTLE_PANEL_CLASS} p-2.5`}>
                          <span className="text-[11px] text-slate-600 font-medium block">
                            Beneficiaries:
                          </span>
                          <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block font-mono">
                            {rec.projectedBeneficiaries.toLocaleString()} Citizens
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1 pt-1 font-medium">
                        <span className="font-bold text-slate-900">
                          Recommended Executive Action:
                        </span>
                        <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          {rec.recommendedProcurementAction}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-mono font-medium">
                      <button
                        type="button"
                        onClick={onOpenTelemetry}
                        className="flex items-center space-x-1 text-emerald-700 hover:text-emerald-900 font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                        <span>{rec.dpgComplianceStandard}</span>
                      </button>
                      <span>Datasets: {rec.sourceBaselineDatasets.length} Sources</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hotspots" className="mt-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Surfaced Demand Hotspots across BRICS Nations</span>
            </h3>
            <span className="text-xs text-slate-600 font-mono font-bold">
              Prioritized by Gap Severity &amp; Telemetry Volume
            </span>
          </div>

          {filteredHotspots.length === 0 ? (
            <div className={`${CARD_SURFACE_CLASS} p-8 text-center text-xs text-slate-600`}>
              No demand hotspots match sector &ldquo;{selectedSector}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHotspots.map((spot) => {
                const country = BRICS_COUNTRIES[spot.countryCode];
                return (
                  <div key={spot.id} className={`${CARD_SURFACE_CLASS} p-5 space-y-3.5`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl" aria-hidden="true">
                          {country.flag}
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 leading-tight">
                            {spot.region}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {spot.sector}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                        Rank #{spot.urgencyRank}
                      </span>
                    </div>

                    <div className={`${SUBTLE_PANEL_CLASS} space-y-2 text-xs p-3`}>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-medium">
                          <span className="text-slate-700">Demand Intensity:</span>
                          <strong className="text-emerald-700 font-mono font-bold">
                            {spot.demandIntensityScore}/100
                          </strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${spot.demandIntensityScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-medium">
                          <span className="text-slate-700">Infrastructure Gap Index:</span>
                          <strong className="text-amber-800 font-mono font-bold">
                            {spot.infrastructureGapIndex}/100
                          </strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full"
                            style={{ width: `${spot.infrastructureGapIndex}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-600 block font-medium">
                          Reported Grievances:
                        </span>
                        <strong className="text-slate-900 block mt-0.5 font-bold">
                          {spot.reportedGrievanceCount} Ingested
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-600 block font-medium">
                          Active Program Outlay:
                        </span>
                        <strong className="text-amber-800 block mt-0.5 truncate font-bold">
                          {spot.budgetAllocatedUSD}
                        </strong>
                      </div>
                    </div>

                    <div className={`${SUBTLE_PANEL_CLASS} text-xs text-slate-700 p-2.5`}>
                      <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
                        Recommended Intervention:
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                        {spot.recommendedIntervention}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
