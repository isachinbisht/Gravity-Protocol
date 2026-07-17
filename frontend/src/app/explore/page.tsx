'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight, Rocket, Compass, TrendingUp } from 'lucide-react';
import AntigravityBackground from '@/components/antigravity-bg';
import { Navbar } from '@/components/navbar';
import { TypewriterEffect } from '@/components/typewriter';
import Link from 'next/link';

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

  const scrollToVaults = () =>
    vaultsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="app-shell" style={{ background: 'transparent', minHeight: '100vh', color: '#0a0a0f' }}>
      <AntigravityBackground />
      <Navbar />

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 28px 120px' }}>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.06,
              color: '#0a0a0f',
              marginBottom: 28,
              maxWidth: 800,
              margin: '0 auto 28px',
              minHeight: '120px', // Prevent layout shift while typing
            }}
          >
            <TypewriterEffect
              phrases={[
                "Experience liftoff with the next-gen asset platform.",
                "Decentralized yield generation made simple.",
                "Permissionless on-chain funds for everyone.",
                "Automated rebalancing on the Stellar network."
              ]}
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2500}
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {/* Primary CTA */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#0a0a0f',
                background: 'linear-gradient(135deg,#d1d5db 0%,#9ca3af 50%,#6b7280 100%)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.14), inset 0 1px 3px rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.55)',
                textDecoration: 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <Rocket size={14} />
              Launch Dashboard
            </Link>

            {/* Secondary CTA */}
            <button
              onClick={scrollToVaults}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#0a0a0f',
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <Compass size={14} />
              Explore vaults
            </button>
          </motion.div>
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
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0a0a0f' }}>
            Available Vaults
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280' }}>
            3 Active Vaults
          </span>
        </div>

        {/* ── 3-column bento grid ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>

          {/* ─── COL 1 ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Vault card — chrome background */}
            <div
              style={{
                position: 'relative',
                borderRadius: 24,
                overflow: 'hidden',
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 22,
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                backgroundImage: 'url("/chrome_fluid_bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Frosted overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(3px)' }} />

              {/* Top row */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                    <Coins size={18} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.01em' }}>Stellar Asset Core</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {['XLM', 'USDC'].map(t => (
                        <span key={t} style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: 'rgba(0,0,0,0.06)', color: '#374151', border: '1px solid rgba(0,0,0,0.08)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>APY</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <TrendingUp size={12} /> 8.45%
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Value Locked</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0a0a0f', fontFamily: 'monospace', marginTop: 2, lineHeight: 1 }}>$900,000</div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                  <ArrowRight size={15} style={{ color: '#0a0a0f' }} />
                </div>
              </div>
            </div>

            {/* Net Account Value card */}
            <div style={card}>
              <div style={label}>Net Account Value</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-0.03em', color: '#0a0a0f', lineHeight: 1, marginTop: 6 }}>$900,000.00</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', fontFamily: 'monospace', marginTop: 4 }}>7,500,000 XLM</div>
            </div>
          </div>

          {/* ─── COL 2  (Portfolio / Chart) ─────────────────────────── */}
          <div style={{ ...card, minHeight: 380, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div style={label}>Net Account Value</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-0.03em', color: '#0a0a0f', lineHeight: 1, marginTop: 4 }}>$900,000.00</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', fontFamily: 'monospace', marginTop: 4 }}>7,500,000 XLM</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={label}>APY</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4, justifyContent: 'flex-end' }}>
                  <TrendingUp size={12} /> 4.12%
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ flex: 1, marginTop: 20, marginBottom: 20, minHeight: 110 }}>
              <svg viewBox="0 0 560 110" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(10,10,15,0.18)" />
                    <stop offset="100%" stopColor="rgba(10,10,15,0)" />
                  </linearGradient>
                </defs>
                <path d={AREA_PATH} fill="url(#spark-fill)" />
                <polyline
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={POLYLINE}
                />
              </svg>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <div style={{ ...label, marginBottom: 2 }}>APY</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Accumulated Data</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'monospace', color: '#0a0a0f' }}>900,000 XLM</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: 'monospace', color: '#6b7280', marginTop: 2 }}>7,500,000,000 XLM</div>
              </div>
            </div>
          </div>

          {/* ─── COL 3 ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Basket Allocation */}
            <div style={card}>
              <div style={{ ...label, marginBottom: 14 }}>Basket Allocation</div>

              {([
                { symbol: 'USDC', pct: 28.7 },
                { symbol: 'XLM', pct: 100 },
              ] as const).map(({ symbol, pct }) => (
                <div key={symbol} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#0a0a0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800 }}>
                        {symbol[0]}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0a0a0f' }}>{symbol}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: '#0a0a0f' }}>{symbol === 'XLM' ? '464.00%' : '28.70%'}</span>
                  </div>
                  <div style={{ height: 26, borderRadius: 999, background: '#f3f4f6', padding: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#374151,#0a0a0f)', width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Interaction Control */}
            <div style={card}>
              <div style={{ ...label, marginBottom: 14 }}>Interaction Control</div>

              {/* Tab switcher */}
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 16, padding: 3, marginBottom: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
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
                      transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                      background: activeTab === t ? '#0a0a0f' : 'transparent',
                      color: activeTab === t ? '#fff' : '#6b7280',
                      boxShadow: activeTab === t ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Amount display */}
              <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 16, padding: '14px 16px', textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'monospace', color: '#0a0a0f', letterSpacing: '-0.03em' }}>$225,000.00</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>Limit: $450,000.00 Available</div>
              </div>

              {/* Percentage pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                {[25, 50, 75, 100].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPct(p)}
                    style={{
                      padding: '7px 0',
                      border: selectedPct === p ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                      borderRadius: 12,
                      background: selectedPct === p ? '#f3f4f6' : '#fff',
                      color: selectedPct === p ? '#0a0a0f' : '#6b7280',
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
                  background: '#0a0a0f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  transition: 'background 0.15s',
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

/* ─────────── shared style objects ─────────────────────────────────────── */
const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.07)',
  borderRadius: 24,
  padding: 22,
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
};

const label: React.CSSProperties = {
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#9ca3af',
};
