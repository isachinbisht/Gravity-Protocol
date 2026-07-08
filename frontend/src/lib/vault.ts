// ─────────────────────────────────────────────────────────────────────────────
// Gravity Protocol — Vault contract interactions
// Contract functions: deposit, withdraw, balance, total_shares
// ─────────────────────────────────────────────────────────────────────────────

import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  xdr,
  Address,
  nativeToScVal,
  scValToNative,
  rpc,
} from '@stellar/stellar-sdk';
import {
  server,
  NETWORK_PASSPHRASE,
  CONTRACT_IDS,
  toHuman,
  toRaw,
} from './stellar';
import { signWithFreighter } from './freighter';

const VAULT_CONTRACT_ID = CONTRACT_IDS.vault;

// ── Read Helpers ──────────────────────────────────────────────────────────────

/**
 * Fetch the vault share balance for a given wallet address.
 * Returns the human-readable share balance (7-decimal scaled).
 */
export async function fetchVaultBalance(publicKey: string): Promise<number> {
  if (VAULT_CONTRACT_ID.startsWith('PLACEHOLDER')) {
    return 0;
  }
  try {
    const contract  = new Contract(VAULT_CONTRACT_ID);
    const addressSc = new Address(publicKey).toScVal();

    const account = await server.getAccount(publicKey);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('balance', addressSc))
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simResult)) {
      console.error('[Vault] balance simulation error:', simResult.error);
      return 0;
    }

    const scVal = simResult.result?.retval;
    if (!scVal) return 0;
    const raw = BigInt(scValToNative(scVal) as number | bigint);
    return toHuman(raw);
  } catch (e) {
    console.error('[Vault] fetchVaultBalance error:', e);
    return 0;
  }
}

/**
 * Fetch the total supply of vault shares outstanding.
 */
export async function fetchTotalShares(): Promise<number> {
  if (VAULT_CONTRACT_ID.startsWith('PLACEHOLDER')) {
    return 0;
  }
  try {
    const contract = new Contract(VAULT_CONTRACT_ID);
    // Use a null source for pure-read simulation
    const tx = new TransactionBuilder(
      await server.getAccount('GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'),
      { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call('total_shares'))
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simResult)) return 0;

    const scVal = simResult.result?.retval;
    if (!scVal) return 0;
    const raw = BigInt(scValToNative(scVal) as number | bigint);
    return toHuman(raw);
  } catch (e) {
    console.error('[Vault] fetchTotalShares error:', e);
    return 0;
  }
}

// ── Write Helpers ─────────────────────────────────────────────────────────────

/**
 * Submit a deposit transaction to the Vault contract.
 * Transfers `amountUsdc` USDC (human-readable) from the wallet into the vault.
 * Returns the transaction hash on success.
 */
export async function callDeposit(
  publicKey: string,
  amountUsdc: number
): Promise<string> {
  const contract = new Contract(VAULT_CONTRACT_ID);
  const amountRaw = toRaw(amountUsdc);

  const account = await server.getAccount(publicKey);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'deposit',
        new Address(publicKey).toScVal(),
        nativeToScVal(amountRaw, { type: 'i128' })
      )
    )
    .setTimeout(30)
    .build();

  // Simulate to get footprint + auth entries
  const simResult = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`[Vault] deposit simulation failed: ${simResult.error}`);
  }

  // Assemble transaction with footprint
  const preparedTx = rpc.assembleTransaction(tx, simResult).build();

  // Sign with Freighter
  const signedXdr = await signWithFreighter(preparedTx.toXDR());

  // Submit to network
  const submitResult = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  );

  if (submitResult.status === 'ERROR') {
    throw new Error(`[Vault] deposit submit error: ${JSON.stringify(submitResult.errorResult)}`);
  }

  return submitResult.hash;
}

/**
 * Submit a withdraw transaction — burns `shares` (human-readable) and
 * returns the underlying USDC to the user's wallet.
 * Returns the transaction hash on success.
 */
export async function callWithdraw(
  publicKey: string,
  shares: number
): Promise<string> {
  const contract = new Contract(VAULT_CONTRACT_ID);
  const sharesRaw = toRaw(shares);

  const account = await server.getAccount(publicKey);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'withdraw',
        new Address(publicKey).toScVal(),
        nativeToScVal(sharesRaw, { type: 'i128' })
      )
    )
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`[Vault] withdraw simulation failed: ${simResult.error}`);
  }

  const preparedTx = rpc.assembleTransaction(tx, simResult).build();
  const signedXdr  = await signWithFreighter(preparedTx.toXDR());

  const submitResult = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  );

  if (submitResult.status === 'ERROR') {
    throw new Error(`[Vault] withdraw submit error: ${JSON.stringify(submitResult.errorResult)}`);
  }

  return submitResult.hash;
}

/**
 * Poll Soroban RPC until the transaction is confirmed (SUCCESS) or failed.
 * Returns the final status string.
 */
export async function waitForTransaction(hash: string, maxAttempts = 20): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const result = await server.getTransaction(hash);
      if (result.status === rpc.Api.GetTransactionStatus.SUCCESS) return 'SUCCESS';
      if (result.status === rpc.Api.GetTransactionStatus.FAILED)  return 'FAILED';
    } catch {
      // Still pending — continue polling
    }
  }
  return 'TIMEOUT';
}
