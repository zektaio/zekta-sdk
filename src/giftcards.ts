// Zekta SDK - Anonymous Gift Cards

import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";

export interface GiftCardCatalogItem {
  id: string;
  name: string;
  brand: string;
  denominations: number[];
  currency: string;
  region: string;
}

export interface GiftCardOrder {
  orderId: string;
  giftCardType: string;
  denomination: number;
  currency: string;
  amountCrypto: string;
  depositAddress: string;
  status: string;
  giftCardSecret: string;
  createdAt: string;
}

export interface GiftCardDetails {
  orderId: string;
  giftCardType: string;
  denomination: number;
  cardNumber: string;
  cardPin: string;
  redeemInstructions: string;
  deliveredAt: string;
}

/**
 * Get available gift card catalog
 */
export async function getCatalog(apiUrl: string): Promise<GiftCardCatalogItem[]> {
  const response = await fetch(`${apiUrl}/api/giftcards/catalog`);
  if (!response.ok) {
    throw new Error(`Failed to get catalog: ${response.statusText}`);
  }
  const data = await response.json();
  return data.catalog;
}

/**
 * Create anonymous gift card order
 */
export async function createOrder(
  apiUrl: string,
  giftCardType: string,
  denomination: number,
  currency: string
): Promise<GiftCardOrder> {
  const response = await fetch(`${apiUrl}/api/giftcards/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ giftCardType, denomination, currency })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Check gift card order status
 */
export async function getOrderStatus(
  apiUrl: string,
  orderId: string
): Promise<GiftCardOrder> {
  const response = await fetch(`${apiUrl}/api/giftcards/order/${orderId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get order status: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Retrieve gift card details using zero-knowledge proof
 */
export async function retrieveCard(
  apiUrl: string,
  giftCardSecret: string
): Promise<GiftCardDetails[]> {
  // Restore identity from secret
  const identity = new Identity(giftCardSecret);
  const commitment = identity.commitment.toString();
  
  // Get current Semaphore group for proof generation
  const groupResponse = await fetch(`${apiUrl}/api/giftcards/group?zkCommitment=${commitment}`);
  if (!groupResponse.ok) {
    throw new Error(`Failed to get group: ${groupResponse.statusText}`);
  }
  const groupData = await groupResponse.json();
  
  // Generate zero-knowledge proof
  const group = new Group();
  group.addMembers(groupData.members);
  const proof = await generateProof(identity, group, commitment, commitment);
  
  // Verify proof and retrieve cards
  const response = await fetch(`${apiUrl}/api/giftcards/verify-and-get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...proof,
      merkleTreeDepth: group.depth,
      merkleTreeRoot: group.root
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to retrieve cards: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.cards;
}

/**
 * Get all delivered gift cards for a ZK commitment
 */
export async function getMyCards(
  apiUrl: string,
  giftCardSecret: string
): Promise<GiftCardDetails[]> {
  const identity = new Identity(giftCardSecret);
  const commitment = identity.commitment.toString();
  
  const response = await fetch(`${apiUrl}/api/giftcards/my-cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zkCommitment: commitment })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get cards: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.cards;
}
