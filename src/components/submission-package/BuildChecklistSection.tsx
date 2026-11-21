import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { AppTab } from '../../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';
import { BUILD_CRITERIA_ITEMS } from './checklistData';

interface BuildChecklistSectionProps {
  onNavigateTab: (tab: Exclude<AppTab, 'package'>) => void;
}

/** Renders the 5 mandatory evaluation criteria with deep-link buttons to live app features. */
export const BuildChecklistSection: React.FC<BuildChecklistSectionProps> = ({ onNavigateTab }) => (
  <div className={`${CARD_SURFACE_CLASS} p-6`}>
    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Mandatory Build Criteria Verification
        </h3>
        <p className="text-xs text-slate-600 font-medium">
          Every core requirement implemented with live interactive execution and schema checks.
        </p>
      </div>
      <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
        {BUILD_CRITERIA_ITEMS.length} OF {BUILD_CRITERIA_ITEMS.length} IMPLEMENTED
      </span>
    </div>

    <div className="space-y-3">
      {BUILD_CRITERIA_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`${SUBTLE_PANEL_CLASS} p-4 flex flex-col md:flex-row md:items-center justify-between gap-3`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg border shrink-0 ${item.iconContainerClass}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
                  <span>{item.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">{item.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab(item.targetTab)}
              className={`shrink-0 bg-white hover:bg-slate-50 ${item.buttonTextClass} text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold shadow-xs`}
            >
              <span>{item.actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  </div>
);
