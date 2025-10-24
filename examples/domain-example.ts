/**
 * Domain Example - Anonymous Domain Registration
 */

import { checkDomain, purchaseDomain, getOrderStatus, addDNSRecord } from '../src/domains';

const API_URL = 'https://zekta.io';

async function main() {
  console.log('=== Zekta Domain Example ===\n');

  // Step 1: Check domain availability
  console.log('Step 1: Check Domain Availability');
  const check = await checkDomain(API_URL, 'mysite', '.org');
  console.log(`✓ Domain: ${check.domain}`);
  console.log(`  Available: ${check.available}`);
  console.log(`  Price: €${check.priceEUR}`);
  console.log();

  if (!check.available) {
    console.log('Domain not available. Try another name.');
    return;
  }

  // Step 2: Purchase domain
  console.log('Step 2: Purchase Domain');
  const order = await purchaseDomain(API_URL, 'mysite', '.org', 'BTC');
  console.log('✓ Order created!');
  console.log(`  Order ID: ${order.orderId}`);
  console.log(`  Send ${order.amountCrypto} BTC to: ${order.depositAddress}`);
  console.log(`  ⚠️  SAVE THIS SECRET: ${order.domainSecret}`);
  console.log();

  // Step 3: Check order status
  console.log('Step 3: Check Order Status');
  const status = await getOrderStatus(API_URL, order.orderId);
  console.log(`✓ Status: ${status.status}`);
  console.log();

  // Step 4: Add DNS record (after registration)
  if (status.status === 'registered') {
    console.log('Step 4: Add DNS Record');
    const record = await addDNSRecord(
      API_URL,
      'mysite.org',
      order.domainSecret,
      {
        type: 'A',
        name: '@',
        content: '192.0.2.1',
        ttl: 3600
      }
    );
    console.log('✓ DNS record added!');
    console.log(`  Type: ${record.type}`);
    console.log(`  Name: ${record.name}`);
    console.log(`  Content: ${record.content}`);
  } else {
    console.log('Step 4: Waiting for registration...');
  }

  console.log('\n=== Example Complete ===');
}

main().catch(console.error);
