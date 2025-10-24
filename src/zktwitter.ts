// Zekta SDK - Anonymous Twitter Posting

import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";

export interface TwitterSession {
  zkSession: string;
  expiresAt: string;
  commitment: string;
}

export interface TweetResponse {
  ok: boolean;
  tweetId: string;
  tweetUrl: string;
  createdAt: string;
}

export interface TwitterAction {
  actionId: string;
  text: string;
  tweetId: string;
  tweetUrl: string;
  createdAt: string;
}

/**
 * Get nonce for ZK proof generation
 */
export async function getNonce(apiUrl: string): Promise<string> {
  const response = await fetch(`${apiUrl}/api/twitter/session/nonce`);
  if (!response.ok) {
    throw new Error(`Failed to get nonce: ${response.statusText}`);
  }
  const data = await response.json();
  return data.nonce;
}

/**
 * Create anonymous Twitter session using zero-knowledge proof
 */
export async function createSession(
  apiUrl: string,
  identitySecret: string,
  groupMembers: string[],
  nonce?: string
): Promise<TwitterSession> {
  // Restore identity from secret
  const identity = new Identity(identitySecret);
  const commitment = identity.commitment.toString();
  
  // Get nonce if not provided
  const proofNonce = nonce || await getNonce(apiUrl);
  
  // Generate zero-knowledge proof
  const group = new Group();
  group.addMembers(groupMembers);
  const proof = await generateProof(identity, group, proofNonce, proofNonce);
  
  // Verify proof and create session
  const response = await fetch(`${apiUrl}/api/twitter/session/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...proof,
      merkleTreeDepth: group.depth,
      merkleTreeRoot: group.root
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Post a tweet anonymously to @zektabro account
 */
export async function postTweet(
  apiUrl: string,
  sessionToken: string,
  text: string,
  replyToTweetId?: string
): Promise<TweetResponse> {
  const response = await fetch(`${apiUrl}/api/twitter/tweet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({ text, replyToTweetId })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to post tweet: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get all tweets posted by your ZK identity
 */
export async function getMyActions(
  apiUrl: string,
  sessionToken: string
): Promise<TwitterAction[]> {
  const response = await fetch(`${apiUrl}/api/twitter/my-actions`, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get actions: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.actions;
}
