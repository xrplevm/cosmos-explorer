import { type AppError } from '@cosmos-explorer/core';

import { invalidInput, networkError, rateLimit, upstreamError } from './errors';

type GraphQlError = {
  message: string;
};

type GraphQlResponse<TData> = {
  data?: TData;
  errors?: GraphQlError[];
};

export type FetcherOptions = {
  baseUrl: string;
  headers?: HeadersInit;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

export type GraphQlRequest<TVariables> = {
  query: string;
  variables?: TVariables;
  operationName?: string;
};

const DEFAULT_TIMEOUT_MS = 10_000;

export class Fetcher {
  private readonly baseUrl: string;

  private readonly headers: HeadersInit;

  private readonly timeoutMs: number;

  private readonly fetchImpl: typeof fetch;

  constructor(options: FetcherOptions) {
    if (!options.baseUrl) {
      throw invalidInput('Fetcher baseUrl is required');
    }

    this.baseUrl = options.baseUrl;
    this.headers = options.headers ?? {};
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async postJson<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(this.resolveUrl(path), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...this.headers,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw await this.mapHttpError(response);
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      throw this.mapFetchError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async graphql<TData, TVariables = Record<string, never>>(
    request: GraphQlRequest<TVariables>
  ): Promise<TData> {
    if (!request.query) {
      throw invalidInput('GraphQL query is required');
    }

    const response = await this.postJson<
      GraphQlRequest<TVariables>,
      GraphQlResponse<TData>
    >('', request);

    if (response.errors?.length) {
      const message = response.errors.map((error) => error.message).join('; ');
      throw upstreamError(message || 'GraphQL request failed');
    }

    if (!response.data) {
      throw upstreamError('GraphQL response did not include data');
    }

    return response.data;
  }

  private resolveUrl(path: string): string {
    if (!path) {
      return this.baseUrl;
    }

    return new URL(path, this.baseUrl).toString();
  }

  private async mapHttpError(response: Response): Promise<AppError> {
    if (response.status === 429) {
      return rateLimit();
    }

    const bodyText = await response.text();
    const message = bodyText || `Request failed with status ${response.status}`;

    if (response.status === 400) {
      return invalidInput(message);
    }

    return upstreamError(message);
  }

  private mapFetchError(error: unknown): AppError {
    if ((error as { code?: unknown; statusCode?: unknown })?.code) {
      return error as AppError;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return upstreamError(`Request timed out after ${this.timeoutMs}ms`, error);
    }

    if (error instanceof Error) {
      return networkError(error.message, error);
    }

    return networkError();
  }
}

export function createFetcher(options: FetcherOptions): Fetcher {
  return new Fetcher(options);
}
