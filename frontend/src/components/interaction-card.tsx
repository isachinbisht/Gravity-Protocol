'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Info, ArrowRight } from 'lucide-react';

interface InteractionCardProps {
  usdcBalanceUsd: number;
  stakedBalanceUsd: number;
  onAction: (action: 'deposit' | 'withdraw', amount: number) => void;
}

type Tab = 'deposit' | 'withdraw';

export default function InteractionCard({
  usdcBalanceUsd,
  stakedBalanceUsd,
  onAction,
}: InteractionCardProps) {
  const [tab, setTab]           = useState<Tab>('deposit');
  const [pct, setPct]           = useState<number>(50);
  const [pending, setPending]   = useState(false);

  const maxAmt = tab === 'deposit' ? usdcBalanceUsd : stakedBalanceUsd;
  const amount = (pct / 100) * maxAmt;

  const fmtUSD = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const handleConfirm = async () => {
    if (amount <= 0 || pending) return;
    setPending(true);
    await new Promise((r) => setTimeout(r, 1200));
    onAction(tab, amount);
    setPct(50);
    setPending(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-[0.12em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Interaction Control
        </span>
        <Info size={14} style={{ color: 'var(--text-muted)' }} />
      </div>

      {/* Tab switcher — solid black pill / ghost text */}
      <div className="relative flex items-center gap-2 p-1 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        {(['deposit', 'withdraw'] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => { setTab(t); setPct(50); }}
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

      {/* Amount display pill */}
      <div
        className="text-center py-4 px-3 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          className="text-2xl font-extrabold tracking-tight font-mono"
          style={{ color: 'var(--text-primary)' }}
        >
          {fmtUSD(amount)}
        </div>
        <p
          className="text-[10px] font-medium mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Limit: {fmtUSD(maxAmt)} Available
        </p>
      </div>

      {/* Range slider */}
      <div className="px-1">
        <style>{`
          .tap-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 99px;
            outline: none;
            cursor: pointer;
          }
          .tap-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #0a0a0f;
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            cursor: pointer;
          }
          .tap-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #0a0a0f;
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            cursor: pointer;
          }
        `}</style>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => setPct(parseInt(e.target.value))}
          disabled={pending || maxAmt <= 0}
          className="tap-slider"
          style={{
            background: `linear-gradient(to right, #0a0a0f 0%, #0a0a0f ${pct}%, rgba(0,0,0,0.12) ${pct}%, rgba(0,0,0,0.12) 100%)`,
          }}
        />
      </div>

      {/* Percentage quick pills */}
      <div className="grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((p) => {
          const sel = pct === p;
          return (
            <button
              key={p}
              onClick={() => setPct(p)}
              disabled={pending || maxAmt <= 0}
              className="relative py-1.5 rounded-xl text-xs font-bold font-mono select-none transition-all duration-150"
              style={{
                color: sel ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: sel ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${sel ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              {sel && (
                <motion.div
                  layoutId="pct-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.07)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              <span className="relative z-10">{p}%</span>
            </button>
          );
        })}
      </div>

      {/* Confirm button — solid black pill */}
      <button
        onClick={handleConfirm}
        disabled={amount <= 0 || pending}
        className="w-full py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 select-none transition-all duration-200 mt-auto"
        style={{
          background: amount > 0 && !pending ? '#0a0a0f' : 'rgba(0,0,0,0.08)',
          color: amount > 0 && !pending ? '#fff' : 'var(--text-muted)',
          cursor: amount > 0 && !pending ? 'pointer' : 'not-allowed',
          boxShadow: amount > 0 && !pending ? '0 4px 18px rgba(0,0,0,0.25)' : 'none',
          letterSpacing: '0.08em',
        }}
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            Confirm {tab}
            <ArrowRight size={13} />
          </>
        )}
      </button>
    </div>
  );
}
