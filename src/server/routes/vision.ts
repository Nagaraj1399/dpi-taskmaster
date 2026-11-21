import express, { Router, type RequestHandler } from 'express';
import { VISION_JSON_BODY_LIMIT } from '../../shared/constants.js';
import { VisionAnalyzeRequestSchema } from '../../shared/schemas.js';
import type { BricsCountryCode } from '../../shared/types.js';
import type { ServerConfig } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import type { AiService } from '../services/ai.js';
import { analyzeInfrastructurePhoto } from '../services/fusion.js';
import type { VerificationService, FetchLike } from '../services/verification.js';

/**
 * Creates the multimodal vision router exposing `POST /api/vision/analyze-photo`.
 */
export function createVisionRouter(deps: {
  aiService: AiService;
  config: ServerConfig;
  verificationService: VerificationService;
  aiRateLimiter: RequestHandler;
  fetchFn?: FetchLike;
}): Router {
  const router = Router();
  const visionJsonParser = express.json({ limit: VISION_JSON_BODY_LIMIT });

  router.post(
    '/analyze-photo',
    deps.aiRateLimiter,
    visionJsonParser,
    validateBody(VisionAnalyzeRequestSchema),
    async (req, res, next) => {
      try {
        const { photoUrl, imageBase64, sector, countryCode, region } = req.body as {
          photoUrl?: string;
          imageBase64?: string;
          sector?: string;
          countryCode: BricsCountryCode;
          region?: string;
        };

        const country = deps.verificationService.getCountry(countryCode);
        const result = await analyzeInfrastructurePhoto({
          aiService: deps.aiService,
          config: deps.config,
          country,
          photoUrl,
          imageBase64,
          sector,
          region,
          fetchFn: deps.fetchFn,
        });

        res.json({
          success: true,
          result,
        });
      } catch (err: unknown) {
        next(err);
      }
    }
  );

  return router;
}
