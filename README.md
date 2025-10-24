# Zekta SDK

JavaScript SDK for building privacy-first blockchain applications with zero-knowledge proofs.

## What is Zekta?

Zekta enables completely anonymous blockchain transactions using zero-knowledge proofs. Users can prove they're authorized to perform actions without revealing their wallet addresses or transaction history.

**Key Features:**
- Anonymous cryptocurrency swaps (BTC, ETH, SOL, USDT, etc.)
- Private gift card purchases (Amazon, Google Play)
- Anonymous domain registration with DNS management
- ZK Twitter: Post anonymously to @zektabro account
- Zero-knowledge identity system (Semaphore Protocol)
- No wallet addresses stored, ever
- No API keys required for core functionality

## Installation

```bash
npm install @semaphore-protocol/identity @semaphore-protocol/group @semaphore-protocol/proof
```

Then copy the SDK files to your project:
```
src/
  swaps.ts
  giftcards.ts
  domains.ts
  zktwitter.ts
  identity.ts
```

## Quick Start

### 1. Anonymous Crypto Swap

```typescript
import { createSwap, getSwapStatus } from './swaps';

const API_URL = 'https://zekta.io';

// Create swap
const result = await createSwap(
  API_URL,
  'bitcoin',      // From Bitcoin network
  'ethereum',     // To Ethereum network
  'btc',          // BTC currency
  'eth',          // ETH currency
  0.001,          // Amount
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'  // Your ETH address
);

const order = result.exchange;
console.log(`Send ${0.001} BTC to: ${order.addressFrom}`);
console.log(`You'll receive: ${order.expectedAmount} ETH`);

// Track status
const statusResult = await getSwapStatus(API_URL, order.id);
console.log('Status:', statusResult.exchange.status);
```

### 2. Buy Gift Card Anonymously

```typescript
import { getCatalog, createOrder, retrieveCard } from './giftcards';

// Browse catalog
const catalog = await getCatalog(API_URL);

// Create order
const order = await createOrder(
  API_URL,
  'amazon_us',    // Gift card type
  25,             // $25 denomination
  'SOL'           // Pay with Solana
);

console.log(`Send ${order.amountCrypto} SOL to: ${order.depositAddress}`);
console.log('⚠️  SAVE THIS SECRET:', order.giftCardSecret);

// After payment confirmed, retrieve card
const cards = await retrieveCard(API_URL, order.giftCardSecret);
console.log('Card Number:', cards[0].cardNumber);
console.log('PIN:', cards[0].cardPin);
```

### 3. Purchase Domain Anonymously

```typescript
import { checkDomain, purchaseDomain, addDNSRecord } from './domains';

// Check availability
const check = await checkDomain(API_URL, 'mysite', '.org');
console.log('Available:', check.available);
console.log('Price:', check.priceEUR, 'EUR');

// Purchase domain
const order = await purchaseDomain(API_URL, 'mysite', '.org', 'BTC');
console.log(`Send ${order.amountCrypto} BTC to: ${order.depositAddress}`);
console.log('⚠️  SAVE THIS SECRET:', order.domainSecret);

// Add DNS record (after registration)
await addDNSRecord(API_URL, 'mysite.org', order.domainSecret, {
  type: 'A',
  name: '@',
  content: '192.0.2.1',
  ttl: 3600
});
```

### 4. Post Anonymously to Twitter

```typescript
import { generateIdentity } from './identity';
import { createSession, postTweet } from './zktwitter';

// Generate or restore your identity
const identity = generateIdentity();
console.log('Save this secret:', identity.secret);

// Get group members (you need to fetch this from your backend/contract)
const groupMembers = ["commitment1", "commitment2"];

// Create session
const session = await createSession(
  API_URL,
  identity.secret,
  groupMembers
);

// Post tweet
const result = await postTweet(
  API_URL,
  session.zkSession,
  "Hello from ZK Twitter! This tweet is posted anonymously using zero-knowledge proofs."
);

console.log('Tweet URL:', result.tweetUrl);
console.log('Tweet ID:', result.tweetId);
```

## Links

- **Website**: [zekta.io](https://zekta.io)
- **Documentation**: [zekta.io/developer](https://zekta.io/developer)
- **SDK Playground**: [zekta.io/sdk](https://zekta.io/sdk)
- **Twitter**: [@zektaio](https://x.com/zektaio)

## License

MIT License

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Reach out on Twitter: [@zektaio](https://x.com/zektaio)

---

**Built with privacy-first principles using Semaphore Protocol.**
