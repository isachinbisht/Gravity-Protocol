// ─────────────────────────────────────────────────────────────────────────────
// Gravity Protocol — Allocation contract reads
// Functions: weights(), calculate_nav()
// ─────────────────────────────────────────────────────────────────────────────

import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  scValToNative,
  rpc,
} from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE, CONTRACT_IDS, toHuman } from './stellar';

const ALLOC_ID = CONTRACT_IDS.allocation;

// Testnet public account for read-only simulations (no real funds needed)
const READ_ONLY_SOURCE = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN';

export interface AssetWeights {
  /** Map from contract ID → percentage weight (0–100) */
  weights: Record<string, number>;
  /** XLM weight as a percentage */
  xlmWeight: number;
  /** USDC weight as a percentage */
  usdcWeight: number;
}

/**
 * Fetch target allocation weights from the Allocation contract.
 * Returns a map of assetContractId → weight (0-100).
 * Falls back to default 40/60 split if contracts are not deployed yet.
 */
export async function fetchAllocationWeights(): Promise<AssetWeights> {
  // Placeholder fallback — default to XLM 40% / USDC 60%
  const defaultWeights: AssetWeights = {
    weights: {
      [CONTRACT_IDS.xlmToken]:  40,
      [CONTRACT_IDS.usdcToken]: 60,
    },
    xlmWeight:  40,
    usdcWeight: 60,
  };

  if (ALLOC_ID.startsWith('PLACEHOLDER')) {
    return defaultWeights;
  }

  try {
    const contract = new Contract(ALLOC_ID);
    const account  = await server.getAccount(READ_ONLY_SOURCE);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('weights'))
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simResult)) {
      console.warn('[Allocation] weights simulation error — using defaults:', simResult.error);
      return defaultWeights;
    }

    const scVal = simResult.result?.retval;
    if (!scVal) return defaultWeights;

    // scVal is a Map<Address, u32> — scValToNative converts it to a JS Map
    const nativeMap = scValToNative(scVal) as Map<string, number>;
    const weights: Record<string, number> = {};
    let xlmWeight  = 0;
    let usdcWeight = 0;

    nativeMap.forEach((weight, contractId) => {
      weights[contractId] = weight;
      if (contractId === CONTRACT_IDS.xlmToken)  xlmWeight  = weight;
      if (contractId === CONTRACT_IDS.usdcToken) usdcWeight = weight;
    });

    return { weights, xlmWeight, usdcWeight };
  } catch (e) {
    console.error('[Allocation] fetchAllocationWeights error:', e);
    return defaultWeights;
  }
}

/**
 * Fetch the on-chain NAV (Net Asset Value) from the Allocation contract.
 * Returns the NAV in human-readable USD (7 decimal scaled).
 */
export async function fetchNAV(): Promise<number> {
  if (ALLOC_ID.startsWith('PLACEHOLDER')) {
    return 0;
  }

  try {
    const contract = new Contract(ALLOC_ID);
    const account  = await server.getAccount(READ_ONLY_SOURCE);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('calculate_nav'))
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simResult)) {
      console.warn('[Allocation] NAV simulation error:', simResult.error);
      return 0;
    }

    const scVal = simResult.result?.retval;
    if (!scVal) return 0;

    const raw = BigInt(scValToNative(scVal) as number | bigint);
    return toHuman(raw);
  } catch (e) {
    console.error('[Allocation] fetchNAV error:', e);
    return 0;
  }
}
