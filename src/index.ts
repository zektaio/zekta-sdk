// Zekta SDK - JavaScript SDK for privacy-first blockchain applications
// https://github.com/zektaio/zekta-sdk

export * from './swaps';
export * from './identity';

// Gift Cards
export { 
  getCatalog,
  createOrder as createGiftCardOrder,
  getOrderStatus as getGiftCardOrderStatus,
  retrieveCard,
  getMyCards
} from './giftcards';

// Domains  
export {
  checkDomain,
  purchaseDomain,
  getOrderStatus as getDomainOrderStatus,
  getMyDomains,
  getDNSRecords,
  addDNSRecord,
  updateDNSRecord,
  deleteDNSRecord
} from './domains';

// ZK Twitter
export * from './zktwitter';
