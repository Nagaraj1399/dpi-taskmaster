import rateLimit from 'express-rate-limit';
import { AI_RATE_LIMIT_MAX_REQUESTS, AI_RATE_LIMIT_WINDOW_MS } from '../../shared/constants.js';
import type { ApiErrorResponse } from '../../shared/types.js';

/**
 * Creates a rate-limiting middleware configured for compute-intensive AI routes.
 */
export function createAiRateLimiter(options?: { windowMs?: number; max?: number }) {
  return rateLimit({
    windowMs: options?.windowMs ?? AI_RATE_LIMIT_WINDOW_MS,
    limit: options?.max ?? AI_RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      const body: ApiErrorResponse = {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many AI analysis requests. Please wait a moment and try again.',
        },
      };
      res.status(429).json(body);
    },
  });
}
