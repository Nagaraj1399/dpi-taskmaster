import React from 'react';
import { AlertTriangle, Phone, PhoneCall, Square } from 'lucide-react';
import type { GrievanceSector, GrievanceUrgency } from '../../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';

const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'] as const;

interface IvrDialpadPanelProps {
  ivrCallActive: boolean;
  ivrPromptStep: number;
  ivrDialedDigits: string;
  sector: GrievanceSector;
  urgency: GrievanceUrgency;
  onStartCall: () => void;
  onEndCall: () => void;
  onKeypadPress: (digit: string) => void;
}

/** Interactive BRICS toll-free IVR dialpad simulator and DPG privacy sidebar. */
export const IvrDialpadPanel: React.FC<IvrDialpadPanelProps> = ({
  ivrCallActive,
  ivrPromptStep,
  ivrDialedDigits,
  sector,
  urgency,
  onStartCall,
  onEndCall,
  onKeypadPress,
}) => (
  <div className="space-y-6">
    <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <PhoneCall className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">BRICS IVR Telephony Gateway</h3>
            <p className="text-[11px] text-slate-600 font-medium">Toll-Free Dial-in Simulator</p>
          </div>
        </div>

        <div
          className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-bold ${
            ivrCallActive
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-pulse'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {ivrCallActive ? 'CALL CONNECTED' : 'READY'}
        </div>
      </div>

      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
        <div className="text-slate-300 flex items-center justify-between text-[11px]">
          <span>Toll-Free: +91 1800-CIVIC-BRICS</span>
          <span className="text-emerald-400 font-bold">Node: BR-IN-01</span>
        </div>
        <div
          role="status"
          aria-live="polite"
          className="text-emerald-300 text-xs min-h-[32px] bg-slate-950 p-2.5 rounded border border-slate-800"
        >
          {ivrCallActive
            ? ivrPromptStep === 1
              ? 'Press 1 for Water, 2 for Roads, 3 for Health. Press 9 for Emergency.'
              : `Selection logged: Sector [${sector}], Urgency [${urgency}]. Speak your grievance after beep.`
            : 'Dial 1800 to simulate rural citizen telephony intake.'}
        </div>
        {ivrDialedDigits && (
          <div className="text-[11px] text-slate-300 truncate">
            Dialed sequence: <span className="text-white font-bold">{ivrDialedDigits}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2" role="group" aria-label="IVR telephone keypad">
        {KEYPAD_DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => onKeypadPress(digit)}
            aria-label={`Dial ${digit}`}
            className="bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 text-slate-900 font-bold py-2.5 rounded-lg text-sm transition-all border border-slate-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            {digit}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {!ivrCallActive ? (
          <button
            type="button"
            onClick={onStartCall}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Call Toll-Free Helpline</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onEndCall}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <Square className="w-3.5 h-3.5" aria-hidden="true" />
            <span>End Call</span>
          </button>
        )}
      </div>
    </div>

    <div className={`${SUBTLE_PANEL_CLASS} p-4 text-xs text-slate-700 space-y-2`}>
      <div className="text-slate-900 font-bold flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
        <span>DPG Data Privacy &amp; Sovereignty</span>
      </div>
      <p className="text-[11px] leading-relaxed font-medium">
        All citizen voice notes and telephone recordings are processed on sovereign cloud instances.
        Voice biometric data and contact numbers are tokenized before ingestion into the data fusion
        pipeline.
      </p>
    </div>
  </div>
);
