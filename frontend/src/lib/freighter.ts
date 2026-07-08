// ─────────────────────────────────────────────────────────────────────────────
// Gravity Protocol — Freighter wallet helpers
// ─────────────────────────────────────────────────────────────────────────────

import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  signTransaction,
  getNetworkDetails,
  WatchWalletChanges,
} from '@stellar/freighter-api';
import { NETWORK_PASSPHRASE } from './stellar';

export interface FreighterState {
  installed: boolean;
  allowed: boolean;
  publicKey: string | null;
  network: string | null;
}

/** Check whether Freighter extension is installed and accessible */
export async function checkFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

/** Check whether user has already granted access */
export async function checkFreighterAllowed(): Promise<boolean> {
  try {
    const result = await isAllowed();
    return result.isAllowed;
  } catch {
    return false;
  }
}

/** Request access and return the connected public key, or null on failure */
export async function connectFreighter(): Promise<string | null> {
  try {
    const accessResult = await requestAccess();
    if (accessResult.error) {
      console.error('[Freighter] requestAccess error:', accessResult.error);
      return null;
    }
    const pkResult = await getAddress();
    if (pkResult.error) {
      console.error('[Freighter] getAddress error:', pkResult.error);
      return null;
    }
    return pkResult.address;
  } catch (e) {
    console.error('[Freighter] connectFreighter exception:', e);
    return null;
  }
}

/** Get the currently connected public key (if allowed) */
export async function getConnectedPublicKey(): Promise<string | null> {
  try {
    const allowed = await checkFreighterAllowed();
    if (!allowed) return null;
    const result = await getAddress();
    return result.error ? null : result.address;
  } catch {
    return null;
  }
}

/** Get current network details from Freighter */
export async function getFreighterNetwork(): Promise<string | null> {
  try {
    const result = await getNetworkDetails();
    return result.networkPassphrase ?? null;
  } catch {
    return null;
  }
}

/**
 * Sign a base64 XDR transaction envelope using Freighter.
 * Returns the signed XDR string or throws on rejection / network mismatch.
 */
export async function signWithFreighter(xdr: string): Promise<string> {
  const result = await signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  if (result.error) {
    throw new Error(`[Freighter] Sign rejected: ${result.error}`);
  }

  return result.signedTxXdr;
}

/**
 * Subscribe to wallet account changes (address switch or disconnect).
 * Returns an unsubscribe function.
 */
export function watchWallet(onChange: (pk: string) => void): () => void {
  const watcher = new WatchWalletChanges(2000);
  watcher.watch((result) => {
    if (result.address) onChange(result.address);
  });
  return () => watcher.stop();
}
