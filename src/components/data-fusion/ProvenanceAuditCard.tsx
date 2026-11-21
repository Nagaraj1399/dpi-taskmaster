import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, ShieldCheck, Terminal } from 'lucide-react';
import { UI_NOTIFICATION_TIMEOUT_MS } from '../../shared/constants';
import type { FusionResult } from '../../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';

interface ProvenanceAuditCardProps {
  provenance: FusionResult['provenance'];
  onOpenTelemetry: () => void;
}

/**
 * Displays authorized registries consulted, the model identifier, and the canonical SHA-256
 * payload digest computed for a fusion response.
 */
export const ProvenanceAuditCard: React.FC<ProvenanceAuditCardProps> = ({
  provenance,
  onOpenTelemetry,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyHash = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(true);
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopiedHash(false), UI_NOTIFICATION_TIMEOUT_MS);
    } catch {
      setCopiedHash(false);
    }
  };

  return (
    <div className={`${CARD_SURFACE_CLASS} p-6 space-y-4`}>
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>Data Provenance &amp; Audit</span>
        </h4>
        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-md truncate max-w-[140px]">
          {provenance.aiModelUsed}
        </span>
      </div>

      <div className="space-y-3 text-xs text-slate-700">
        <div>
          <span className="text-[11px] text-slate-600 block font-bold">
            Authorized Portals Grounded:
          </span>
          <ul className="list-disc list-inside text-[11px] text-slate-700 mt-1 space-y-0.5">
            {provenance.authorizedPortalsConsulted.map((portal, idx) => (
              <li key={`${portal}-${idx}`} className="truncate">
                {portal}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-2.5 font-mono text-[11px]`}>
          <div className="text-slate-600 flex items-center justify-between font-semibold">
            <span>Payload SHA-256 Digest:</span>
            <button
              type="button"
              onClick={() => handleCopyHash(provenance.payloadSha256)}
              aria-label={copiedHash ? 'SHA-256 digest copied' : 'Copy SHA-256 digest'}
              className="text-emerald-700 hover:text-emerald-900 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {copiedHash ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="text-slate-900 truncate mt-0.5 font-bold">{provenance.payloadSha256}</div>
        </div>

        <button
          id="btn-inspect-telemetry"
          type="button"
          onClick={onOpenTelemetry}
          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 border border-emerald-200 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span>Inspect JSON Data Fusion Telemetry</span>
        </button>
      </div>
    </div>
  );
};
