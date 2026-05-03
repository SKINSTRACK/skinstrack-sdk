import {
  SkinstracksError,
  UnauthorizedError,
  RateLimitError,
  NotFoundError,
  BadRequestError,
  ServerError,
} from './errors';
import type { ClientConfig, ApiError } from './types';

const DEFAULT_TIMEOUT = 30000;

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly fetchFn: typeof globalThis.fetch;

  constructor(config: ClientConfig, apiVersion: 'v1' | 'v2') {
    this.apiKey = config.apiKey;
    this.baseUrl =
      config.baseUrl ?? `https://api.skinstrack.com/${apiVersion}`;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.fetchFn = config.fetch ?? globalThis.fetch;
  }

  async get<T>(path: string, options?: { auth?: boolean }): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: { auth?: boolean }
  ): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async delete<T>(path: string, options?: { auth?: boolean }): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: { auth?: boolean }
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options?.auth !== false) {
      headers['X-API-KEY'] = this.apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await this.fetchFn(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleError(response);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof SkinstracksError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new SkinstracksError(
          `Request timeout after ${this.timeout}ms`,
          408
        );
      }

      throw new SkinstracksError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  private async handleError(response: Response): Promise<never> {
    let errorMessage: string;

    try {
      const data = (await response.json()) as ApiError | { message?: string };
      errorMessage =
        'error' in data
          ? data.error
          : data.message ?? response.statusText;
    } catch {
      errorMessage = response.statusText;
    }

    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage);
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 429:
        throw new RateLimitError(errorMessage);
      case 500:
      case 502:
      case 503:
        throw new ServerError(errorMessage);
      default:
        throw new SkinstracksError(errorMessage, response.status);
    }
  }
}
