// Main entry point - exports both V1 and V2 clients
export { SkinstracksV1 } from './v1/client';
export { SkinstracksV2 } from './v2/client';

// Error classes
export {
  SkinstracksError,
  UnauthorizedError,
  RateLimitError,
  NotFoundError,
  BadRequestError,
  ServerError,
} from './shared/errors';

// Shared types
export type {
  ClientConfig,
  Price,
  ApiError,
  SuccessResponse,
  WearName,
  PriceChanges,
  PriceStats,
} from './shared/types';

// V1 types
export type {
  FreeItemEntry,
  FreeItemsResponse,
  ItemDetail,
  ItemListEntry,
  MarketplaceIdEntry,
  MarketplaceMappings,
  GetItemsOptions,
} from './v1/types';

// V2 types
export type {
  StatusResponse,
  SearchResult,
  SearchResponse,
  CollectionRef,
  ContainerRef,
  ItemDetailV2,
  ItemListEntryV2,
  GetItemsV2Options,
  StickerListEntryV2,
  GetStickersV2Options,
  InventoryProfile,
  InventorySummary,
  InventoryItemWithPrice,
  InventoryResponse,
  GetInventoryOptions,
  AlertDirection,
  NotificationMethod,
  AlertEntry,
  AlertListResponse,
  AlertResponse,
  CreateAlertRequest,
  GetAlertsOptions,
  TrendingItem,
  TrendingCategory,
  TrendingResponse,
  TrendingPeriod,
  GetTrendingOptions,
  InventoryItem,
  TraderInventoryData,
  TraderInventoryResponse,
  SaveInventoryResponse,
  GetTraderInventoryOptions,
  SuccessErrorResponse,
} from './v2/types';
