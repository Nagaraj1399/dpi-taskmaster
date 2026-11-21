import { useCallback, useEffect, useRef, useState } from 'react';
import { UI_NOTIFICATION_TIMEOUT_MS } from '../../../shared/constants';
import type {
  ApiErrorResponse,
  BricsCountry,
  DatasetVerificationResult,
} from '../../../shared/types';

export type QuickVerifyStatus = 'idle' | 'verifying' | 'passed' | 'failed';

interface VerifyApiResponse {
  success: boolean;
  verificationResult?: DatasetVerificationResult;
  error?: ApiErrorResponse['error'];
}

/**
 * Runs a quick schema and digest verification check against `/api/datasets/verify-and-sync`
 * for the currently displayed country dataset, cleaning up status timers on unmount.
 */
export function useQuickApiVerify() {
  const [status, setStatus] = useState<QuickVerifyStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastDigest, setLastDigest] = useState<string | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduledTimer = useCallback(() => {
    if (clearTimerRef.current !== null) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearScheduledTimer();
    };
  }, [clearScheduledTimer]);

  const scheduleAutoClear = useCallback(() => {
    clearScheduledTimer();
    clearTimerRef.current = setTimeout(() => {
      setStatusMessage(null);
    }, UI_NOTIFICATION_TIMEOUT_MS * 2);
  }, [clearScheduledTimer]);

  const verifyCountryDataset = useCallback(
    async (country: BricsCountry): Promise<DatasetVerificationResult | null> => {
      clearScheduledTimer();
      setStatus('verifying');
      setStatusMessage('Verifying dataset schema and computing canonical SHA-256 digest...');

      try {
        const res = await fetch('/api/datasets/verify-and-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            countryCode: country.code,
            dataset: country,
          }),
        });

        const data = (await res.json()) as VerifyApiResponse;

        if (!res.ok || !data.success || !data.verificationResult?.verified) {
          setStatus('failed');
          const msg =
            data.error?.message ??
            (data.verificationResult
              ? `Schema verification failed (${data.verificationResult.checksPassed}/${data.verificationResult.checksTotal} checks passed).`
              : 'Dataset verification failed.');
          setStatusMessage(msg);
          scheduleAutoClear();
          return data.verificationResult ?? null;
        }

        const result = data.verificationResult;
        setStatus('passed');
        setLastDigest(result.sha256Digest);
        setStatusMessage(
          `Verified (${result.checksPassed}/${result.checksTotal} schema checks) • SHA-256: ${result.sha256Digest.slice(0, 18)}...`
        );
        scheduleAutoClear();
        return result;
      } catch (err: unknown) {
        setStatus('failed');
        setStatusMessage(
          err instanceof Error
            ? `Verification request failed: ${err.message}`
            : 'Verification request failed due to a network error.'
        );
        scheduleAutoClear();
        return null;
      }
    },
    [clearScheduledTimer, scheduleAutoClear]
  );

  return {
    status,
    statusMessage,
    lastDigest,
    setLastDigest,
    verifyCountryDataset,
  };
}
