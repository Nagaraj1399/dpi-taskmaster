import React from 'react';
import { AlertTriangle, Check, CheckCircle2, XCircle } from 'lucide-react';
import type { DatasetVerificationResult } from '../../shared/types';
import type { VerificationStatus } from './hooks/useApiVerification';

interface VerificationResultPanelProps {
  status: VerificationStatus;
  result: DatasetVerificationResult | null;
  errorMessage: string | null;
}

/**
 * Displays verification outcomes honestly: passed schema/probe checks,
 * failed checks, or server/network errors inside an accessible live region.
 */
export const VerificationResultPanel: React.FC<VerificationResultPanelProps> = ({
  status,
  result,
  errorMessage,
}) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'verifying') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 font-semibold"
      >
        Validating baseline schemas and verifying endpoint connectivity...
      </div>
    );
  }

  const isPassed = status === 'passed' && result?.verified === true;
  const containerClass = isPassed
    ? 'bg-emerald-50 border-emerald-200'
    : 'bg-rose-50 border-rose-200';

  return (
    <div
      role={isPassed ? 'status' : 'alert'}
      aria-live="polite"
      className={`border rounded-xl p-4 space-y-3 ${containerClass}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {isPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
          )}
          <span className="text-sm font-bold text-slate-900">
            {isPassed
              ? 'Schema & API Verification Passed'
              : 'Dataset Verification Failed — Changes Not Saved'}
          </span>
        </div>

        {result && (
          <span
            className={`text-xs font-mono bg-white font-bold px-2.5 py-0.5 rounded border ${
              isPassed ? 'text-emerald-800 border-emerald-300' : 'text-rose-800 border-rose-300'
            }`}
          >
            {result.checksPassed}/{result.checksTotal} Checks Passed
            {result.endpointStatus?.probed && result.endpointStatus.httpStatus !== undefined
              ? ` • HTTP ${result.endpointStatus.httpStatus} (${result.endpointStatus.responseTimeMs ?? 0}ms)`
              : ''}
          </span>
        )}
      </div>

      {errorMessage && !isPassed && (
        <p className="text-xs text-rose-800 font-semibold">{errorMessage}</p>
      )}

      {result && (
        <>
          <div className="space-y-1.5 text-xs">
            {result.checks.map((chk) => (
              <div key={chk.id} className="flex items-start space-x-2 text-slate-800">
                {chk.passed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="text-slate-900">{chk.name}: </strong>
                  <span className="text-slate-700">{chk.message}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <div className="font-mono text-slate-700 truncate">
              Canonical Payload SHA-256:{' '}
              <span className="text-slate-900 font-bold">{result.sha256Digest}</span>
            </div>
            <div className="text-slate-600">
              Checked at: {new Date(result.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
