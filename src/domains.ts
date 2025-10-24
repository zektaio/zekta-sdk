// Zekta SDK - Anonymous Domain Management

import { Identity } from "@semaphore-protocol/identity";

export interface DomainAvailability {
  available: boolean;
  domain: string;
  priceEUR: number;
}

export interface DomainOrder {
  orderId: string;
  domainName: string;
  currency: string;
  amountCrypto: string;
  depositAddress: string;
  status: string;
  domainSecret: string;
  createdAt: string;
}

export interface Domain {
  domain: string;
  status: string;
  expiryDate: string;
}

export interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
}

/**
 * Check domain availability and pricing
 */
export async function checkDomain(
  apiUrl: string,
  domainName: string,
  tld: string
): Promise<DomainAvailability> {
  const response = await fetch(`${apiUrl}/api/domains/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainName, tld })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to check domain: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Purchase domain anonymously with cryptocurrency
 */
export async function purchaseDomain(
  apiUrl: string,
  domainName: string,
  tld: string,
  currency: string,
  customerEmail?: string
): Promise<DomainOrder> {
  const response = await fetch(`${apiUrl}/api/domains/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainName, tld, currency, customerEmail })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to purchase domain: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Check domain order and registration status
 */
export async function getOrderStatus(
  apiUrl: string,
  orderId: string
): Promise<DomainOrder> {
  const response = await fetch(`${apiUrl}/api/domains/order/${orderId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get order status: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get all domains owned by a ZK commitment
 */
export async function getMyDomains(
  apiUrl: string,
  domainSecret: string
): Promise<Domain[]> {
  const identity = new Identity(domainSecret);
  const commitment = identity.commitment.toString();
  
  const response = await fetch(
    `${apiUrl}/api/domains/my-domains?zkCommitment=${commitment}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get domains: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.domains;
}

/**
 * Get DNS records for a domain
 */
export async function getDNSRecords(
  apiUrl: string,
  domain: string,
  domainSecret: string
): Promise<DNSRecord[]> {
  const identity = new Identity(domainSecret);
  const commitment = identity.commitment.toString();
  
  const response = await fetch(
    `${apiUrl}/api/domains/${domain}/dns?zkCommitment=${commitment}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get DNS records: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.records;
}

/**
 * Add DNS record using domain secret authentication
 */
export async function addDNSRecord(
  apiUrl: string,
  domain: string,
  domainSecret: string,
  record: {
    type: string;
    name: string;
    content: string;
    ttl: number;
  }
): Promise<DNSRecord> {
  const response = await fetch(`${apiUrl}/api/domains/${domain}/dns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domainSecret,
      ...record
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add DNS record: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.record;
}

/**
 * Update existing DNS record
 */
export async function updateDNSRecord(
  apiUrl: string,
  domain: string,
  domainSecret: string,
  recordId: string,
  updates: {
    content?: string;
    ttl?: number;
  }
): Promise<{ ok: boolean }> {
  const response = await fetch(`${apiUrl}/api/domains/${domain}/dns/${recordId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domainSecret,
      ...updates
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update DNS record: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Delete DNS record
 */
export async function deleteDNSRecord(
  apiUrl: string,
  domain: string,
  domainSecret: string,
  recordId: string
): Promise<{ ok: boolean }> {
  const response = await fetch(`${apiUrl}/api/domains/${domain}/dns/${recordId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainSecret })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete DNS record: ${response.statusText}`);
  }
  
  return response.json();
}
