import type { Price, WearName, PriceChanges, PriceStats } from '../shared/types';

export interface SearchResult {
  market_hash_name: string;
  slug: string;
  rarity: string | null;
  icon_url: string | null;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface CollectionRef {
  name: string;
  slug: string;
}

export interface ContainerRef {
  name: string;
  slug: string;
  icon_url: string | null;
}

export interface ItemDetailV2 {
  market_hash_name: string;
  slug: string;
  wear_name: WearName;
  rarity_name: string | null;
  icon_url: string | null;
  type: string | null;
  description: string | null;
  steam_market_url: string | null;
  skinstrack_url: string;
  collection: CollectionRef | null;
  containers: ContainerRef[];
  category: string | null;
  min_float: number | null;
  max_float: number | null;
  weapon_id: string | null;
  team_id: string | null;
  liquidity: number | null;
  quantity: number | null;
  price_changes: PriceChanges | null;
  average: PriceStats | null;
  median: PriceStats | null;
  prices: Price[];
}

export interface ItemListEntryV2 {
  market_hash_name: string;
  slug: string;
  icon_url: string | null;
  type: string | null;
  liquidity: number | null;
  quantity: number | null;
  prices: Price[];
  average?: PriceStats;
  median?: PriceStats;
  price_changes?: PriceChanges;
}

export interface GetItemsV2Options {
  providers?: string;
  market_hash_names?: string;
  avg?: boolean;
  median?: boolean;
  changes?: boolean;
}

export interface InventoryProfile {
  steam64id: string;
  username: string;
  avatar: string;
  profileUrl: string;
}

export interface InventorySummary {
  totalItems: number;
  pricedItems: number;
  estimatedValue: number;
}

export interface InventoryItemWithPrice {
  market_hash_name: string;
  slug: string | null;
  icon_url: string | null;
  wear: string | null;
  wear_short: string | null;
  price: number;
  count: number;
  rarity_name: string;
  type: string;
  updated_at: string | null;
}

export interface InventoryResponse {
  profile: InventoryProfile;
  provider: string;
  summary: InventorySummary;
  items: InventoryItemWithPrice[];
}

export interface GetInventoryOptions {
  provider?: string;
}

export type AlertDirection = 'above' | 'below';
export type NotificationMethod = 'discord' | 'email' | 'telegram' | 'both';

export interface AlertEntry {
  id: number;
  item_slug: string;
  market_hash_name: string;
  price: number;
  direction: AlertDirection;
  notification_method: NotificationMethod;
  note: string | null;
  is_active: boolean;
  provider: string;
}

export interface AlertListResponse {
  success: boolean;
  data: AlertEntry[];
  page: number;
  pages: number;
  total: number;
}

export interface AlertResponse {
  success: boolean;
  data: AlertEntry;
}

export interface CreateAlertRequest {
  item_slug: string;
  price: number;
  direction: AlertDirection;
  notification_method: NotificationMethod;
  note?: string;
  provider?: string;
}

export interface GetAlertsOptions {
  page?: number;
  limit?: number;
}

export interface TrendingItem {
  market_hash_name: string;
  slug: string;
  rarity_name: string | null;
  collection: string | null;
  category: string | null;
  liquidity: number | null;
  quantity: number;
  price: number;
  price_change: number;
  price_changes: PriceChanges;
}

export interface TrendingCategory {
  data: TrendingItem[];
  total: number;
  pages: number;
}

export interface TrendingResponse {
  success: boolean;
  page: number;
  period: string;
  trending_up: TrendingCategory;
  declining: TrendingCategory;
}

export type TrendingPeriod = '1d' | '7d' | '14d' | '30d' | '60d' | '90d';

export interface GetTrendingOptions {
  period?: TrendingPeriod;
  liquidity?: number;
  price_min?: number;
  price_max?: number;
}

export interface InventoryItem {
  market_hash_name: string;
  count?: number;
}

export interface TraderInventoryData {
  total_value: number;
  items: InventoryItemWithPrice[];
  providers: string[];
  total?: number;
}

export interface TraderInventoryResponse {
  success: boolean;
  data: TraderInventoryData;
}

export interface SaveInventoryResponse {
  success: boolean;
  data: TraderInventoryData;
}

export interface GetTraderInventoryOptions {
  provider?: string;
  page?: number;
}

export interface StatusResponse {
  status: string;
}

export interface SuccessErrorResponse {
  success: boolean;
  message?: string;
}
