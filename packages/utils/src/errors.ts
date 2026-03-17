import { AppErrorCode, type AppError } from '@cosmos-explorer/core';

// ─── Options ──────────────────────────────────────────────────────────────────

export interface AppErrorOptions {
  code: AppErrorCode;
  statusCode?: number;
  cause?: Error;
}

// ─── Core factory ─────────────────────────────────────────────────────────────

export function createAppError(message: string, options: AppErrorOptions): AppError {
  const error = new Error(message, { cause: options.cause }) as AppError;
  error.code = options.code;
  error.statusCode = options.statusCode ?? 500;
  const ErrorWithCapture = Error as typeof Error & {
    captureStackTrace?: (target: object, constructor: Function) => void;
  };
  ErrorWithCapture.captureStackTrace?.(error, createAppError);
  return error;
}

// ─── Domain factories ─────────────────────────────────────────────────────────

export function notFound(resource: string, identifier?: string | number): AppError {
  const message = identifier != null
    ? `${resource} not found: ${identifier}`
    : `${resource} not found`;
  return createAppError(message, { code: AppErrorCode.NOT_FOUND, statusCode: 404 });
}

export function networkError(message = 'Network request failed', cause?: Error): AppError {
  return createAppError(message, { code: AppErrorCode.NETWORK_ERROR, statusCode: 503, cause });
}

export function invalidInput(message: string): AppError {
  return createAppError(message, { code: AppErrorCode.INVALID_INPUT, statusCode: 400 });
}

export function rateLimit(): AppError {
  return createAppError('Rate limit exceeded. Please try again later.', {
    code: AppErrorCode.RATE_LIMIT,
    statusCode: 429,
  });
}

export function upstreamError(message: string, cause?: Error): AppError {
  return createAppError(message, { code: AppErrorCode.UPSTREAM_ERROR, statusCode: 502, cause });
}

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'code' in error && 'statusCode' in error;
}

export function hasErrorCode(error: unknown, code: AppErrorCode): error is AppError {
  return isAppError(error) && error.code === code;
}

export function isNotFoundError(error: unknown): boolean {
  return hasErrorCode(error, AppErrorCode.NOT_FOUND);
}

export function isNetworkError(error: unknown): boolean {
  return hasErrorCode(error, AppErrorCode.NETWORK_ERROR);
}

export function isInvalidInputError(error: unknown): boolean {
  return hasErrorCode(error, AppErrorCode.INVALID_INPUT);
}

export function isRateLimitError(error: unknown): boolean {
  return hasErrorCode(error, AppErrorCode.RATE_LIMIT);
}

export function isUpstreamError(error: unknown): boolean {
  return hasErrorCode(error, AppErrorCode.UPSTREAM_ERROR);
}

// ─── Display formatting ───────────────────────────────────────────────────────

const USER_FACING_MESSAGES: Record<AppErrorCode, string> = {
  [AppErrorCode.NOT_FOUND]:      'The requested resource could not be found.',
  [AppErrorCode.NETWORK_ERROR]:  'Unable to connect. Please check your connection and try again.',
  [AppErrorCode.INVALID_INPUT]:  'The input provided is not valid.',
  [AppErrorCode.RATE_LIMIT]:     'Too many requests. Please wait a moment and try again.',
  [AppErrorCode.UPSTREAM_ERROR]: 'The data service is temporarily unavailable.',
  [AppErrorCode.UNKNOWN]:        'An unexpected error occurred.',
};

/**
 * Returns a human-readable message safe to display to users.
 * Never exposes raw error internals.
 */
export function formatErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return USER_FACING_MESSAGES[error.code] ?? USER_FACING_MESSAGES[AppErrorCode.UNKNOWN];
  }
  return USER_FACING_MESSAGES[AppErrorCode.UNKNOWN];
}
