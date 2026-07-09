'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ExternalLink, AlertCircle, CheckCircle2, Loader2, Wallet } from 'lucide-react';
import type { TxStatus } from '@/hooks/useGravityProtocol';

interface InteractionCardProps {
  usdcBalanceUsd:   number;
  stakedBalanceUsd: number;
  txStatus:         TxStatus;
  txHash:           string | null;
  explorerUrl:      string | null;
  txError:          string | null;
  isConnected:      boolean;
  onDeposit:        (amount: number) => Promise<void>;
  onWithdraw:       (shares: number) => Promise<void>;
  onConnectWallet:  () => Promise<void>;
}

type Tab = 'deposit' | 'withdraw';

const PCT_OPTS = [25, 50, 75, 100] as const;

export default function InteractionCard({
  usdcBalanceUsd, stakedBalanceUsd, txStatus, explorerUrl,
  txError, isConnected, onDeposit, onWithdraw, onConnectWallet,
}: InteractionCardProps) {
  const [tab, setTab] = useState<Tab>('deposit');
  const [pct, setPct] = useState(50);

  const isPending = txStatus === 'signing' || txStatus === 'pending';
  const maxAmt    = tab === 'deposit' ? usdcBalanceUsd : stakedBalanceUsd;
  const amount    = (pct / 100) * maxAmt;

  const fmtUSD = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const handleConfirm = async () => {
    if (!isConnected || amount <= 0 || isPending) return;
    if (tab === 'deposit') await onDeposit(amount);
    else                   await onWithdraw(amount);
    setPct(50);
  };

  const btnLabel = () => {
    if (!isConnected)           return 'Connect Wallet';
    if (txStatus === 'signing') return 'Awaiting Signature…';
    if (txStatus === 'pending') return 'Confirming on Stellar…';
    if (amount <= 0)            return 'Select an Amount';
    return `Confirm ${tab === 'deposit' ? 'Deposit' : 'Withdraw'}`;
  };

  const isDisabled = isPending || amount <= 0 || !isConnected;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>

      {/* slider styles — scoped once */}
      <style>{`
        .ic-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:99px;outline:none;cursor:pointer;}
        .ic-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#0a0a0f;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;}
        .ic-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#0a0a0f;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;}
        .ic-slider:disabled{opacity:0.35;cursor:not-allowed;}
      `}</style>

      {/* Label */}
      <span style={label}>Interaction Control</span>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 14, padding: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        {(['deposit', 'withdraw'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setPct(50); }}
            disabled={isPending}
            style={{
              flex: 1, padding: '8px 0', border: 'none', borderRadius: 11,
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
              textTransform: 'capitalize', cursor: isPending ? 'not-allowed' : 'pointer',
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              background: tab === t ? '#0a0a0f' : 'transparent',
              color:      tab === t ? '#fff' : '#6b7280',
              boxShadow:  tab === t ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount display */}
      <div style={{ textAlign: 'center', padding: '14px 16px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 16 }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-0.03em', color: '#0a0a0f' }}>
          {fmtUSD(amount)}
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>
          Limit: {fmtUSD(maxAmt)} Available
        </div>
      </div>

      {/* Slider */}
      <input
        type="range" min={0} max={100} value={pct}
        onChange={e => setPct(parseInt(e.target.value))}
        disabled={isPending || maxAmt <= 0}
        className="ic-slider"
        style={{ background: `linear-gradient(to right, #0a0a0f 0%, #0a0a0f ${pct}%, rgba(0,0,0,0.1) ${pct}%, rgba(0,0,0,0.1) 100%)` }}
      />

      {/* Quick pct pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {PCT_OPTS.map(p => (
          <button
            key={p}
            onClick={() => setPct(p)}
            disabled={isPending || maxAmt <= 0}
            style={{
              padding: '7px 0', border: pct === p ? '1px solid #d1d5db' : '1px solid #e5e7eb',
              borderRadius: 11, background: pct === p ? '#0a0a0f' : '#fff',
              color: pct === p ? '#fff' : '#6b7280',
              fontSize: '0.7rem', fontWeight: 700, fontFamily: 'monospace',
              cursor: isPending ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
            }}
          >
            {p}%
          </button>
        ))}
      </div>

      {/* TX status banner */}
      <AnimatePresence>
        {txStatus !== 'idle' && (
          <motion.div
            key="tx-status"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{
              padding: '10px 12px', borderRadius: 12, overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.65rem', fontWeight: 600,
              background: txStatus === 'success' ? 'rgba(22,163,74,0.07)' : txStatus === 'error' ? 'rgba(220,38,38,0.07)' : 'rgba(37,99,235,0.06)',
              border: `1px solid ${txStatus === 'success' ? 'rgba(22,163,74,0.2)' : txStatus === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(37,99,235,0.15)'}`,
            }}
          >
            {(txStatus === 'signing' || txStatus === 'pending') && <Loader2 size={11} style={{ color: '#2563eb', flexShrink: 0, animation: 'spin 1s linear infinite' }} />}
            {txStatus === 'success' && <CheckCircle2 size={11} style={{ color: '#16a34a', flexShrink: 0 }} />}
            {txStatus === 'error'   && <AlertCircle  size={11} style={{ color: '#dc2626', flexShrink: 0 }} />}
            <span style={{ color: txStatus === 'success' ? '#16a34a' : txStatus === 'error' ? '#dc2626' : '#2563eb' }}>
              {txStatus === 'signing' && 'Waiting for Freighter signature…'}
              {txStatus === 'pending' && 'Submitted — awaiting Stellar confirmation…'}
              {txStatus === 'success' && 'Transaction confirmed on Stellar!'}
              {txStatus === 'error'   && (txError ?? 'Transaction failed. Please try again.')}
            </span>
            {explorerUrl && txStatus === 'success' && (
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', flexShrink: 0, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.62rem' }}>
                View <ExternalLink size={10} />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm / Connect button */}
      <button
        onClick={isConnected ? handleConfirm : onConnectWallet}
        disabled={isConnected && isDisabled}
        style={{
          marginTop: 'auto', width: '100%', padding: '14px 0', border: 'none', borderRadius: 16,
          fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: isConnected && isDisabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
          background: isConnected && isDisabled ? '#f3f4f6' : '#0a0a0f',
          color: isConnected && isDisabled ? '#9ca3af' : '#fff',
          boxShadow: isConnected && isDisabled ? 'none' : '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        {isPending ? (
          <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />{btnLabel()}</>
        ) : isConnected ? (
          <>{btnLabel()} {!isDisabled && <ArrowRight size={13} />}</>
        ) : (
          <><Wallet size={13} />{btnLabel()}</>
        )}
      </button>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const label: React.CSSProperties = {
  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#9ca3af',
};
