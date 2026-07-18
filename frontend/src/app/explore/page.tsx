'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import LayerZeroAnimation from '@/components/layerzero-bg';

/* ─────────────────────────── sparkline data ─────────────────────────── */
const SPARK_PTS = [
  [0, 95], [70, 82], [140, 88], [210, 65],
  [280, 71], [350, 50], [420, 54], [490, 36], [560, 22],
];
const POLYLINE = SPARK_PTS.map(p => p.join(',')).join(' ');
const AREA_PATH = `M 0,110 L ${POLYLINE} L 560,110 Z`;

export default function ExplorePage() {
  const vaultsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedPct, setSelectedPct] = useState<number>(50);

  return (
    <div className="app-shell">
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px', width: '100%' }}>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div style={{ 
          position: 'relative',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          minHeight: '60vh',
          borderBottom: '1px solid var(--border-outer)',
          marginBottom: 40
        }}>
          {/* Sweeping lines animation spanning the hero */}
          <div style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden' }}>
            <LayerZeroAnimation />
            {/* Mask to fade out animation at the bottom of hero */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, var(--bg-void), transparent)' }} />
          </div>

          <div style={{ flex: 1, maxWidth: '600px' }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase' }}
            >
              /// FUND EXPLORER
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              Experience liftoff with the next-gen asset platform
            </motion.h1>
          </div>
          
          <div style={{ flex: 1, maxWidth: '400px', alignSelf: 'flex-end', paddingBottom: '60px' }}>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}
            >
              Gravity Protocol builds technology that makes decentralized yield generation viable, scalable, and inevitable on the Stellar network.
            </motion.p>
          </div>
        </div>

        {/* ── Section header ──────────────────────────────────────────── */}
        <div
          ref={vaultsRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: '1px solid var(--border-outer)',
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            Available Vaults
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            3 Active Vaults
          </span>
        </div>

        {/* ── 3-column bento grid ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>

          {/* ─── COL 1 ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Vault card */}
            <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: 240 }}>
              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 14, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coins size={18} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Stellar Asset Core</div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        {['XLM', 'USDC'].map(t => (
                          <span key={t} style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', border: '1px solid var(--border-outer)' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="card-label">APY</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <TrendingUp size={12} /> 8.45%
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-outer)', marginTop: 'auto' }}>
                  <div>
                    <div className="card-label">Total Value Locked</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace', marginTop: 2, lineHeight: 1 }}>$900,000</div>
                  </div>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <ArrowRight size={15} style={{ color: 'var(--text-primary)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Net Account Value card */}
            <div className="card">
              <div className="card-label">Net Account Value</div>
              <div className="card-value">$900,000.00</div>
              <div className="card-sub" style={{ fontFamily: 'monospace' }}>7,500,000 XLM</div>
            </div>
          </div>

          {/* ─── COL 2  (Portfolio / Chart) ─────────────────────────── */}
          <div className="card" style={{ minHeight: 380, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div className="card-label">Net Account Value</div>
                <div className="card-value">$900,000.00</div>
                <div className="card-sub" style={{ fontFamily: 'monospace' }}>7,500,000 XLM</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="card-label">APY</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4, justifyContent: 'flex-end' }}>
                  <TrendingUp size={12} /> 4.12%
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ flex: 1, marginTop: 20, marginBottom: 20, minHeight: 110 }}>
              <svg viewBox="0 0 560 110" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <path d={AREA_PATH} fill="url(#spark-fill)" />
                <polyline
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={POLYLINE}
                />
              </svg>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 14, borderTop: '1px solid var(--border-outer)' }}>
              <div>
                <div className="card-label" style={{ marginBottom: 2 }}>APY</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Accumulated Data</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>900,000 XLM</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: 2 }}>7,500,000,000 XLM</div>
              </div>
            </div>
          </div>

          {/* ─── COL 3 ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Basket Allocation */}
            <div className="card">
              <div className="card-label" style={{ marginBottom: 14 }}>Basket Allocation</div>

              {([
                { symbol: 'USDC', pct: 28.7 },
                { symbol: 'XLM', pct: 100 },
              ] as const).map(({ symbol, pct }) => (
                <div key={symbol} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800 }}>
                        {symbol[0]}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{symbol}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{symbol === 'XLM' ? '464.00%' : '28.70%'}</span>
                  </div>
                  <div style={{ height: 16, borderRadius: 999, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', border: '1px solid var(--border-outer)' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: 'var(--text-primary)', width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Interaction Control */}
            <div className="card">
              <div className="card-label" style={{ marginBottom: 14 }}>Interaction Control</div>

              {/* Tab switcher */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 3, marginBottom: 14, border: '1px solid var(--border-outer)' }}>
                {(['deposit', 'withdraw'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      border: 'none',
                      borderRadius: 13,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      background: activeTab === t ? 'var(--text-primary)' : 'transparent',
                      color: activeTab === t ? 'var(--bg-void)' : 'var(--text-secondary)',
                      boxShadow: activeTab === t ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Amount display */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-outer)', borderRadius: 16, padding: '14px 16px', textAlign: 'center', marginBottom: 14 }}>
                <div className="card-value" style={{ fontSize: '1.5rem' }}>$225,000.00</div>
                <div className="card-sub" style={{ fontSize: '0.65rem' }}>Limit: $450,000.00 Available</div>
              </div>

              {/* Percentage pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                {[25, 50, 75, 100].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPct(p)}
                    style={{
                      padding: '7px 0',
                      border: selectedPct === p ? '1px solid var(--text-primary)' : '1px solid var(--border-outer)',
                      borderRadius: 12,
                      background: selectedPct === p ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: selectedPct === p ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p}%
                  </button>
                ))}
              </div>

              {/* Confirm button */}
              <button
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-void)',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <ArrowRight size={13} />
                Confirm {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
