import express, { Router } from 'express';
import { DEFAULT_JSON_BODY_LIMIT } from '../../shared/constants.js';
import { IvrProcessRequestSchema } from '../../shared/schemas.js';
import type { BricsCountryCode } from '../../shared/types.js';
import { validateBody } from '../middleware/validate.js';
import { processIvrTelemetry } from '../services/fusion.js';
import type { VerificationService } from '../services/verification.js';

/**
 * Creates the voice IVR processing router exposing `POST /api/voice/process-ivr`.
 */
export function createVoiceRouter(verificationService: VerificationService): Router {
  const router = Router();
  const jsonParser = express.json({ limit: DEFAULT_JSON_BODY_LIMIT });

  router.post('/process-ivr', jsonParser, validateBody(IvrProcessRequestSchema), (req, res) => {
    const { callerPhone, keypadSelection, speechTranscript, countryCode } = req.body as {
      callerPhone?: string;
      keypadSelection?: string;
      speechTranscript?: string;
      countryCode: BricsCountryCode;
    };

    const country = verificationService.getCountry(countryCode);
    const telemetry = processIvrTelemetry(country, {
      callerPhone,
      keypadSelection,
      speechTranscript,
    });

    res.json({
      success: true,
      telemetry,
      sampleExtractedText: telemetry.extractedText,
    });
  });

  return router;
}
