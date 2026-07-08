'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Info, ArrowRight, ExternalLink, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { TxStatus } from '@/hooks/useGravityProtocol';

interface InteractionCardProps {
  usdcBalanceUsd: number;
  stakedBalanceUsd: number;
  txStatus: TxStatus;
  txHash: string | null;
  explorerUrl: string | null;
  txError: string | null;
  isConnected: boolean;
  onDeposit: (amountUsdc: number) => Promise<void>;
  onWithdraw: (shares: number) => Promise<void>;
  onConnectWallet: () => Promise<void>;
}

type Tab = 'deposit' | 'withdraw';

export default function InteractionCard({
  usdcBalanceUsd,
  stakedBalanceUsd,
  txStatus,
  txHash,
  explorerUrl,
  txError,
  isConnected,
  onDeposit,
  onWithdraw,
  onConnectWallet,
}: InteractionCardProps) {
  const [tab, setTab] = useState<Tab>('deposit');
  const [pct, setPct] = useState<number>(50);

  const isPending = txStatus === 'signing' || txStatus === 'pending';
  const maxAmt    = tab === 'deposit' ? usdcBalanceUsd : stakedBalanceUsd;
  const amount    = (pct / 100) * maxAmt;

  const fmtUSD = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const handleConfirm = async () => {
    if (amount <= 0 || isPending || !isConnected) return;
    if (tab === 'deposit') {
      await onDeposit(amount);
    } else {
      // For withdraw, we pass amount as shares (1:1 ratio approximation until NAV is live)
      await onWithdraw(amount);
    }
    setPct(50);
  };

  const btnLabel = () => {
    if (!isConnected)          return 'Connect Wallet to Continue';
    if (txStatus === 'signing') return 'Awaiting Signature...';
    if (txStatus === 'pending') return 'Confirming on Stellar...';
    if (amount <= 0)            return 'Enter Amount';
    return `Confirm ${tab === 'deposit' ? 'Deposit' : 'Withdraw'}`;
  };

  const isDisabled = isPending || amount <= 0 || !isConnected;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Interaction Control
        </span>
        <Info size={14} style={{ color: 'var(--text-muted)' }} />
      </div>

      {/* Tab switcher */}
      <div className="relative flex items-center gap-2 p-1 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        {(['deposit', 'withdraw'] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => { setTab(t); setPct(50); }}
              disabled={isPending}
              className="relative flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 select-none"
              style={{ color: active ? '#fff' : 'var(--text-secondary)', zIndex: 1 }}
            >
              {active && (
                <motion.div
                  layoutId="interaction-tab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: '#0a0a0f', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              {t === 'deposit' ? <Download size={12} /> : <Upload size={12} />}
              {t}
            </button>
          );
        })}
      </div>

      {/* Amount display */}
      <div className="text-center py-4 px-3 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="text-2xl font-extrabold tracking-tight font-mono" style={{ color: 'var(--text-primary)' }}>
          {fmtUSD(amount)}
        </div>
        <p className="text-[10px] font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
          Limit: {fmtUSD(maxAmt)} Available
        </p>
      </div>

      {/* Range slider */}
      <div className="px-1">
        <style>{`
          .gp-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:99px; outline:none; cursor:pointer; }
          .gp-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:#0a0a0f; border:2px solid rgba(255,255,255,0.9); box-shadow:0 2px 6px rgba(0,0,0,0.25); cursor:pointer; }
          .gp-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#0a0a0f; border:2px solid rgba(255,255,255,0.9); box-shadow:0 2px 6px rgba(0,0,0,0.25); cursor:pointer; }
          .gp-slider:disabled { opacity:0.4; cursor:not-allowed; }
        `}</style>
        <input
          type="range" min={0} max={100} value={pct}
          onChange={(e) => setPct(parseInt(e.target.value))}
          disabled={isPending || maxAmt <= 0}
          className="gp-slider"
          style={{ background: `linear-gradient(to right, #0a0a0f 0%, #0a0a0f ${pct}%, rgba(0,0,0,0.12) ${pct}%, rgba(0,0,0,0.12) 100%)` }}
        />
      </div>

      {/* Percentage quick pills */}
      <div className="grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((p) => {
          const sel = pct === p;
          return (
            <button key={p} onClick={() => setPct(p)} disabled={isPending || maxAmt <= 0}
              className="relative py-1.5 rounded-xl text-xs font-bold font-mono select-none transition-all duration-150"
              style={{ color: sel ? 'var(--text-primary)' : 'var(--text-secondary)', background: sel ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.03)', border: `1px solid ${sel ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.05)'}` }}
            >
              {sel && (
                <motion.div layoutId="pct-pill" className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.07)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              <span className="relative z-10">{p}%</span>
            </button>
          );
        })}
      </div>

      {/* Transaction status banner */}
      <AnimatePresence>
        {txStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl px-3 py-2.5 flex items-center gap-2 text-[10px] font-semibold overflow-hidden"
            style={{
              background: txStatus === 'success'
                ? 'rgba(22,163,74,0.07)'
                : txStatus === 'error'
                ? 'rgba(220,38,38,0.07)'
                : 'rgba(37,99,235,0.06)',
              border: `1px solid ${txStatus === 'success' ? 'rgba(22,163,74,0.2)' : txStatus === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(37,99,235,0.15)'}`,
            }}
          >
            {(txStatus === 'signing' || txStatus === 'pending') && (
              <Loader2 size={12} className="animate-spin flex-shrink-0" style={{ color: '#2563eb' }} />
            )}
            {txStatus === 'success' && <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: '#16a34a' }} />}
            {txStatus === 'error'   && <AlertCircle  size={12} className="flex-shrink-0" style={{ color: '#dc2626' }} />}

            <span style={{ color: txStatus === 'success' ? '#16a34a' : txStatus === 'error' ? '#dc2626' : '#2563eb' }}>
              {txStatus === 'signing' && 'Waiting for Freighter signature...'}
              {txStatus === 'pending' && 'Transaction submitted — awaiting Stellar confirmation...'}
              {txStatus === 'success' && 'Transaction confirmed on Stellar!'}
              {txStatus === 'error'   && (txError ?? 'Transaction failed. Please try again.')}
            </span>

            {explorerUrl && txStatus === 'success' && (
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                className="ml-auto flex-shrink-0 flex items-center gap-0.5"
                style={{ color: '#2563eb', textDecoration: 'underline' }}
              >
                View <ExternalLink size={10} />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm button */}
      <button
        onClick={isConnected ? handleConfirm : onConnectWallet}
        disabled={isConnected && isDisabled}
        className="w-full py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 select-none transition-all duration-200 mt-auto"
        style={{
          background: isDisabled && isConnected ? 'rgba(0,0,0,0.08)' : '#0a0a0f',
          color: isDisabled && isConnected ? 'var(--text-muted)' : '#fff',
          cursor: isDisabled && isConnected ? 'not-allowed' : 'pointer',
          boxShadow: isDisabled && isConnected ? 'none' : '0 4px 18px rgba(0,0,0,0.25)',
          letterSpacing: '0.08em',
        }}
      >
        {isPending
          ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{btnLabel()}</>
          : <>{btnLabel()} {!isPending && isConnected && amount > 0 && <ArrowRight size={13} />}</>
        }
      </button>
    </div>
  );
}
