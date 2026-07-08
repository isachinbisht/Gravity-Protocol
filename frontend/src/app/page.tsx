'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Activity, CheckCircle, AlertCircle, Wallet } from 'lucide-react';

import LiquidBackground  from '@/components/liquid-background';
import { SpecularCard }  from '@/components/specular-card';
import PortfolioCard     from '@/components/portfolio-card';
import AllocationCard    from '@/components/allocation-card';
import InteractionCard   from '@/components/interaction-card';
import { useGravityProtocol } from '@/hooks/useGravityProtocol';

const XLM_RATE = 0.12; // 1 XLM = $0.12 USD (used for display only until price oracle is live)

export default function Dashboard() {
  const gp = useGravityProtocol();

  // ── Derived display values ──────────────────────────────────────────────────
  // When NAV is live from chain we use it; otherwise fall back to share-based estimate
  const totalUsd   = gp.navUsd > 0 ? gp.navUsd : gp.vaultShares; // placeholder until oracle
  const xlmUsd     = totalUsd * (gp.xlmWeight  / 100);
  const usdcUsd    = totalUsd * (gp.usdcWeight / 100);
  const stakedUsd  = xlmUsd; // staked portion = XLM allocation
  const tvlXLM     = (totalUsd / XLM_RATE).toLocaleString('en-US', { maximumFractionDigits: 0 });

  // Mock sparkline history (grows each time data refreshes)
  const history = [865000, 872000, 862000, 880000, 876000, 882000, totalUsd > 0 ? totalUsd : 900000];

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
            {/* Stellar network badge */}
            <div className="network-badge" style={{ display: 'flex' }}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="3" fill="#2563eb" opacity="0.8"/>
                <circle cx="7" cy="7" r="6" stroke="#2563eb" strokeWidth="1.2" opacity="0.3"/>
              </svg>
              Stellar Testnet
            </div>

            {/* Wallet chip — shows connect button or address */}
            {gp.isConnected && gp.shortAddress ? (
              <div className="wallet-chip">
                <span className="wallet-avatar"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
                />
                {gp.shortAddress}
              </div>
            ) : (
              <button
                onClick={gp.connectWallet}
                className="wallet-chip"
                style={{ cursor: 'pointer' }}
              >
                <Wallet size={14} />
                {gp.isFreighterInstalled ? 'Connect Wallet' : 'Install Freighter'}
              </button>
            )}
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
              <Activity
                size={11}
                className={gp.isLoadingData ? 'animate-pulse' : ''}
                style={{ color: gp.isLoadingData ? '#f59e0b' : '#16a34a' }}
              />
              {gp.isLoadingData ? 'Syncing with Stellar...' : 'Live · Soroban RPC'}
            </div>
          </motion.div>
        </div>

        {/* ─── Freighter not installed banner ─── */}
        <AnimatePresence>
          {!gp.isFreighterInstalled && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1,  y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm"
              style={{
                background: 'rgba(245,158,11,0.07)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: '#92400e',
              }}
            >
              <AlertCircle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span className="text-xs font-semibold">
                Freighter wallet extension is not installed.{' '}
                <a href="https://freighter.app" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  Install Freighter
                </a>{' '}
                to interact with the Gravity Protocol contracts on Stellar.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Asymmetric Bento Grid ─── */}
        <div className="bento-grid mt-6" style={{ alignItems: 'start' }}>

          {/* Card A — Portfolio (8 cols, 2 row span) */}
          <SpecularCard
            delay={0.06}
            style={{ gridColumn: 'span 8', gridRow: 'span 2', minHeight: 460 }}
          >
            <PortfolioCard
              usdBalance={totalUsd > 0 ? totalUsd : 900_000}
              xlmRate={XLM_RATE}
              historyData={history}
              yieldAPY={8.45}
              yieldEarned={gp.vaultShares}
            />
          </SpecularCard>

          {/* Card B — Allocation (4 cols) */}
          <SpecularCard delay={0.14} style={{ gridColumn: 'span 4', minHeight: 220 }}>
            <AllocationCard
              xlmBalanceUsd={xlmUsd > 0 ? xlmUsd : 300_000}
              usdcBalanceUsd={usdcUsd > 0 ? usdcUsd : 450_000}
              xlmAmount={(xlmUsd > 0 ? xlmUsd : 300_000) / XLM_RATE}
              usdcAmount={usdcUsd > 0 ? usdcUsd : 450_000}
            />
          </SpecularCard>

          {/* Card C — Interaction (4 cols) */}
          <SpecularCard delay={0.22} style={{ gridColumn: 'span 4' }}>
            <InteractionCard
              usdcBalanceUsd={usdcUsd > 0 ? usdcUsd : 450_000}
              stakedBalanceUsd={stakedUsd > 0 ? stakedUsd : 150_000}
              txStatus={gp.txStatus}
              txHash={gp.txHash}
              explorerUrl={gp.explorerUrl}
              txError={gp.txError}
              isConnected={gp.isConnected}
              onDeposit={gp.deposit}
              onWithdraw={gp.withdraw}
              onConnectWallet={gp.connectWallet}
            />
          </SpecularCard>
        </div>
      </main>

      {/* ─── Global Transaction Toast ─── */}
      <AnimatePresence>
        {(gp.txStatus === 'success' || gp.txStatus === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,   y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="fixed bottom-7 right-7 z-50"
          >
            <div
              className="toast"
              style={{
                borderColor: gp.txStatus === 'success'
                  ? 'rgba(22,163,74,0.3)'
                  : 'rgba(220,38,38,0.3)',
              }}
            >
              {gp.txStatus === 'success'
                ? <CheckCircle size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                : <AlertCircle size={15} style={{ color: '#dc2626', flexShrink: 0 }} />
              }
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {gp.txStatus === 'success' ? 'Transaction Confirmed' : 'Transaction Failed'}
                </span>
                {gp.explorerUrl && (
                  <a
                    href={gp.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium"
                    style={{ color: '#2563eb', textDecoration: 'underline' }}
                  >
                    View on Stellar Expert →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
