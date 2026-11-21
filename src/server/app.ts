import cors, { type CorsOptionsDelegate } from 'cors';
import express, { type Express, type Request } from 'express';
import helmet from 'helmet';
import type { ServerConfig } from './config.js';
import { ValidationError } from './errors.js';
import { createLogger, type Logger } from './logger.js';
import { apiNotFoundHandler, createGlobalErrorHandler } from './middleware/errorHandler.js';
import { createAiRateLimiter } from './middleware/rateLimit.js';
import { createDatasetsRouter } from './routes/brics.js';
import { createFusionRouter } from './routes/fusion.js';
import { createHealthRouter } from './routes/health.js';
import { createVisionRouter } from './routes/vision.js';
import { createVoiceRouter } from './routes/voice.js';
import { createAiService, type AiService, type GenAiModelsClient } from './services/ai.js';
import {
  createVerificationService,
  type FetchLike,
  type VerificationService,
} from './services/verification.js';

/** Optional dependency overrides used primarily for unit and integration testing. */
export interface CreateAppDeps {
  logger?: Logger;
  aiClient?: GenAiModelsClient | null;
  aiService?: AiService;
  verificationService?: VerificationService;
  fetchFn?: FetchLike;
}

/**
 * Checks whether a browser `Origin` matches the incoming request's own Host / X-Forwarded-Host
 * (same-origin module/fetch requests) or configured `APP_URL` preview URL.
 */
function isSameOriginOrConfiguredApp(req: Request, origin: string, config: ServerConfig): boolean {
  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const forwardedHost = req.get('x-forwarded-host')?.split(',')[0]?.trim().toLowerCase();
  const requestHost = req.get('host')?.trim().toLowerCase();
  const originHost = parsedOrigin.host.toLowerCase();

  if (
    (forwardedHost && originHost === forwardedHost) ||
    (requestHost && originHost === requestHost)
  ) {
    return true;
  }

  if (config.appUrl) {
    const sharedAppUrl = config.appUrl.replace('://ais-dev-', '://ais-pre-');
    if (parsedOrigin.origin === config.appUrl || parsedOrigin.origin === sharedAppUrl) {
      return true;
    }
  }

  return false;
}

/**
 * Builds an explicit request-aware CORS policy for `/api/*` routes.
 * Same-origin requests, `APP_URL`, and `CORS_ORIGIN` entries are permitted;
 * third-party origins not explicitly allowed are rejected with `CORS_DENIED`.
 */
function buildCorsOptionsDelegate(config: ServerConfig): CorsOptionsDelegate<Request> {
  return (req, callback) => {
    const origin = req.header('origin');

    if (!origin) {
      callback(null, { origin: false });
      return;
    }

    const allowed =
      config.corsOrigins.includes('*') ||
      config.corsOrigins.includes(origin) ||
      isSameOriginOrConfiguredApp(req, origin, config) ||
      (config.nodeEnv !== 'production' &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));

    if (allowed) {
      callback(null, {
        origin: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false,
      });
      return;
    }

    callback(new ValidationError('Origin not allowed by CORS policy.', undefined, 'CORS_DENIED'), {
      origin: false,
    });
  };
}

/**
 * Creates and configures the Express application instance without binding a TCP port
 * or attaching Vite middleware, making it cleanly testable via `supertest`.
 */
export function createApp(
  config: ServerConfig,
  deps: CreateAppDeps = {}
): {
  app: Express;
  logger: Logger;
  verificationService: VerificationService;
} {
  const app = express();
  const logger = deps.logger ?? createLogger(config.logLevel);
  const aiService = deps.aiService ?? createAiService(config, logger, deps.aiClient);
  const verificationService =
    deps.verificationService ?? createVerificationService(logger, deps.fetchFn);
  const aiRateLimiter = createAiRateLimiter();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(
    helmet({
      // Allow AI Studio iframe preview and Vite dev inline module scripts while keeping standard security headers.
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      xFrameOptions: false,
    })
  );
  app.use('/api', cors(buildCorsOptionsDelegate(config)));

  app.use('/api', createHealthRouter());
  app.use('/api', createDatasetsRouter(verificationService));
  app.use(
    '/api/fusion',
    createFusionRouter({ aiService, config, verificationService, aiRateLimiter })
  );
  app.use(
    '/api/vision',
    createVisionRouter({
      aiService,
      config,
      verificationService,
      aiRateLimiter,
      fetchFn: deps.fetchFn,
    })
  );
  app.use('/api/voice', createVoiceRouter(verificationService));

  app.use('/api', apiNotFoundHandler);
  app.use('/api', createGlobalErrorHandler(logger));

  return { app, logger, verificationService };
}
