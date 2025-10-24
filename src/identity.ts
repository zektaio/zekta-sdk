import { Identity } from "@semaphore-protocol/identity";

export interface ZektaIdentity {
  commitment: string;
  secret: string;
}

/**
 * Generate a new Semaphore identity for ZK proofs
 */
export function generateIdentity(): ZektaIdentity {
  const identity = new Identity();
  return {
    commitment: identity.commitment.toString(),
    secret: identity.toString()
  };
}

/**
 * Restore identity from saved secret
 */
export function restoreIdentity(secret: string): ZektaIdentity {
  const identity = new Identity(secret);
  return {
    commitment: identity.commitment.toString(),
    secret: secret
  };
}

/**
 * Get commitment from identity secret
 */
export function getCommitment(secret: string): string {
  const identity = new Identity(secret);
  return identity.commitment.toString();
}
