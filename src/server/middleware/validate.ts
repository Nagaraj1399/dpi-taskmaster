import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { hasForbiddenObjectKeys } from '../../shared/schemas.js';
import { ValidationError } from '../errors.js';

/**
 * Formats Zod validation issues into a field-keyed error dictionary.
 */
function formatZodFieldErrors(issues: z.ZodIssue[]): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_root';
    const existing = fieldErrors[key] ?? [];
    existing.push(issue.message);
    fieldErrors[key] = existing;
  }
  return fieldErrors;
}

/**
 * Express middleware that validates `req.body` against a Zod schema,
 * rejecting prototype-pollution keys and returning HTTP 400 with field errors on failure.
 */
export function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (hasForbiddenObjectKeys(req.body)) {
      next(
        new ValidationError(
          'Request payload contains forbidden object keys.',
          { _root: ['Forbidden keys (__proto__, constructor, prototype) are not permitted'] },
          'FORBIDDEN_KEYS'
        )
      );
      return;
    }

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(
        new ValidationError('Request validation failed.', formatZodFieldErrors(parsed.error.issues))
      );
      return;
    }

    req.body = parsed.data;
    next();
  };
}
