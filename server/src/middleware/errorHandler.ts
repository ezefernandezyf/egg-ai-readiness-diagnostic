import type { Request, Response, NextFunction } from 'express';

// ── Application error with HTTP status ──────────────────────────
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Zod validation error shape ──────────────────────────────────
export interface ValidationErrorDetail {
  field: string;
  message: string;
}

/**
 * Global error-handling middleware.
 *
 * - AppError → known status code + message
 * - ZodError → 400 with field-level details
 * - Unknown  → 500 with sanitized message
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // AppError (known operational errors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  // Zod validation errors
  if (err.name === 'ZodError' && 'issues' in err) {
    const zodErr = err as unknown as { issues: Array<{ path: (string | number)[]; message: string }> };
    const details: ValidationErrorDetail[] = zodErr.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      error: 'Validation failed',
      statusCode: 400,
      details,
    });
    return;
  }

  // Unknown / unhandled errors
  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    statusCode: 500,
  });
}
