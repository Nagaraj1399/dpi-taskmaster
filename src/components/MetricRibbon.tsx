import React from 'react';
import { Building2, CheckCircle2, Cpu, Users } from 'lucide-react';
import { BRICS_COUNTRIES } from '../shared/bricsData';
import type { BricsCountryCode } from '../shared/types';

interface MetricRibbonProps {
  selectedCountryCode: BricsCountryCode;
  totalGrievancesCount: number;
}

/** Displays key national baseline metrics and citizen intake counts for the active BRICS nation. */
export const MetricRibbon: React.FC<MetricRibbonProps> = ({
  selectedCountryCode,
  totalGrievancesCount,
}) => {
  const selectedCountry = BRICS_COUNTRIES[selectedCountryCode] ?? BRICS_COUNTRIES.IN;

  return (
    <section
      id="brics-metric-ribbon"
      aria-label="National baseline summary"
      className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Active Jurisdiction */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 flex items-center space-x-3 shadow-xs">
            <span className="text-2xl" aria-hidden="true">
              {selectedCountry.flag}
            </span>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                Active Member State
              </div>
              <div className="text-sm font-extrabold text-slate-900 truncate">
                {selectedCountry.name}
              </div>
            </div>
          </div>

          {/* Demographic Base */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 flex items-center space-x-3 shadow-xs">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                Census Population
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {selectedCountry.demographics.totalPopulation}
              </div>
            </div>
          </div>

          {/* Government Portal & API */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 flex items-center space-x-3 shadow-xs">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="truncate min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                Gov Open Portal
              </div>
              <div
                className="text-xs font-bold text-emerald-800 truncate"
                title={selectedCountry.openDataPortalName}
              >
                {selectedCountry.openDataPortalName.split('(')[0]}
              </div>
            </div>
          </div>

          {/* Public Capital Budget Fused */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 flex items-center space-x-3 shadow-xs">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Cpu className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                Public Capital Plan
              </div>
              <div className="text-sm font-extrabold text-amber-900">
                {selectedCountry.publicInvestment.totalBudgetUSD}
              </div>
            </div>
          </div>

          {/* Grounded Pipeline & Grievance Count */}
          <div className="col-span-2 md:col-span-1 bg-emerald-50/60 border border-emerald-200 rounded-xl p-2.5 flex items-center space-x-3 shadow-xs">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold">
                DPG Guardrail
              </div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Open-Data Grounded ({totalGrievancesCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
