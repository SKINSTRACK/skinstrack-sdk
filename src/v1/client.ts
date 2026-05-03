import { HttpClient } from '../shared/http';
import type { ClientConfig } from '../shared/types';
import { encodeItemName, buildQueryString } from '../utils/url';
import type {
  FreeItemsResponse,
  ItemDetail,
  ItemListEntry,
  MarketplaceMappings,
  GetItemsOptions,
} from './types';

const V1_BASE_URL = 'https://api.skinstrack.com/v1';

export class SkinstracksV1 {
  protected readonly http: HttpClient;
  protected readonly baseUrl: string;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl ?? V1_BASE_URL;
    this.http = new HttpClient(
      { ...config, baseUrl: this.baseUrl },
      'v1'
    );
  }

  /**
   * Get free Steam market item prices.
   * Limited to 50 calls/month per API key.
   * Data is filtered to Steam prices only and may be cached up to 4 hours.
   */
  async getFreeItems(): Promise<FreeItemsResponse> {
    return this.http.get<FreeItemsResponse>('/free/items');
  }

  /**
   * Get detailed information and prices for a specific item.
   * Requires a paid plan API key.
   * @param itemName - The market hash name or slug of the item
   */
  async getItem(itemName: string): Promise<ItemDetail> {
    const encodedName = encodeItemName(itemName);
    return this.http.get<ItemDetail>(`/paid/item/${encodedName}`);
  }

  /**
   * Get a list of items with their prices from specified providers.
   * Results can be filtered by provider and market hash names.
   * Requires a paid plan API key.
   */
  async getItems(options?: GetItemsOptions): Promise<ItemListEntry[]> {
    const queryString = buildQueryString({
      providers: options?.providers,
      market_hash_names: options?.market_hash_names,
      avg: options?.avg ? 'true' : undefined,
      median: options?.median ? 'true' : undefined,
    });
    return this.http.get<ItemListEntry[]>(`/paid/items${queryString}`);
  }

  /**
   * Get marketplace ID mappings for cross-referencing items
   * between different trading platforms (Steam, Buff163, Youpin).
   * Requires a paid plan API key.
   */
  async getMarketplaceIds(): Promise<MarketplaceMappings> {
    return this.http.get<MarketplaceMappings>('/paid/marketplace-ids');
  }

  /**
   * Generate a redirect URL to an external marketplace listing.
   * No authentication required for the actual redirect.
   * @param itemName - The market hash name of the item
   * @param marketId - The marketplace identifier (e.g., 'gamerpay', 'csfloat', 'waxpeer')
   */
  getRedirectUrl(itemName: string, marketId: string): string {
    const encodedName = encodeItemName(itemName);
    return `${this.baseUrl}/redirect/${encodedName}/${marketId}`;
  }

  /**
   * Generate a redirect URL to the Buff163 marketplace listing.
   * No authentication required for the actual redirect.
   * @param itemName - The item name or slug
   */
  getBuffRedirectUrl(itemName: string): string {
    const encodedName = encodeItemName(itemName);
    return `${this.baseUrl}/redirectBuff/${encodedName}`;
  }
}
