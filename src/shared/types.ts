export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  fetch?: typeof globalThis.fetch;
}

export interface Price {
  price: number;
  count: number;
  volume: number;
  meta: Record<string, unknown>;
  provider: string;
  updated_at: string;
}

export interface ApiError {
  error: string;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

export type WearName =
  | 'Factory New'
  | 'Minimal Wear'
  | 'Field-Tested'
  | 'Well-Worn'
  | 'Battle-Scarred'
  | null;

export type PriceChanges = Record<string, number>;

export type PriceStats = Record<string, number>;
