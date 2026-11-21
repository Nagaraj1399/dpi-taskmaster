import express, { Router, type RequestHandler } from 'express';
import { DEFAULT_JSON_BODY_LIMIT } from '../../shared/constants.js';
import { FusionAnalyzeRequestSchema } from '../../shared/schemas.js';
import type { BricsCountryCode, CitizenGrievance } from '../../shared/types.js';
import type { ServerConfig } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import type { AiService } from '../services/ai.js';
import { analyzeGrievanceFusion } from '../services/fusion.js';
import type { VerificationService } from '../services/verification.js';

/**
 * Creates the AI data-fusion router exposing `POST /api/fusion/analyze`.
 */
export function createFusionRouter(deps: {
  aiService: AiService;
  config: ServerConfig;
  verificationService: VerificationService;
  aiRateLimiter: RequestHandler;
}): Router {
  const router = Router();
  const jsonParser = express.json({ limit: DEFAULT_JSON_BODY_LIMIT });

  router.post(
    '/analyze',
    deps.aiRateLimiter,
    jsonParser,
    validateBody(FusionAnalyzeRequestSchema),
    async (req, res, next) => {
      try {
        const { countryCode, grievance } = req.body as {
          countryCode: BricsCountryCode;
          grievance: Pick<
            CitizenGrievance,
            'region' | 'channel' | 'originalText' | 'originalLanguage' | 'sector' | 'urgency'
          > & { id?: string };
        };

        const country = deps.verificationService.getCountry(countryCode);
        const result = await analyzeGrievanceFusion({
          aiService: deps.aiService,
          config: deps.config,
          country,
          grievance,
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
