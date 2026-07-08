'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Activity, CheckCircle } from 'lucide-react';

import LiquidBackground  from '@/components/liquid-background';
import { SpecularCard }  from '@/components/specular-card';
import PortfolioCard     from '@/components/portfolio-card';
import AllocationCard    from '@/components/allocation-card';
import InteractionCard   from '@/components/interaction-card';

interface Toast { id: string; message: string; }

const XLM_RATE = 0.12; // 1 XLM = $0.12 USD

export default function Dashboard() {
  const [usdcUsd,   setUsdcUsd]   = useState(450_000);
  const [xlmUsd,    setXlmUsd]    = useState(300_000);
  const [stakedUsd, setStakedUsd] = useState(150_000);
  const [yieldALE]                = useState(382.40);
  const [history,   setHistory]   = useState([865000, 872000, 862000, 880000, 876000, 882000, 900000]);
  const [toasts,    setToasts]    = useState<Toast[]>([]);

  const totalUsd = usdcUsd + xlmUsd + stakedUsd;

  const pushToast = (message: string) => {
    const id = `t-${Date.now()}`;
    setToasts((p) => [...p, { id, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  const handleAction = (action: 'deposit' | 'withdraw', amount: number) => {
    const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    if (action === 'deposit') {
      setUsdcUsd((p) => p - amount);
      setStakedUsd((p) => p + amount);
      setHistory((p) => { const l = p[p.length - 1]; return [...p.slice(1), l + 3.2]; });
      pushToast(`Deposited ${fmt} into Staked Yield Pool`);
    } else {
      setUsdcUsd((p) => p + amount);
      setStakedUsd((p) => p - amount);
      setHistory((p) => { const l = p[p.length - 1]; return [...p.slice(1), l - 1.8]; });
      pushToast(`Released ${fmt} to liquid wallet`);
    }
  };

  const tvlXLM = (totalUsd / XLM_RATE).toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="app-shell">
      <LiquidBackground />

      {/* ─── Navbar ─── */}
      <header className="navbar">
        <nav className="navbar-inner">
          <a className="nav-logo" href="#">
            <span className="nav-logo-icon">
              <Coins size={14} color="#fff" />
            </span>
            <span className="nav-logo-text">Gravity Protocol</span>
          </a>

          <ul className="nav-links">
            {['Dashboard', 'Assets', 'Liquidity', 'Stellar Bridge'].map((l) => (
              <li key={l}>
                <a className={`nav-link ${l === 'Dashboard' ? 'active' : ''}`}>{l}</a>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <div className="network-badge" style={{ display: 'flex' }}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="3" fill="#2563eb" opacity="0.8"/>
                <circle cx="7" cy="7" r="6" stroke="#2563eb" strokeWidth="1.2" opacity="0.3"/>
              </svg>
              Stellar Mainnet
            </div>
            <div className="wallet-chip">
              <span
                className="wallet-avatar"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
              />
              GB7A...6N2T
            </div>
          </div>
        </nav>
      </header>

      {/* ─── Main ─── */}
      <main className="main-content">

        {/* Page header */}
        <div className="page-header">
          <div className="page-header-left">
            <motion.h1
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1,  y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              Stellar Asset Core
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1,  y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.08 }}
            >
              Decentralized yield generation and asset management platform.
              <br />TVL: {tvlXLM} XLM
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1,  y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.14 }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
              style={{
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(0,0,0,0.07)',
                color: 'var(--text-secondary)',
              }}
            >
              <Activity size={11} style={{ color: '#16a34a' }} />
              Ledger #48,219,892
            </div>
          </motion.div>
        </div>

        {/* ─── Asymmetric Bento Grid ─── */}
        {/*
          Desktop: [  Card A (8 cols)  ] [ Card B ]
                   [  Card A (8 cols)  ] [ Card C ]
          Mobile: A, B, C stacked
        */}
        <div className="bento-grid mt-6" style={{ alignItems: 'start' }}>

          {/* Card A — Portfolio (8 cols, 2 row span) */}
          <SpecularCard
            delay={0.06}
            style={{ gridColumn: 'span 8', gridRow: 'span 2', minHeight: 460 }}
          >
            <PortfolioCard
              usdBalance={totalUsd}
              xlmRate={XLM_RATE}
              historyData={history}
              yieldAPY={8.45}
              yieldEarned={yieldALE}
            />
          </SpecularCard>

          {/* Card B — Allocation (4 cols) */}
          <SpecularCard delay={0.14} style={{ gridColumn: 'span 4', minHeight: 220 }}>
            <AllocationCard
              xlmBalanceUsd={xlmUsd}
              usdcBalanceUsd={usdcUsd}
              xlmAmount={xlmUsd / XLM_RATE}
              usdcAmount={usdcUsd}
            />
          </SpecularCard>

          {/* Card C — Interaction (4 cols) */}
          <SpecularCard delay={0.22} style={{ gridColumn: 'span 4' }}>
            <InteractionCard
              usdcBalanceUsd={usdcUsd}
              stakedBalanceUsd={stakedUsd}
              onAction={handleAction}
            />
          </SpecularCard>
        </div>
      </main>

      {/* ─── Toast Notifications ─── */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,   y: -16, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className="toast success"
            >
              <CheckCircle size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
