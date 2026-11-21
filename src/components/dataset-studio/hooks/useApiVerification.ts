import { useCallback, useState } from 'react';
import type {
  ApiErrorResponse,
  BricsCountry,
  CustomApiEndpointConfig,
  DatasetVerificationResult,
} from '../../../shared/types';

/** Explicit verification lifecycle status union. */
export type VerificationStatus = 'idle' | 'verifying' | 'passed' | 'failed';

interface VerifySyncApiResponse {
  success: boolean;
  verificationResult?: DatasetVerificationResult;
  updatedDataset?: BricsCountry | null;
  error?: ApiErrorResponse['error'];
}

/**
 * Manages API dataset verification state with explicit status transitions
 * (`idle` | `verifying` | `passed` | `failed`) and never fabricates passing proofs on error.
 */
export function useApiVerification() {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [result, setResult] = useState<DatasetVerificationResult | null>(null);
  const [verifiedDataset, setVerifiedDataset] = useState<BricsCountry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setVerifiedDataset(null);
    setErrorMessage(null);
  }, []);

  const verify = useCallback(
    async (dataset: BricsCountry, customApiConfig?: CustomApiEndpointConfig): Promise<boolean> => {
      setStatus('verifying');
      setErrorMessage(null);

      try {
        const response = await fetch('/api/datasets/verify-and-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            countryCode: dataset.code,
            dataset,
            ...(customApiConfig ? { customApiConfig } : {}),
          }),
        });

        const body = (await response.json()) as VerifySyncApiResponse;

        if (!response.ok || !body.success || !body.verificationResult?.verified) {
          setStatus('failed');
          setResult(body.verificationResult ?? null);
          setVerifiedDataset(null);
          setErrorMessage(
            body.error?.message ?? 'Dataset verification failed. Please review validation checks.'
          );
          return false;
        }

        setStatus('passed');
        setResult(body.verificationResult);
        setVerifiedDataset(body.updatedDataset ?? dataset);
        return true;
      } catch (err: unknown) {
        setStatus('failed');
        setResult(null);
        setVerifiedDataset(null);
        setErrorMessage(
          err instanceof Error
            ? `Verification request failed: ${err.message}`
            : 'Verification request failed due to a network error.'
        );
        return false;
      }
    },
    []
  );

  return {
    status,
    result,
    verifiedDataset,
    errorMessage,
    verify,
    reset,
  };
}
