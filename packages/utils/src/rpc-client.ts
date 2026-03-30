import { networkError, rateLimit, upstreamError } from './errors';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RpcClientOptions {
  /** Base URL for the RPC endpoint. */
  baseUrl: string;
  /** Default timeout per request in milliseconds. */
  timeoutMs?: number;
  /** Maximum number of retry attempts on transient failures. */
  maxRetries?: number;
  /** Base delay between retries in milliseconds (exponential backoff). */
  retryBaseMs?: number;
  /** Maximum concurrent in-flight requests. */
  maxConcurrent?: number;
  /** Custom fetch implementation (useful for testing). */
  fetchImpl?: typeof fetch;
  /** Default headers sent with every request. */
  headers?: Record<string, string>;
}

interface QueuedRequest {
  execute: () => Promise<void>;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_BASE_MS = 500;
const DEFAULT_MAX_CONCURRENT = 6;

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

// ─── RpcClient ───────────────────────────────────────────────────────────────

export class RpcClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly retryBaseMs: number;
  private readonly maxConcurrent: number;
  private readonly fetchImpl: typeof fetch;
  private readonly headers: Record<string, string>;

  private inflight = 0;
  private readonly queue: QueuedRequest[] = [];
  private readonly pending = new Map<string, Promise<unknown>>();

  constructor(options: RpcClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryBaseMs = options.retryBaseMs ?? DEFAULT_RETRY_BASE_MS;
    this.maxConcurrent = options.maxConcurrent ?? DEFAULT_MAX_CONCURRENT;
    this.fetchImpl = options.fetchImpl ?? ((input, init) => globalThis.fetch(input, init));
    this.headers = options.headers ?? {};
  }

  /** GET request with in-flight deduplication. */
  async get<T>(path: string): Promise<T> {
    const url = this.resolveUrl(path);
    const key = `GET:${url}`;
    return this.dedup(key, () => this.executeWithRetry(() => this.doFetch<T>(url, 'GET')));
  }

  /** POST request (respects concurrency limits). */
  async post<T>(path: string, body: unknown): Promise<T> {
    return this.enqueue(() => this.executeWithRetry(() => this.doFetch<T>(this.resolveUrl(path), 'POST', body)));
  }

  // ─── In-flight deduplication ─────────────────────────────────────────────

  private async dedup<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key) as Promise<T> | undefined;
    if (existing) return existing;

    const promise = this.enqueue(fn).then((result) => {
      this.pending.delete(key);
      return result;
    }).catch((error) => {
      this.pending.delete(key);
      throw error;
    });

    this.pending.set(key, promise);
    return promise;
  }

  // ─── Concurrency limiter ─────────────────────────────────────────────────

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const execute = async () => {
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        } finally {
          this.inflight--;
          this.drain();
        }
      };

      if (this.inflight < this.maxConcurrent) {
        this.inflight++;
        void execute();
      } else {
        this.queue.push({ execute });
      }
    });
  }

  private drain(): void {
    while (this.inflight < this.maxConcurrent && this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        this.inflight++;
        void next.execute();
      }
    }
  }

  // ─── Retry with exponential backoff ──────────────────────────────────────

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const isRetryable =
          error instanceof Error &&
          'statusCode' in error &&
          RETRYABLE_STATUS_CODES.has((error as { statusCode: number }).statusCode);

        if (!isRetryable || attempt === this.maxRetries) break;

        const delay = this.retryBaseMs * Math.pow(2, attempt) + Math.random() * 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // ─── Low-level fetch ─────────────────────────────────────────────────────

  private async doFetch<T>(url: string, method: 'GET' | 'POST', body?: unknown): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(url, {
        method,
        headers: {
          ...this.headers,
          ...(body != null ? { 'content-type': 'application/json' } : {}),
        },
        body: body != null ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (response.status === 429) throw rateLimit();

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw upstreamError(text || `RPC request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error && 'code' in error && 'statusCode' in error) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw upstreamError(`RPC request timed out after ${this.timeoutMs}ms`);
      }
      if (error instanceof Error) throw networkError(error.message, error);
      throw networkError();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private resolveUrl(path: string): string {
    return path.length === 0 ? this.baseUrl : `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }
}

export function createRpcClient(options: RpcClientOptions): RpcClient {
  return new RpcClient(options);
}
