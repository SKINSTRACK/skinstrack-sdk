# skinstrack - CS2 Skin Price API SDK for TypeScript & Node.js

[![npm version](https://img.shields.io/npm/v/skinstrack.svg)](https://www.npmjs.com/package/skinstrack)
[![npm downloads](https://img.shields.io/npm/dm/skinstrack.svg)](https://www.npmjs.com/package/skinstrack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Official TypeScript SDK for the [skinstrack.com](https://skinstrack.com) Counter-Strike 2 (CS2) Skins Price API** - the fastest way to fetch real-time CS2 skin prices, Steam market data, and cross-marketplace pricing from **CSFloat, Buff163, Waxpeer, Skinport, Steam, DMarket, MarketCSGO** and 20+ other CS2 marketplaces through a single REST API.

Built for CS2 trading bots, price-tracking dashboards, Steam inventory valuation tools, and analytics platforms. Get aggregated CS2 skin prices, price history, trending items, price alerts, and Steam inventory value - all with full TypeScript typings and zero runtime dependencies.

> **Why developers choose skinstrack:** 27+ marketplaces in one API, 10-minute price update cycle, 35M+ daily price updates, normalized & validated data, and pricing from just $24.99/month - significantly cheaper than competing CS2 price APIs. [See pricing](https://skinstrack.com/api-pricing)

## Features

- **CS2 skin price data** from 27+ marketplaces (CSFloat, Buff163, Waxpeer, Skinport, Steam Market, DMarket, MarketCSGO)
- **Real-time updates** every 10 minutes - faster than competing CS2 price APIs
- **Steam inventory valuation** - fetch any public Steam inventory and price it instantly
- **Price alerts** with email, Discord, and Telegram notifications
- **Trending CS2 items** - discover rising and falling skins by price movement
- **Historical analytics** - average, median, and percentage price changes across multiple timeframes
- **Sticker pricing** alongside weapon skin prices
- Full **TypeScript** support with comprehensive type definitions
- Supports both **API v1** (core pricing) and **API v2** (full trader toolkit)
- Works in **Node.js**, **browsers**, **Deno**, and **edge runtimes** (Cloudflare Workers, Vercel Edge)
- **Zero runtime dependencies** and tree-shakeable exports
- Custom error classes for easy error handling

## Installation

```bash
npm install skinstrack
```

## Quick Start

### V1 API (Core Pricing)

```typescript
import { SkinstracksV1 } from 'skinstrack';

const client = new SkinstracksV1({ apiKey: 'your-api-key' });

// Get free Steam market prices (50 calls/month)
const freeItems = await client.getFreeItems();
console.log(`Found ${freeItems.items.length} items`);

// Get specific item details (paid)
const ak47 = await client.getItem('AK-47 | Redline (Field-Tested)');
console.log(`Price: $${ak47.prices[0]?.price}`);
```

### V2 API (Full Features)

```typescript
import { SkinstracksV2 } from 'skinstrack/v2';

const client = new SkinstracksV2({ apiKey: 'your-api-key' });

// Search for items
const results = await client.search('Dragon Lore');

// Get trending items
const trending = await client.getTrending({ period: '7d' });

// Create a price alert
await client.createAlert({
  item_slug: 'ak-47-redline-field-tested',
  price: 10.00,
  direction: 'below',
  notification_method: 'email',
});

// Get Steam inventory value
const inventory = await client.getSteamInventory('76561198000000000');
console.log(`Value: $${inventory.summary.estimatedValue}`);
```

## API Reference

### Client Configuration

```typescript
interface ClientConfig {
  apiKey: string;        // Your skinstrack.com API key
  baseUrl?: string;      // Override API base URL (for testing)
  timeout?: number;      // Request timeout in ms (default: 30000)
  fetch?: typeof fetch;  // Custom fetch implementation
}
```

### V1 Methods

| Method | Description | Auth |
|--------|-------------|------|
| `getFreeItems()` | Get Steam market prices (50 calls/month) | API Key |
| `getItem(itemName)` | Get detailed item info and prices | Paid |
| `getItems(options?)` | Get list of items with prices | Paid |
| `getMarketplaceIds()` | Get cross-marketplace ID mappings | Paid |
| `getRedirectUrl(itemName, marketId)` | Generate marketplace redirect URL | None |
| `getBuffRedirectUrl(itemName)` | Generate Buff163 redirect URL | None |

### V2 Methods (includes all V1 methods)

| Method | Description | Auth |
|--------|-------------|------|
| `getStatus()` | Check API status | None |
| `search(query)` | Search items by name (up to 8 results) | API Key |
| `getSteamInventory(steamId, options?)` | Get Steam inventory with prices | Paid |
| `getItem(itemName)` | Get detailed information and prices for a specific item |
| `getItems(options?)` | Get a list of items with their prices from specified providers |
| `getStickers(options?)` | Get a list of stickers with their prices from specified providers | Paid |
| `getAlerts(options?)` | List your price alerts | API Key |
| `createAlert(alert)` | Create a price alert | API Key |
| `deleteAlert(alertId)` | Delete a price alert | API Key |
| `getTrending(options?)` | Get trending items | API Key |
| `getTraderInventory(options?)` | Get saved inventory | API Key |
| `saveTraderInventory(inventory)` | Save inventory (1/hour) | API Key |
| `fetchTraderInventory()` | Import inventory from Steam (1/hour) | API Key |

## Error Handling

```typescript
import { 
  SkinstracksV1, 
  UnauthorizedError, 
  RateLimitError,
  NotFoundError 
} from 'skinstrack';

const client = new SkinstracksV1({ apiKey: 'your-api-key' });

try {
  await client.getItem('AK-47 | Redline (Field-Tested)');
} catch (error) {
  if (error instanceof UnauthorizedError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof NotFoundError) {
    console.error('Item not found');
  } else {
    throw error;
  }
}
```

### Error Classes

| Class | Status Code | Description |
|-------|-------------|-------------|
| `UnauthorizedError` | 401 | Missing or invalid API key |
| `RateLimitError` | 429 | API call limit reached |
| `NotFoundError` | 404 | Resource not found |
| `BadRequestError` | 400 | Invalid request parameters |
| `ServerError` | 5xx | Server error |
| `SkinstracksError` | * | Base error class |

## Examples

### Get Items with Statistics

```typescript
const items = await client.getItems({
  providers: 'csfloat,waxpeer,buff',
  avg: true,
  median: true,
});

for (const item of items) {
  console.log(`${item.market_hash_name}: $${item.prices[0]?.price}`);
  console.log(`  7d avg: $${item.average?.['7d']}`);
}
```

### Filter by Specific Items

```typescript
const items = await client.getItems({
  market_hash_names: 'AK-47 | Redline (Field-Tested),AWP | Dragon Lore (Factory New)',
  providers: 'csfloat',
});
```

### Get Trending with Filters (V2)

```typescript
const trending = await client.getTrending({
  period: '7d',
  price_min: 10,
  price_max: 500,
  liquidity: 50,
});

console.log('Trending up:');
for (const item of trending.trending_up.data.slice(0, 5)) {
  console.log(`  ${item.market_hash_name}: +${item.price_change}%`);
}
```

### Manage Price Alerts (V2)

```typescript
// Create alert
const alert = await client.createAlert({
  item_slug: 'ak-47-redline-field-tested',
  price: 10.00,
  direction: 'below',
  notification_method: 'discord',
  note: 'Buy signal',
  provider: 'csfloat',
});

console.log(`Alert created: ID ${alert.data.id}`);

// List alerts
const alerts = await client.getAlerts({ page: 1, limit: 10 });
console.log(`You have ${alerts.total} active alerts`);

// Delete alert
await client.deleteAlert(alert.data.id);
```

## V1 vs V2 Comparison

| Feature | V1 | V2 |
|---------|----|----|
| Free items | Yes | Yes |
| Item details | Yes | Yes (extended) |
| Items list | Yes | Yes (+ price changes) |
| Marketplace IDs | Yes | Yes |
| Redirects | Yes | Yes |
| **Search** | No | Yes |
| **Steam Inventory** | No | Yes |
| **Price Alerts** | No | Yes |
| **Trending** | No | Yes |
| **Trader Inventory** | No | Yes |

## TypeScript

All types are exported for your convenience:

```typescript
import type { 
  ItemDetail, 
  Price, 
  TrendingItem,
  CreateAlertRequest 
} from 'skinstrack';
```

## Use Cases

The skinstrack SDK is commonly used to build:

- **CS2 trading bots** that monitor cross-marketplace price arbitrage between CSFloat, Buff163, Waxpeer, and Skinport
- **Steam inventory value calculators** - appraise any public Steam inventory in real time
- **CS2 price tracker dashboards** with historical charts and trending skins
- **Price alert services** notifying users on Discord, Telegram, or email when CS2 skins hit target prices
- **Analytics platforms** for tracking skin price movements, liquidity, and market trends
- **Discord bots** that lookup CS2 skin prices on demand
- **Browser extensions** that overlay live prices on Steam market and third-party marketplaces
- **Investment portfolios** for CS2 skin collectors and traders

## FAQ

**Is this an official Counter-Strike 2 SDK?**
No - skinstrack is an independent CS2 skin pricing service. This SDK is the official TypeScript client for the skinstrack.com API. It is not affiliated with Valve Corporation, Steam, or Counter-Strike.

**Which CS2 are supported?**
27+ marketplaces including CSFloat, Buff163, Waxpeer, Skinport, Steam Community Market, DMarket, MarketCSGO, BitSkins, and more. See the [API documentation](https://skinstrack.com/api-docs) for the full list.

**How often are CS2 skin prices updated?**
Prices update every 10 minutes - significantly faster than most competing CS2 price APIs (which often update every 30–60 minutes).

**Is there a free tier?**
Yes - 50 API calls/month free. Paid plans start at $24.99/month. See [pricing](https://skinstrack.com/api-pricing).

## License

MIT - free for commercial and personal use.

## Links

- [API Documentation](https://skinstrack.com/api-docs) - full endpoint reference for the CS2 skin price API
- [Get an API Key](https://skinstrack.com/api-pricing) - free tier and paid plans
- [GitHub Repository](https://github.com/skinstrack/skinstrack-sdk)
- [Report an Issue](https://github.com/skinstrack/skinstrack-sdk/issues)

---

**Keywords:** CS2 skin price API, Counter-Strike 2 SDK, CS2 TypeScript SDK, Steam market price API, CSFloat API, Buff163 API, Waxpeer API, Skinport API, DMarket API, CS2 trading bot SDK, Steam inventory value API, CS2 price tracker, CS2 price alerts, CS2 skin marketplace API, Node.js CS2 SDK.
