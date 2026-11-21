import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, ShieldCheck, Terminal } from 'lucide-react';
import { UI_NOTIFICATION_TIMEOUT_MS } from '../shared/constants';
import type { DataFusionTelemetry, FusionResult } from '../shared/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS, SUBTLE_PANEL_CLASS } from './ui/styles';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  fusionResult: FusionResult | null;
  selectedCountryName: string;
}

/**
 * Accessible modal displaying the JSON telemetry payload emitted by `/api/fusion/analyze`,
 * or the standard DPG schema template when no fusion has completed yet.
 */
export const TelemetryModal: React.FC<TelemetryModalProps> = ({
  isOpen,
  onClose,
  fusionResult,
  selectedCountryName,
}) => {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const defaultTelemetry: DataFusionTelemetry = {
    brics_data_fusion_telemetry: {
      source_type: 'Official Government API & Open Data Portal',
      dataset_categories: [
        'National Demographic Data',
        'Infrastructure Indices',
        'Public Investment Plans',
      ],
      verification_status: 'Awaiting fusion execution',
      dpg_compliance: true,
    },
    citizen_grievance_integration: {
      ingestion_channels: ['Voice IVR', 'Messaging Apps', 'Web Portals'],
      cross_reference_status: 'Pending fusion request',
    },
  };

  const telemetryData = fusionResult?.telemetry ?? defaultTelemetry;
  const jsonString = JSON.stringify(telemetryData, null, 2);
  const isLiveResult = fusionResult !== null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopied(false), UI_NOTIFICATION_TIMEOUT_MS);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `civicpulse-brics-telemetry-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-slate-200 text-slate-900 shadow-xl p-0 gap-0 overflow-hidden sm:rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 pr-12 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Terminal className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>JSON Data Fusion Telemetry</span>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-mono px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                  DPG Schema
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 font-medium mt-0.5">
                Official Schema Specification ({selectedCountryName})
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] font-mono text-xs bg-white space-y-4">
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-4 text-emerald-300 leading-relaxed overflow-x-auto shadow-inner">
            <pre className="text-xs font-mono">
              <code>{jsonString}</code>
            </pre>
          </div>

          <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2 text-xs text-slate-700 font-sans`}>
            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Digital Public Good (DPG) Standard Alignment</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
              <li>
                <strong className="text-slate-800">Open-Data Grounded:</strong> References official
                portals (Data.gov.in, IBGE, Rosstat, Bayanat.ae) and Zod-validated inputs.
              </li>
              <li>
                <strong className="text-slate-800">Privacy Hygiene:</strong> Anonymized contact
                metadata prevents PII exposure in downstream analytics.
              </li>
              <li>
                <strong className="text-slate-800">Canonical Integrity:</strong> Active fusion runs
                compute a reproducible SHA-256 payload digest in Node crypto.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/70 gap-3">
          <span className="text-[11px] text-slate-600 font-mono">
            Payload Status:{' '}
            <strong className={isLiveResult ? 'text-emerald-700' : 'text-amber-800'}>
              {isLiveResult ? 'Live Fusion Telemetry' : 'Default Schema Template'}
            </strong>
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button type="button" onClick={handleCopy} className={SECONDARY_BUTTON_CLASS}>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button type="button" onClick={handleDownload} className={PRIMARY_BUTTON_CLASS}>
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download Schema File</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
