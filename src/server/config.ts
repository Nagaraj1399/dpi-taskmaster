import { z } from 'zod';
import { DEFAULT_SERVER_PORT } from '../shared/constants.js';
import type { LogLevel } from './logger.js';

/** Default primary Gemini model alias. */
const DEFAULT_GEMINI_MODEL_PRIMARY = 'gemini-4-hydrogen';

/** Default ordered fallback Gemini models (active models per @google/genai spec). */
const DEFAULT_GEMINI_MODEL_FALLBACKS = ['gemini-3.1-flash-lite'];

/** Default Gemini model for multimodal image analysis. */
const DEFAULT_GEMINI_VISION_MODEL = 'gemini-4-hydrogen';

/** Deprecated or unsupported model aliases that return 404 NOT_FOUND on Gemini API. */
const UNSUPPORTED_MODEL_PATTERNS = [
  /-latest$/i,
  /^gemini-1\.5-/i,
  /^gemini-2\.0-/i,
  /^gemini-pro$/i,
];

function isSupportedGeminiModel(modelName: string): boolean {
  return !UNSUPPORTED_MODEL_PATTERNS.some((pattern) => pattern.test(modelName.trim()));
}

/** Minimum valid TCP port number. */
const MIN_PORT = 1;

/** Maximum valid TCP port number. */
const MAX_PORT = 65_535;

/** Placeholder string present in .env.example that must not be treated as a real key. */
const PLACEHOLDER_API_KEY = 'MY_GEMINI_API_KEY';

const EnvSchema = z.object({
  PORT: z.preprocess(
    (val) => (val === undefined || val === '' ? DEFAULT_SERVER_PORT : Number(val)),
    z.number().int().min(MIN_PORT).max(MAX_PORT)
  ),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL_PRIMARY: z.string().trim().min(1).default(DEFAULT_GEMINI_MODEL_PRIMARY),
  GEMINI_MODEL_FALLBACKS: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || !val.trim()) {
        return DEFAULT_GEMINI_MODEL_FALLBACKS;
      }
      return val
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }),
  GEMINI_VISION_MODEL: z.string().trim().min(1).default(DEFAULT_GEMINI_VISION_MODEL),
  CORS_ORIGIN: z.string().optional(),
  APP_URL: z.string().optional(),
  REQUIRE_GEMINI_API_KEY: z.string().optional(),
});

/** Validated runtime configuration object for the Express server. */
export interface ServerConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  logLevel: LogLevel;
  geminiApiKey: string | null;
  geminiModelPrimary: string;
  geminiModelFallbacks: string[];
  geminiVisionModel: string;
  corsOrigins: string[];
  appUrl?: string | null;
}

/** Error thrown during startup when environment configuration fails validation. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * Parses and validates server configuration from an environment dictionary.
 * Throws `ConfigError` immediately if any setting is invalid.
 */
export function parseConfig(
  env: Record<string, string | undefined>,
  options?: { requireGeminiKey?: boolean }
): ServerConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new ConfigError(`Invalid server configuration: ${details}`);
  }

  const rawKey = parsed.data.GEMINI_API_KEY?.trim() ?? '';
  const geminiApiKey = rawKey.length > 0 && rawKey !== PLACEHOLDER_API_KEY ? rawKey : null;

  const mustHaveKey =
    options?.requireGeminiKey ??
    (parsed.data.NODE_ENV === 'production' || parsed.data.REQUIRE_GEMINI_API_KEY === 'true');

  if (mustHaveKey && !geminiApiKey) {
    throw new ConfigError('Invalid server configuration: GEMINI_API_KEY is required');
  }

  if (parsed.data.GEMINI_MODEL_FALLBACKS.length === 0) {
    throw new ConfigError(
      'Invalid server configuration: GEMINI_MODEL_FALLBACKS must contain at least one model'
    );
  }

  const corsOrigins = (parsed.data.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  const rawAppUrl = parsed.data.APP_URL?.trim() ?? '';
  let appUrl: string | null = null;
  if (rawAppUrl.length > 0) {
    try {
      appUrl = new URL(rawAppUrl).origin;
    } catch {
      appUrl = null;
    }
  }

  const geminiModelPrimary = isSupportedGeminiModel(parsed.data.GEMINI_MODEL_PRIMARY)
    ? parsed.data.GEMINI_MODEL_PRIMARY
    : DEFAULT_GEMINI_MODEL_PRIMARY;

  const filteredFallbacks = parsed.data.GEMINI_MODEL_FALLBACKS.filter(isSupportedGeminiModel);
  const geminiModelFallbacks =
    filteredFallbacks.length > 0 ? filteredFallbacks : DEFAULT_GEMINI_MODEL_FALLBACKS;

  const geminiVisionModel = isSupportedGeminiModel(parsed.data.GEMINI_VISION_MODEL)
    ? parsed.data.GEMINI_VISION_MODEL
    : DEFAULT_GEMINI_VISION_MODEL;

  return {
    port: parsed.data.PORT,
    nodeEnv: parsed.data.NODE_ENV,
    logLevel: parsed.data.LOG_LEVEL,
    geminiApiKey,
    geminiModelPrimary,
    geminiModelFallbacks,
    geminiVisionModel,
    corsOrigins,
    appUrl,
  };
}

/**
 * Loads and validates configuration from `process.env` at server startup.
 */
export function loadConfig(): ServerConfig {
  return parseConfig(process.env);
}
