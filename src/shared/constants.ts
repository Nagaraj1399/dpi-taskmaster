/** Allowlisted BRICS+ member and partner country codes. */
export const BRICS_COUNTRY_CODES = [
  'BR',
  'RU',
  'IN',
  'CN',
  'ZA',
  'EG',
  'ET',
  'IR',
  'SA',
  'AE',
  'ID',
] as const;

/** Object property names rejected across all JSON/API inputs to prevent prototype pollution. */
export const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Minimum normalized percentage or index score. */
export const SCORE_MIN = 0;

/** Maximum normalized percentage or index score. */
export const SCORE_MAX = 100;

/** Minimum calculated infrastructure gap severity score. */
export const GAP_SCORE_FLOOR = 15;

/** Maximum calculated infrastructure gap severity score. */
export const GAP_SCORE_CEILING = 98;

/** Base offset added after weighting the infrastructure deficit. */
export const GAP_SCORE_BASE_OFFSET = 12;

/** Multiplier converting primary health centers per 10k residents to a 0-100 baseline score. */
export const HEALTH_CENTERS_SCORE_MULTIPLIER = 25;

/** Maximum allowed primary health centers per 10k residents in baseline dataset validation. */
export const HEALTH_CENTERS_MAX_PER_10K = 50;

/** Urgency multipliers applied when computing deterministic infrastructure gap severity. */
export const URGENCY_MULTIPLIERS = {
  Emergency: 1.4,
  High: 1.2,
  Medium: 1.0,
  Low: 0.85,
} as const;

/** Maximum number of requests allowed per rate-limit window on AI endpoints. */
export const AI_RATE_LIMIT_MAX_REQUESTS = 20;

/** Sliding window duration in milliseconds for AI endpoint rate limiting. */
export const AI_RATE_LIMIT_WINDOW_MS = 60_000;

/** Default Express JSON body size limit for standard API endpoints. */
export const DEFAULT_JSON_BODY_LIMIT = '100kb';

/** Elevated Express JSON body size limit for base64 image uploads on the vision endpoint. */
export const VISION_JSON_BODY_LIMIT = '5mb';

/** Timeout in milliseconds when probing an external government open-data API URL. */
export const EXTERNAL_API_PROBE_TIMEOUT_MS = 5_000;

/** Timeout in milliseconds when fetching an allowlisted sample photo for Gemini Vision analysis. */
export const PHOTO_FETCH_TIMEOUT_MS = 8_000;

/** Maximum photo payload size in bytes accepted when fetching an allowlisted photo URL. */
export const MAX_FETCHED_PHOTO_BYTES = 4 * 1024 * 1024;

/** Allowlisted external image hostnames permitted for server-side photo fetching. */
export const ALLOWED_PHOTO_HOSTS = new Set(['images.unsplash.com']);

/** Default server port used when PORT is not specified in the environment. */
export const DEFAULT_SERVER_PORT = 3000;

/** Default delay in milliseconds before clearing temporary clipboard/toast notifications. */
export const UI_NOTIFICATION_TIMEOUT_MS = 2_500;

/** Short delay in milliseconds before closing the Dataset Studio modal after a successful save. */
export const MODAL_SAVE_CLOSE_DELAY_MS = 900;

/** Maximum allowed voice recording duration in seconds for local fallback mode. */
export const VOICE_FALLBACK_MAX_SECONDS = 6;
