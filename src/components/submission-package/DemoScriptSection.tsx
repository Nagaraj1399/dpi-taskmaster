import React from 'react';
import { Check, Copy, Video } from 'lucide-react';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';
import { DEMO_SCENES } from './checklistData';

interface DemoScriptSectionProps {
  copiedField: string | null;
  onCopy: (text: string, label: string) => void;
}

const SCRIPT_EXPORT_SUMMARY = `DEMO VIDEO SCRIPT (CivicPulse BRICS)

0:00 - 0:45: Problem & Track 1 Introduction
0:45 - 1:45: Citizen Multimodal Ingestion (Voice Note & Vision AI)
1:45 - 2:45: Real-Time AI Data Fusion & SHA-256 Provenance Grounding
2:45 - 3:45: Policymaker Demand Hotspots & Cross-Border BRICS 11
3:45 - 4:30: DPG Telemetry & Conclusion`;

/** Renders the 5-scene video recording script with one-click copy support. */
export const DemoScriptSection: React.FC<DemoScriptSectionProps> = ({ copiedField, onCopy }) => (
  <div className={`${CARD_SURFACE_CLASS} p-6 space-y-5`}>
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          <span>3–5 Minute End-to-End Video Walkthrough Script</span>
        </h3>
        <p className="text-xs text-slate-600 font-medium">
          Recording cues, spoken narration, and clickable UI actions for the demo walkthrough.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onCopy(SCRIPT_EXPORT_SUMMARY, 'script')}
        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-emerald-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-bold shadow-xs"
      >
        {copiedField === 'script' ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
        ) : (
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        <span>{copiedField === 'script' ? 'Copied' : 'Copy Script'}</span>
      </button>
    </div>

    <div className="space-y-4 text-xs">
      {DEMO_SCENES.map((scene) => (
        <div key={scene.id} className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
          <div
            className={`flex items-center justify-between font-bold font-mono ${scene.headerColor}`}
          >
            <span>{scene.title}</span>
            <span>{scene.timeRange}</span>
          </div>
          <div className="text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">Visual Action:</p>
            <p className="text-slate-600 font-medium">{scene.visualAction}</p>
            <p className="font-bold text-slate-900 mt-2">Spoken Script:</p>
            <p className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
              {scene.spokenScript}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
