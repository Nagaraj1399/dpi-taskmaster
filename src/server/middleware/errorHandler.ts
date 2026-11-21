import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import type { ApiErrorResponse } from '../../shared/types.js';
import { AppError } from '../errors.js';
import type { Logger } from '../logger.js';

interface ExpressBodyParserError extends Error {
  status?: number;
  type?: string;
}

/**
 * Returns a structured JSON 404 response for unmatched `/api/*` endpoints.
 */
export function apiNotFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `API endpoint ${req.method} ${req.path} not found.`,
    },
  };
  res.status(404).json(body);
}

/**
 * Global Express error handler that logs internal errors server-side
 * without leaking raw `error.message` details on unexpected 500 responses.
 */
export function createGlobalErrorHandler(logger: Logger): ErrorRequestHandler {
  return (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    if (res.headersSent) {
      return;
    }

    if (err instanceof AppError) {
      if (err.statusCode >= 500) {
        logger.error('Handled server application error', {
          code: err.code,
          statusCode: err.statusCode,
          path: req.path,
          method: req.method,
          errorMessage: err.message,
        });
      } else {
        logger.warn('Handled client request error', {
          code: err.code,
          statusCode: err.statusCode,
          path: req.path,
          method: req.method,
        });
      }

      const body: ApiErrorResponse = {
        success: false,
        error: {
          code: err.code,
          message: err.publicMessage,
          ...(err.fieldErrors ? { fieldErrors: err.fieldErrors } : {}),
        },
      };
      res.status(err.statusCode).json(body);
      return;
    }

    const bodyParserErr = err as ExpressBodyParserError | null;
    if (bodyParserErr?.type === 'entity.too.large' || bodyParserErr?.status === 413) {
      logger.warn('Request payload exceeded size limit', {
        path: req.path,
        method: req.method,
      });
      const body: ApiErrorResponse = {
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request payload exceeds the maximum allowed size.',
        },
      };
      res.status(413).json(body);
      return;
    }

    if (err instanceof SyntaxError && bodyParserErr?.status === 400) {
      logger.warn('Malformed JSON body received', {
        path: req.path,
        method: req.method,
      });
      const body: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Malformed JSON request body.',
        },
      };
      res.status(400).json(body);
      return;
    }

    const internalMessage = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    logger.error('Unhandled internal server error', {
      path: req.path,
      method: req.method,
      errorMessage: internalMessage,
      stack,
    });

    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
      },
    };
    res.status(500).json(body);
  };
}
