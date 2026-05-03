import { SkinstracksV1, RateLimitError, UnauthorizedError } from '../src';

async function main() {
  const client = new SkinstracksV1({
    apiKey: process.env.SKINSTRACK_API_KEY || 'your-api-key',
  });

  try {
    // Get free Steam market prices (50 calls/month limit)
    console.log('Fetching free items...');
    const freeItems = await client.getFreeItems();
    console.log(`Found ${freeItems.items.length} items with Steam prices\n`);

    // Show first 5 items
    for (const item of freeItems.items.slice(0, 5)) {
      const steamPrice = item.prices.find((p) => p.provider === 'steam');
      console.log(`${item.market_hash_name}: $${steamPrice?.price ?? 'N/A'}`);
    }

    // Get specific item details (paid endpoint)
    console.log('\nFetching AK-47 | Redline details...');
    const ak47 = await client.getItem('AK-47 | Redline (Field-Tested)');
    console.log(`Name: ${ak47.market_hash_name}`);
    console.log(`Wear: ${ak47.wear_name}`);
    console.log(`Rarity: ${ak47.rarity_name}`);
    console.log(`Collection: ${ak47.collection}`);
    console.log(`Liquidity: ${ak47.liquidity}`);
    console.log('Prices:');
    for (const price of ak47.prices) {
      console.log(`  ${price.provider}: $${price.price} (${price.count} listings)`);
    }

    // Get items with statistics
    console.log('\nFetching items with statistics...');
    const items = await client.getItems({
      providers: 'csfloat,waxpeer',
      avg: true,
      median: true,
    });
    console.log(`Retrieved ${items.length} items`);

    // Get marketplace IDs for cross-referencing
    console.log('\nFetching marketplace ID mappings...');
    const mappings = await client.getMarketplaceIds();
    const sampleSlug = Object.keys(mappings)[0];
    if (sampleSlug) {
      console.log(`Sample mapping for ${sampleSlug}:`);
      console.log(`  Steam ID: ${mappings[sampleSlug].steam_id}`);
      console.log(`  Buff ID: ${mappings[sampleSlug].buff_id}`);
      console.log(`  UUYP ID: ${mappings[sampleSlug].uuyp_id}`);
    }

    // Generate redirect URLs (no API call needed)
    const redirectUrl = client.getRedirectUrl(
      'AK-47 | Redline (Field-Tested)',
      'csfloat'
    );
    console.log(`\nRedirect URL: ${redirectUrl}`);

    const buffUrl = client.getBuffRedirectUrl('ak-47-redline-field-tested');
    console.log(`Buff163 URL: ${buffUrl}`);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.error('Error: Invalid API key');
    } else if (error instanceof RateLimitError) {
      console.error('Error: Rate limit exceeded');
    } else {
      throw error;
    }
  }
}

main();
