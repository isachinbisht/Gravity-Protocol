'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Gravity Protocol — useGravityProtocol hook
// Single source of truth for all on-chain reads and writes in the dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  checkFreighterInstalled,
  connectFreighter,
  getConnectedPublicKey,
  watchWallet,
} from '@/lib/freighter';
import {
  fetchVaultBalance,
  fetchTotalShares,
  callDeposit,
  callWithdraw,
  waitForTransaction,
} from '@/lib/vault';
import { fetchAllocationWeights, fetchNAV } from '@/lib/allocation';
import { EXPLORER_BASE_URL, CONTRACT_IDS } from '@/lib/stellar';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TxStatus = 'idle' | 'signing' | 'pending' | 'success' | 'error';

export interface GravityProtocolState {
  // ── Wallet ──────────────────────────────────────────────────────────────
  isFreighterInstalled: boolean;
  isConnected: boolean;
  publicKey: string | null;
  shortAddress: string | null;
  connectWallet: () => Promise<void>;

  // ── On-chain data ────────────────────────────────────────────────────────
  /** User's vault share balance (human units) */
  vaultShares: number;
  /** Total shares outstanding in the vault */
  totalShares: number;
  /** On-chain NAV in USD (from Allocation.calculate_nav) */
  navUsd: number;
  /** XLM target allocation weight (0–100) */
  xlmWeight: number;
  /** USDC target allocation weight (0–100) */
  usdcWeight: number;
  /** Whether on-chain data is currently loading */
  isLoadingData: boolean;
  /** Refresh all on-chain data manually */
  refreshData: () => Promise<void>;

  // ── Transactions ─────────────────────────────────────────────────────────
  txStatus: TxStatus;
  txHash: string | null;
  txError: string | null;
  explorerUrl: string | null;
  /** Deposit amountUsdc (human-readable) to the vault */
  deposit: (amountUsdc: number) => Promise<void>;
  /** Withdraw shares (human-readable) from the vault */
  withdraw: (shares: number) => Promise<void>;
}

// ── Helper: shorten public key ────────────────────────────────────────────────
function shortenKey(pk: string): string {
  return `${pk.slice(0, 4)}...${pk.slice(-4)}`;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useGravityProtocol(): GravityProtocolState {
  // Wallet state
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [isConnected,          setIsConnected]          = useState(false);
  const [publicKey,            setPublicKey]            = useState<string | null>(null);

  // On-chain data
  const [vaultShares,   setVaultShares]   = useState(0);
  const [totalShares,   setTotalShares]   = useState(0);
  const [navUsd,        setNavUsd]        = useState(0);
  const [xlmWeight,     setXlmWeight]     = useState(40);
  const [usdcWeight,    setUsdcWeight]    = useState(60);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Transaction state
  const [txStatus,  setTxStatus]  = useState<TxStatus>('idle');
  const [txHash,    setTxHash]    = useState<string | null>(null);
  const [txError,   setTxError]   = useState<string | null>(null);

  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Initialise: check Freighter installation and existing connection ────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const installed = await checkFreighterInstalled();
      if (cancelled) return;
      setIsFreighterInstalled(installed);

      if (installed) {
        const pk = await getConnectedPublicKey();
        if (cancelled) return;
        if (pk) {
          setPublicKey(pk);
          setIsConnected(true);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // ── Watch for wallet address changes (user switches account in Freighter) ──
  useEffect(() => {
    if (!isConnected) return;
    const unwatch = watchWallet((pk) => {
      setPublicKey(pk);
    });
    return unwatch;
  }, [isConnected]);

  // ── Load on-chain data whenever publicKey changes ──────────────────────────
  const refreshData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [weights, nav, shares] = await Promise.allSettled([
        fetchAllocationWeights(),
        fetchNAV(),
        publicKey ? fetchTotalShares() : Promise.resolve(0),
      ]);

      if (weights.status === 'fulfilled') {
        setXlmWeight(weights.value.xlmWeight);
        setUsdcWeight(weights.value.usdcWeight);
      }
      if (nav.status    === 'fulfilled') setNavUsd(nav.value);
      if (shares.status === 'fulfilled') setTotalShares(shares.value);

      if (publicKey) {
        const userBal = await fetchVaultBalance(publicKey);
        setVaultShares(userBal);
      }
    } catch (e) {
      console.error('[useGravityProtocol] refreshData error:', e);
    } finally {
      setIsLoadingData(false);
    }
  }, [publicKey]);

  useEffect(() => {
    refreshData();

    // Poll every 15 seconds for live updates
    refreshTimerRef.current = setInterval(refreshData, 15_000);
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [refreshData]);

  // ── Connect wallet ─────────────────────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    const pk = await connectFreighter();
    if (pk) {
      setPublicKey(pk);
      setIsConnected(true);
    }
  }, []);

  // ── Deposit ───────────────────────────────────────────────────────────────
  const deposit = useCallback(async (amountUsdc: number) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setTxStatus('signing');
    setTxHash(null);
    setTxError(null);
    try {
      const hash = await callDeposit(publicKey, amountUsdc);
      setTxHash(hash);
      setTxStatus('pending');

      const finalStatus = await waitForTransaction(hash);
      setTxStatus(finalStatus === 'SUCCESS' ? 'success' : 'error');
      if (finalStatus === 'SUCCESS') await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTxError(msg);
      setTxStatus('error');
    }
  }, [publicKey, refreshData]);

  // ── Withdraw ──────────────────────────────────────────────────────────────
  const withdraw = useCallback(async (shares: number) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setTxStatus('signing');
    setTxHash(null);
    setTxError(null);
    try {
      const hash = await callWithdraw(publicKey, shares);
      setTxHash(hash);
      setTxStatus('pending');

      const finalStatus = await waitForTransaction(hash);
      setTxStatus(finalStatus === 'SUCCESS' ? 'success' : 'error');
      if (finalStatus === 'SUCCESS') await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTxError(msg);
      setTxStatus('error');
    }
  }, [publicKey, refreshData]);

  return {
    // Wallet
    isFreighterInstalled,
    isConnected,
    publicKey,
    shortAddress: publicKey ? shortenKey(publicKey) : null,
    connectWallet,

    // Data
    vaultShares,
    totalShares,
    navUsd,
    xlmWeight,
    usdcWeight,
    isLoadingData,
    refreshData,

    // Transactions
    txStatus,
    txHash,
    txError,
    explorerUrl: txHash ? `${EXPLORER_BASE_URL}/${txHash}` : null,
    deposit,
    withdraw,
  };
}
