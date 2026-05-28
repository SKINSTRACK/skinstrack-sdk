import { SkinstracksV2 } from '../src/v2';

async function main() {
  const client = new SkinstracksV2({
    apiKey: process.env.SKINSTRACK_API_KEY || 'your-api-key',
  });

  // Check API status
  console.log('Checking API status...');
  const status = await client.getStatus();
  console.log(`Status: ${status.status}\n`);

  // Search for items
  console.log('Searching for "Dragon Lore"...');
  const searchResults = await client.search('Dragon Lore');
  for (const result of searchResults) {
    console.log(`  ${result.market_hash_name} (${result.rarity})`);
  }

  // Get trending items
  console.log('\nFetching trending items (7d)...');
  const trending = await client.getTrending({
    period: '7d',
    price_min: 10,
    price_max: 1000,
    liquidity: 50,
  });

  console.log('\nTrending Up:');
  for (const item of trending.trending_up.data.slice(0, 5)) {
    console.log(`  ${item.market_hash_name}: +${item.price_change.toFixed(2)}%`);
  }

  console.log('\nDeclining:');
  for (const item of trending.declining.data.slice(0, 5)) {
    console.log(`  ${item.market_hash_name}: ${item.price_change.toFixed(2)}%`);
  }

  // List existing alerts
  console.log('\nFetching your alerts...');
  const alerts = await client.getAlerts({ page: 1, limit: 10 });
  console.log(`Total alerts: ${alerts.total}`);
  for (const alert of alerts.data) {
    console.log(
      `  [${alert.id}] ${alert.market_hash_name}: ${alert.direction} $${alert.price}`
    );
  }

  // Create a new alert
  console.log('\nCreating price alert...');
  const newAlert = await client.createAlert({
    item_slug: 'ak-47-redline-field-tested',
    price: 10.0,
    direction: 'below',
    notification_method: 'email',
    note: 'Buy signal',
    provider: 'csfloat',
  });
  console.log(`Created alert ID: ${newAlert.data.id}`);

  // Delete the alert
  console.log('\nDeleting alert...');
  const deleteResult = await client.deleteAlert(newAlert.data.id);
  console.log(`Deleted: ${deleteResult.success}`);

  // Get Steam inventory
  console.log('\nFetching Steam inventory...');
  try {
    const inventory = await client.getSteamInventory('76561000000000', {
      provider: 'csfloat',
    });
    console.log(`Profile: ${inventory.profile.username}`);
    console.log(`Total items: ${inventory.summary.totalItems}`);
    console.log(`Priced items: ${inventory.summary.pricedItems}`);
    console.log(`Estimated value: $${inventory.summary.estimatedValue}`);
  } catch (error) {
    console.error('Could not fetch inventory:', error instanceof Error ? error.message : error);
  }

  // Get V2 item details (extended fields)
  console.log('\nFetching item details (V2)...');
  const item = await client.getItem('AK-47 | Redline (Field-Tested)');
  console.log(`Name: ${item.market_hash_name}`);
  console.log(`Skinstrack URL: ${item.skinstrack_url}`);
  console.log(`Collection: ${item.collection?.name ?? 'N/A'}`);
  console.log(`Category: ${item.category}`);
  console.log(`Float range: ${item.min_float} - ${item.max_float}`);
  console.log('Price changes:');
  if (item.price_changes) {
    console.log(`  1d: ${item.price_changes['1d']}%`);
    console.log(`  7d: ${item.price_changes['7d']}%`);
    console.log(`  30d: ${item.price_changes['30d']}%`);
  }

  // Get V2 items list cap to 3 for brevity
  console.log('\nFetching items list (V2)...');
  const itemsList = await client.getItems({
    providers: 'csgoempire,csfloat',
    avg: true,
    median: true,
    changes: true,
  });
  for (const item of itemsList.slice(0, 3)) {
    console.log(
      `  ${item.market_hash_name} - Avg: $${item.average?.['7d']}, Median: $${item.median?.['7d']}, 7d change: ${item.price_changes?.['7d']}%`
    );
  }

  // Get V2 stickers list cap to 3 for brevity
  console.log('\nFetching stickers list (V2)...');
  const stickersList = await client.getStickers({
    providers: 'csfloat,waxpeer',
  });
  for (const sticker of stickersList.slice(0, 3)) {
    console.log(
      `  ${sticker.market_hash_name} (${sticker.effect ?? 'no effect'}) - $${sticker.prices[0]?.price ?? 'N/A'} on ${sticker.prices[0]?.provider ?? 'N/A'}`
    );
  }
}

main().catch(console.error);
