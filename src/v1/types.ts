import type { Price, WearName, PriceStats } from '../shared/types';

export interface FreeItemEntry {
  market_hash_name: string;
  slug: string;
  icon_url: string | null;
  type: string | null;
  liquidity: number | null;
  prices: Price[];
}

export interface FreeItemsResponse {
  __WARNING__?: string;
  __WARNING2__?: string;
  __WARNING3__?: string;
  items: FreeItemEntry[];
}

export interface ItemDetail {
  market_hash_name: string;
  slug: string;
  wear_name: WearName;
  rarity_name: string | null;
  icon_url: string | null;
  type: string | null;
  description: string | null;
  collection: string | null;
  steam_market_url: string | null;
  liquidity: number | null;
  quantity: number | null;
  prices: Price[];
}

export interface ItemListEntry {
  market_hash_name: string;
  slug: string;
  icon_url: string | null;
  type: string | null;
  steam_market_url?: string | null;
  quantity: number | null;
  prices: Price[];
  average?: PriceStats;
  median?: PriceStats;
}

export interface MarketplaceIdEntry {
  steam_id?: string;
  buff_id?: string;
  uuyp_id?: string;
}

export type MarketplaceMappings = Record<string, MarketplaceIdEntry>;

export interface GetItemsOptions {
  providers?: string;
  market_hash_names?: string;
  avg?: boolean;
  median?: boolean;
}
