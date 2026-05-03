import { HttpClient } from '../shared/http';
import type { ClientConfig, SuccessResponse } from '../shared/types';
import { encodeItemName, buildQueryString } from '../utils/url';
import type {
  StatusResponse,
  SearchResult,
  SearchResponse,
  ItemDetailV2,
  ItemListEntryV2,
  GetItemsV2Options,
  InventoryResponse,
  GetInventoryOptions,
  AlertListResponse,
  AlertResponse,
  CreateAlertRequest,
  GetAlertsOptions,
  TrendingResponse,
  GetTrendingOptions,
  TraderInventoryResponse,
  SaveInventoryResponse,
  InventoryItem,
  GetTraderInventoryOptions,
  SuccessErrorResponse,
} from './types';
import type {
  FreeItemsResponse,
  MarketplaceMappings,
} from '../v1/types';

const V2_BASE_URL = 'https://api.skinstrack.com/v2';

export class SkinstracksV2 {
  protected readonly http: HttpClient;
  protected readonly baseUrl: string;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl ?? V2_BASE_URL;
    this.http = new HttpClient(
      { ...config, baseUrl: this.baseUrl },
      'v2'
    );
  }

  /**
   * Check API v2 status.
   * No authentication required.
   */
  async getStatus(): Promise<StatusResponse> {
    return this.http.get<StatusResponse>('/', { auth: false });
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
   * Search for CS2 items by name or slug.
   * Returns up to 8 best-matching results.
   * Requires a valid API key (free or paid plan).
   * @param query - Search query string (minimum 2 characters)
   */
  async search(query: string): Promise<SearchResult[]> {
    const queryString = buildQueryString({ q: query });
    const response = await this.http.get<SearchResponse>(
      `/free/search${queryString}`
    );
    return response.results;
  }

  /**
   * Get detailed information and prices for a specific item.
   * Includes v2 extended fields: skinstrack_url, collection object,
   * containers, category, float range, price_changes, average, and median.
   * Requires a paid plan API key.
   * @param itemName - The market hash name or slug of the item
   */
  async getItem(itemName: string): Promise<ItemDetailV2> {
    const encodedName = encodeItemName(itemName);
    return this.http.get<ItemDetailV2>(`/paid/item/${encodedName}`);
  }

  /**
   * Get a list of items with their prices from specified providers.
   * V2 adds support for price_changes via the `changes` option.
   * Requires a paid plan API key.
   */
  async getItems(options?: GetItemsV2Options): Promise<ItemListEntryV2[]> {
    const queryString = buildQueryString({
      providers: options?.providers,
      market_hash_names: options?.market_hash_names,
      avg: options?.avg ? 'true' : undefined,
      median: options?.median ? 'true' : undefined,
      changes: options?.changes ? 'true' : undefined,
    });
    return this.http.get<ItemListEntryV2[]>(`/paid/items${queryString}`);
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
   * Get a Steam user's CS2 inventory with pricing.
   * The Steam profile and inventory must be public.
   * Results are cached for 5 minutes.
   * Requires a paid plan API key.
   * @param steamId - Steam64 ID, vanity URL, or full Steam profile URL
   */
  async getSteamInventory(
    steamId: string,
    options?: GetInventoryOptions
  ): Promise<InventoryResponse> {
    const encodedId = encodeItemName(steamId);
    const queryString = buildQueryString({ provider: options?.provider });
    return this.http.get<InventoryResponse>(
      `/paid/inventory/${encodedId}${queryString}`
    );
  }

  /**
   * List the authenticated user's price alerts.
   * Requires a valid API key.
   */
  async getAlerts(options?: GetAlertsOptions): Promise<AlertListResponse> {
    const queryString = buildQueryString({
      page: options?.page,
      limit: options?.limit,
    });
    return this.http.get<AlertListResponse>(`/trader/alerts${queryString}`);
  }

  /**
   * Create a new price alert for an item.
   * The alert triggers when the item's price goes above or below the threshold.
   * Active alert count is capped by the user's plan.
   * Requires a valid API key.
   */
  async createAlert(alert: CreateAlertRequest): Promise<AlertResponse> {
    return this.http.post<AlertResponse>('/trader/alerts', alert);
  }

  /**
   * Delete a specific price alert by ID.
   * Only the owner of the alert can delete it.
   * Requires a valid API key.
   * @param alertId - The ID of the alert to delete
   */
  async deleteAlert(alertId: string | number): Promise<SuccessResponse> {
    return this.http.delete<SuccessErrorResponse>(
      `/trader/alerts/${alertId}`
    );
  }

  /**
   * Get trending items (up and declining in price).
   * Returns up to 40 items per direction sorted by price change percentage.
   * Requires a valid API key.
   */
  async getTrending(options?: GetTrendingOptions): Promise<TrendingResponse> {
    const queryString = buildQueryString({
      period: options?.period,
      liquidity: options?.liquidity,
      price_min: options?.price_min,
      price_max: options?.price_max,
    });
    return this.http.get<TrendingResponse>(`/trader/trending${queryString}`);
  }

  /**
   * Get the user's saved inventory with current prices.
   * Supports pagination (up to 1000 items per page).
   * Requires a valid API key.
   */
  async getTraderInventory(
    options?: GetTraderInventoryOptions
  ): Promise<TraderInventoryResponse> {
    const queryString = buildQueryString({
      provider: options?.provider,
      page: options?.page,
    });
    return this.http.get<TraderInventoryResponse>(
      `/trader/inventory${queryString}`
    );
  }

  /**
   * Save a user-supplied inventory list.
   * Rate limited to once every 60 minutes.
   * The maximum number of items is determined by the user's plan.
   * Requires a valid API key.
   */
  async saveTraderInventory(
    inventory: InventoryItem[]
  ): Promise<SaveInventoryResponse> {
    return this.http.post<SaveInventoryResponse>('/trader/inventory/save', {
      inventory,
    });
  }

  /**
   * Import inventory from Steam and save it automatically.
   * The Steam account must be linked to the API key.
   * Rate limited to once every 60 minutes.
   * Requires a valid API key.
   */
  async fetchTraderInventory(): Promise<SaveInventoryResponse> {
    return this.http.post<SaveInventoryResponse>('/trader/inventory/fetch');
  }

  /**
   * Generate a redirect URL to an external marketplace listing.
   * Note: This uses the v1 redirect endpoint.
   * @param itemName - The market hash name of the item
   * @param marketId - The marketplace identifier
   */
  getRedirectUrl(itemName: string, marketId: string): string {
    const encodedName = encodeItemName(itemName);
    return `https://api.skinstrack.com/v1/redirect/${encodedName}/${marketId}`;
  }

  /**
   * Generate a redirect URL to the Buff163 marketplace listing.
   * Note: This uses the v1 redirect endpoint.
   * @param itemName - The item name or slug
   */
  getBuffRedirectUrl(itemName: string): string {
    const encodedName = encodeItemName(itemName);
    return `https://api.skinstrack.com/v1/redirectBuff/${encodedName}`;
  }
}
