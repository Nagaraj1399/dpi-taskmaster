import React, { useId, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { GOOGLE_AI_STACK } from '../shared/bricsData';

interface TrackHeaderProps {
  onOpenSubmissionPackage?: () => void;
}

/**
 * Top challenge banner with an accessible collapsible panel detailing Track 1 requirements
 * and the integrated Google AI & backend architecture.
 */
export const TrackHeader: React.FC<TrackHeaderProps> = ({ onOpenSubmissionPackage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();

  return (
    <div className="border-b border-slate-200 bg-slate-50/80 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide flex items-center space-x-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Track 1 — AI for Digital Public Infrastructure &amp; Governance</span>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-600">
              <span className="text-slate-300" aria-hidden="true">
                •
              </span>
              <span className="text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                BRICS Theme: Innovation
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenSubmissionPackage && (
              <button
                type="button"
                onClick={onOpenSubmissionPackage}
                className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-semibold border border-amber-300 transition-all shadow-xs"
              >
                <span>Pitch Deck &amp; Submission Kit</span>
              </button>
            )}
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 transition-all shadow-xs"
            >
              <span>{isExpanded ? 'Hide Track Info' : 'Track Requirements'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div id={detailsId} className="mt-3 pt-3 border-t border-slate-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white border border-amber-200/90 p-3.5 rounded-xl space-y-1.5 shadow-xs">
                <div className="text-amber-800 font-bold">The Problem:</div>
                <p className="text-slate-600 leading-relaxed">
                  Governments often struggle to consolidate citizen feedback and align it with
                  national infrastructure priorities. Development requests live in fragmented
                  systems, leading to misaligned public spending, unaddressed infrastructure gaps,
                  and no way to measure the impact of large-scale digital public infrastructure
                  initiatives.
                </p>
              </div>

              <div className="bg-white border border-emerald-200/90 p-3.5 rounded-xl space-y-1.5 shadow-xs">
                <div className="text-emerald-800 font-bold">The Challenge:</div>
                <p className="text-slate-600 leading-relaxed">
                  Build a scalable, multilingual AI platform — designed as a{' '}
                  <strong className="text-slate-900">Digital Public Good (DPG)</strong> — that
                  aggregates citizen development requests via voice, text, and messaging apps across
                  diverse linguistic regions and fuses them with demographic data, infrastructure
                  indices, and public investment plans.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Integrated Technology &amp; Google AI Stack
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  Server-Side Integration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {GOOGLE_AI_STACK.map((item) => (
                  <div
                    key={item.category}
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">{item.category}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 font-medium">
                      {item.tools}
                    </div>
                    <div className="text-[10px] text-slate-600 line-clamp-2">{item.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
