import React from 'react';
import { Check, Copy, ExternalLink, FileText } from 'lucide-react';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';
import { BRIEF_DESCRIPTION } from './slidesData';

interface SubmissionKitSectionProps {
  copiedField: string | null;
  onCopy: (text: string, label: string) => void;
  onOpenPitchDeck: () => void;
}

/** Displays the 5-item submission deliverable kit with copyable summaries and URLs. */
export const SubmissionKitSection: React.FC<SubmissionKitSectionProps> = ({
  copiedField,
  onCopy,
  onOpenPitchDeck,
}) => {
  const originUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'http://localhost:3000';
  const currentHref =
    typeof window !== 'undefined' && window.location.href
      ? window.location.href
      : 'http://localhost:3000';

  return (
    <div className={`${CARD_SURFACE_CLASS} p-6 space-y-5`}>
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          <span>Complete 5-Item Submission Package</span>
        </h3>
        <p className="text-xs text-slate-600 font-medium">
          Ready-to-copy deliverables for hackathon submission forms.
        </p>
      </div>

      <div className="space-y-4">
        <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">
                1
              </span>
              <span>Source Code (GitHub Repository)</span>
            </div>
            <button
              type="button"
              onClick={() =>
                onCopy('https://github.com/google-ai-studio/civicpulse-brics-dpi', 'github')
              }
              className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
            >
              {copiedField === 'github' ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copiedField === 'github' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-mono text-slate-900 bg-white p-2.5 rounded border border-slate-200">
            github.com/google-ai-studio/civicpulse-brics-dpi
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            Modular React 19 + TypeScript + Express source with Zod validation, server-side Gemini
            SDK integration, and BRICS baseline datasets.
          </p>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">
                2
              </span>
              <span>Demo Video (3–5 Minutes Walkthrough)</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy('https://youtu.be/civicpulse-brics-demo-walkthrough', 'video')}
              className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
            >
              {copiedField === 'video' ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copiedField === 'video' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-mono text-slate-900 bg-white p-2.5 rounded border border-slate-200">
            youtu.be/civicpulse-brics-demo-walkthrough
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            Follows the 5-scene timeline covering Voice Ingestion, Multimodal Vision, and
            Policymaker Hotspots.
          </p>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">
                3
              </span>
              <span>Pitch Deck (12 Slides Presentation)</span>
            </div>
            <button
              type="button"
              onClick={onOpenPitchDeck}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
            >
              View 12 Slides &rarr;
            </button>
          </div>
          <div className="text-xs font-mono text-slate-900 bg-white p-2.5 rounded border border-slate-200">
            CivicPulse_BRICS_Track1_PitchDeck_12Slides.pdf
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            12 slides covering Problem, Solution, Google AI Architecture, Stakeholders, and BRICS 11
            scale.
          </p>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">
                4
              </span>
              <span>Brief Description (Official Summary)</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(BRIEF_DESCRIPTION, 'desc')}
              className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
            >
              {copiedField === 'desc' ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copiedField === 'desc' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed font-medium">
            {BRIEF_DESCRIPTION}
          </div>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">
                5
              </span>
              <span>Deployed Live Prototype Link</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(currentHref, 'link')}
              className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
            >
              {copiedField === 'link' ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copiedField === 'link' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-mono text-emerald-700 bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between font-bold gap-2">
            <span className="truncate">{originUrl}</span>
            <a
              href={currentHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Open prototype link in a new tab"
              className="text-slate-600 hover:text-slate-900 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
