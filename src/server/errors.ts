/** Base HTTP-mapped error used across server services and middleware. */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly publicMessage: string;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(options: {
    statusCode: number;
    code: string;
    publicMessage: string;
    internalMessage?: string;
    fieldErrors?: Record<string, string[]>;
  }) {
    super(options.internalMessage ?? options.publicMessage);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.publicMessage = options.publicMessage;
    this.fieldErrors = options.fieldErrors;
  }
}

/** HTTP 400 error for invalid request payloads or country codes. */
export class ValidationError extends AppError {
  constructor(
    publicMessage: string,
    fieldErrors?: Record<string, string[]>,
    code = 'VALIDATION_ERROR'
  ) {
    super({
      statusCode: 400,
      code,
      publicMessage,
      fieldErrors,
    });
  }
}

/** HTTP 404 error for missing resources or unknown API routes. */
export class NotFoundError extends AppError {
  constructor(publicMessage = 'Resource not found') {
    super({
      statusCode: 404,
      code: 'NOT_FOUND',
      publicMessage,
    });
  }
}

/** HTTP 422 error when dataset verification checks fail and cannot be persisted. */
export class UnprocessableEntityError extends AppError {
  constructor(publicMessage: string, internalMessage?: string) {
    super({
      statusCode: 422,
      code: 'UNPROCESSABLE_ENTITY',
      publicMessage,
      internalMessage,
    });
  }
}

/** HTTP 502 error when an upstream AI or external service call fails. */
export class UpstreamAiError extends AppError {
  constructor(
    publicMessage = 'Upstream AI service failed to produce a valid response.',
    internalMessage?: string
  ) {
    super({
      statusCode: 502,
      code: 'UPSTREAM_AI_ERROR',
      publicMessage,
      internalMessage,
    });
  }
}

/** HTTP 503 error when a required service (such as Gemini AI) is not configured or unavailable. */
export class ServiceUnavailableError extends AppError {
  constructor(
    publicMessage = 'AI service is unavailable. Ensure GEMINI_API_KEY is configured.',
    internalMessage?: string
  ) {
    super({
      statusCode: 503,
      code: 'AI_SERVICE_UNAVAILABLE',
      publicMessage,
      internalMessage,
    });
  }
}
