/**
 * Swap Example - Anonymous Cryptocurrency Swaps
 */

import { getCurrencies, getEstimate, createSwap, getSwapStatus } from '../src/swaps';

const API_URL = 'https://zekta.io';

async function main() {
  console.log('=== Zekta Swap Example ===\n');

  // Step 1: Get supported currencies
  console.log('Step 1: Get Supported Currencies');
  const currencies = await getCurrencies(API_URL);
  console.log(`✓ ${currencies.length} cryptocurrencies available`);
  console.log();

  // Step 2: Get swap estimate
  console.log('Step 2: Get Swap Estimate');
  const estimate = await getEstimate(API_URL, 'btc', 'eth', 0.001);
  console.log(`✓ Estimated: ${estimate.estimatedAmount} ETH`);
  console.log(`  Rate: ${estimate.rate}`);
  console.log();

  // Step 3: Create swap
  console.log('Step 3: Create Swap Order');
  const result = await createSwap(
    API_URL,
    'bitcoin',
    'ethereum',
    'btc',
    'eth',
    0.001,
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // Replace with your address
  );

  const order = result.exchange;
  console.log('✓ Swap created!');
  console.log(`  Order ID: ${order.id}`);
  console.log(`  Send ${order.amountFrom} BTC to: ${order.addressFrom}`);
  console.log(`  You'll receive: ${order.expectedAmount} ETH`);
  console.log();

  // Step 4: Check status
  console.log('Step 4: Check Swap Status');
  const status = await getSwapStatus(API_URL, order.id);
  console.log(`✓ Status: ${status.exchange.status}`);
  
  console.log('\n=== Example Complete ===');
}

main().catch(console.error);
