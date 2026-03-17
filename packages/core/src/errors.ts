export enum AppErrorCode {
  NOT_FOUND      = 'NOT_FOUND',
  NETWORK_ERROR  = 'NETWORK_ERROR',
  INVALID_INPUT  = 'INVALID_INPUT',
  RATE_LIMIT     = 'RATE_LIMIT',
  UPSTREAM_ERROR = 'UPSTREAM_ERROR',
  UNKNOWN        = 'UNKNOWN',
}

export type AppError = Error & {
  code: AppErrorCode;
  statusCode: number;
};
