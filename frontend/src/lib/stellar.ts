// ─────────────────────────────────────────────────────────────────────────────
// Gravity Protocol — Stellar / Soroban network configuration
// Set real deployed contract addresses in .env.local:
//
//   NEXT_PUBLIC_VAULT_CONTRACT_ID=CA...
//   NEXT_PUBLIC_ALLOCATION_CONTRACT_ID=CA...
//   NEXT_PUBLIC_REBALANCE_CONTRACT_ID=CA...
//   NEXT_PUBLIC_XLM_TOKEN_ID=CA...
//   NEXT_PUBLIC_USDC_TOKEN_ID=CA...
// ─────────────────────────────────────────────────────────────────────────────

import { rpc, Networks } from '@stellar/stellar-sdk';

// ── Network ──────────────────────────────────────────────────────────────────
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const SOROBAN_RPC_URL    = 'https://soroban-testnet.stellar.org';
export const HORIZON_URL        = 'https://horizon-testnet.stellar.org';
export const EXPLORER_BASE_URL  = 'https://stellar.expert/explorer/testnet/tx';

export const server = new rpc.Server(SOROBAN_RPC_URL, {
  allowHttp: false,
});

// ── Contract IDs (from .env.local — fallback to placeholder strings) ──────────
export const CONTRACT_IDS = {
  vault:      process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID      ?? 'PLACEHOLDER_VAULT_CONTRACT_ID',
  allocation: process.env.NEXT_PUBLIC_ALLOCATION_CONTRACT_ID ?? 'PLACEHOLDER_ALLOCATION_CONTRACT_ID',
  rebalance:  process.env.NEXT_PUBLIC_REBALANCE_CONTRACT_ID  ?? 'PLACEHOLDER_REBALANCE_CONTRACT_ID',
  xlmToken:   process.env.NEXT_PUBLIC_XLM_TOKEN_ID           ?? 'PLACEHOLDER_XLM_TOKEN_ID',
  usdcToken:  process.env.NEXT_PUBLIC_USDC_TOKEN_ID          ?? 'PLACEHOLDER_USDC_TOKEN_ID',
};

// ── Soroban decimal precision (7 decimals = Stellar standard) ─────────────────
export const DECIMALS   = 7;
export const SCALE      = BigInt(10_000_000); // 10^7 as BigInt

/** Convert raw on-chain i128 stroops → human-readable number (7 decimals) */
export function toHuman(raw: bigint): number {
  return Number(raw) / Number(SCALE);
}

/** Convert human float → raw i128 stroops (7 decimals) */
export function toRaw(human: number): bigint {
  return BigInt(Math.round(human * Number(SCALE)));
}
