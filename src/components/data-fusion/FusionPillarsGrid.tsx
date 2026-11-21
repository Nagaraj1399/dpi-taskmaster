import React from 'react';
import { Activity, DollarSign, Users } from 'lucide-react';
import type { FusionResult } from '../../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';

interface FusionPillarsGridProps {
  fusionResult: FusionResult;
}

/** Renders the three cross-referenced governance pillars for an executed fusion result. */
export const FusionPillarsGrid: React.FC<FusionPillarsGridProps> = ({ fusionResult }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Pillar 1: Demographic Fusion */}
    <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
          <Users className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Demographic Context
          </h4>
          <p className="text-[11px] text-slate-600 font-medium">Census &amp; Density Impact</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
          <span className="text-slate-600 text-[11px] font-medium block">
            Estimated Impacted Population:
          </span>
          <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
            {fusionResult.demographicContext.affectedPopulationEst.toLocaleString()} Citizens
          </span>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
          <span className="text-slate-600 text-[11px] font-medium block">
            Vulnerability Weight:
          </span>
          <span className="text-sm font-bold text-blue-700 mt-0.5 block">
            {fusionResult.demographicContext.vulnerabilityWeight} / 100 Index
          </span>
        </div>

        <div className="text-[11px] text-slate-600">
          Authority:{' '}
          <strong className="text-slate-800">{fusionResult.demographicContext.censusSource}</strong>
        </div>
      </div>
    </div>

    {/* Pillar 2: Infrastructure Baseline Cross-Ref */}
    <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200">
        <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
          <Activity className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Infrastructure Index
          </h4>
          <p className="text-[11px] text-slate-600 font-medium">Baseline vs Reported Gap</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
          <span className="text-slate-600 text-[11px] font-medium block">
            Baseline Regional Index Score:
          </span>
          <span className="text-base font-extrabold text-cyan-800 mt-0.5 block">
            {fusionResult.infrastructureGapAnalysis.baselineIndex} / 100
          </span>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
          <span className="text-slate-600 text-[11px] font-medium block">
            Reported Infrastructure Deficiency:
          </span>
          <span className="text-xs text-slate-700 mt-0.5 block italic leading-relaxed line-clamp-3">
            &ldquo;{fusionResult.infrastructureGapAnalysis.reportedDeficiency}&rdquo;
          </span>
        </div>

        <div className="text-[11px] text-slate-600">
          Dataset Ref:{' '}
          <strong className="text-slate-800">
            {fusionResult.infrastructureGapAnalysis.officialDatasetReference}
          </strong>
        </div>
      </div>
    </div>

    {/* Pillar 3: Public Investment Alignment */}
    <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
          <DollarSign className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Public Investment Alignment
          </h4>
          <p className="text-[11px] text-slate-600 font-medium">Fiscal Program Allocation</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
          <span className="text-slate-600 text-[11px] font-medium block">
            Matching National Program:
          </span>
          <span className="text-xs font-bold text-slate-900 mt-0.5 block">
            {fusionResult.publicInvestmentAlignment.matchingProgramName}
          </span>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-amber-800 font-bold">
              {fusionResult.publicInvestmentAlignment.allocatedAmountUSD}
            </span>
            <span className="text-slate-600 font-medium">
              Status:{' '}
              <strong className="text-emerald-700">
                {fusionResult.publicInvestmentAlignment.disbursementStatus}
              </strong>
            </span>
          </div>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
          <span className="text-slate-600 text-[11px] font-medium block">
            Fiscal Variance Finding:
          </span>
          <span className="text-xs text-slate-700 mt-0.5 block leading-relaxed">
            {fusionResult.publicInvestmentAlignment.fiscalVarianceNote}
          </span>
        </div>
      </div>
    </div>
  </div>
);
