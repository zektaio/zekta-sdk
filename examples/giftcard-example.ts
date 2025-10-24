/**
 * Gift Card Example - Anonymous Gift Card Purchases
 */

import { getCatalog, createOrder, getOrderStatus, retrieveCard } from '../src/giftcards';

const API_URL = 'https://zekta.io';

async function main() {
  console.log('=== Zekta Gift Card Example ===\n');

  // Step 1: Browse catalog
  console.log('Step 1: Browse Gift Card Catalog');
  const catalog = await getCatalog(API_URL);
  console.log(`✓ ${catalog.length} gift cards available`);
  catalog.slice(0, 3).forEach(item => {
    console.log(`  - ${item.name}: $${item.denominations.join(', $')}`);
  });
  console.log();

  // Step 2: Create order
  console.log('Step 2: Create Gift Card Order');
  const order = await createOrder(API_URL, 'amazon_us', 25, 'SOL');
  console.log('✓ Order created!');
  console.log(`  Order ID: ${order.orderId}`);
  console.log(`  Send ${order.amountCrypto} SOL to: ${order.depositAddress}`);
  console.log(`  ⚠️  SAVE THIS SECRET: ${order.giftCardSecret}`);
  console.log();

  // Step 3: Check order status
  console.log('Step 3: Check Order Status');
  const status = await getOrderStatus(API_URL, order.orderId);
  console.log(`✓ Status: ${status.status}`);
  console.log();

  // Step 4: Retrieve card (after payment confirmed)
  if (status.status === 'delivered') {
    console.log('Step 4: Retrieve Gift Card');
    const cards = await retrieveCard(API_URL, order.giftCardSecret);
    console.log('✓ Gift card retrieved!');
    console.log(`  Card Number: ${cards[0].cardNumber}`);
    console.log(`  PIN: ${cards[0].cardPin}`);
    console.log(`  Instructions: ${cards[0].redeemInstructions}`);
  } else {
    console.log('Step 4: Waiting for payment...');
  }

  console.log('\n=== Example Complete ===');
}

main().catch(console.error);
