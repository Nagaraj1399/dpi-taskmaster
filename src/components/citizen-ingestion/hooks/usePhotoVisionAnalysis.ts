import { useCallback, useState } from 'react';
import type {
  ApiErrorResponse,
  BricsCountryCode,
  VisionAnalysisResult,
} from '../../../shared/types';

export type VisionAnalysisStatus = 'idle' | 'analyzing' | 'succeeded' | 'failed';

interface VisionApiResponse {
  success: boolean;
  result?: VisionAnalysisResult;
  error?: ApiErrorResponse['error'];
}

/**
 * Calls `/api/vision/analyze-photo` and exposes explicit loading, success, and error states
 * without fabricating severity scores when the AI backend fails or is unconfigured.
 */
export function usePhotoVisionAnalysis() {
  const [status, setStatus] = useState<VisionAnalysisStatus>('idle');
  const [analysis, setAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const analyzePhoto = useCallback(
    async (params: {
      photoUrl?: string;
      imageBase64?: string;
      sector?: string;
      countryCode: BricsCountryCode;
      region?: string;
    }): Promise<VisionAnalysisResult | null> => {
      setStatus('analyzing');
      setErrorMessage(null);
      setAnalysis(null);

      try {
        const res = await fetch('/api/vision/analyze-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        const data = (await res.json()) as VisionApiResponse;
        if (!res.ok || !data.success || !data.result) {
          setStatus('failed');
          setErrorMessage(
            data.error?.message ?? 'Gemini Vision photo analysis failed to return a result.'
          );
          return null;
        }

        setStatus('succeeded');
        setAnalysis(data.result);
        return data.result;
      } catch (err: unknown) {
        setStatus('failed');
        setErrorMessage(
          err instanceof Error
            ? `Photo analysis request failed: ${err.message}`
            : 'Photo analysis request failed due to a network error.'
        );
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setAnalysis(null);
    setErrorMessage(null);
  }, []);

  return {
    status,
    analysis,
    errorMessage,
    analyzePhoto,
    reset,
  };
}
