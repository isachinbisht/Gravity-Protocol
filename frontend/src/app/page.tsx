'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle, RefreshCcw, TrendingUp, Wallet, ArrowRight, ExternalLink } from 'lucide-react';

import AntigravityBackground from '@/components/antigravity-bg';
import { Navbar }            from '@/components/navbar';
import PortfolioCard         from '@/components/portfolio-card';
import AllocationCard        from '@/components/allocation-card';
import InteractionCard       from '@/components/interaction-card';
import { useGravityProtocol } from '@/hooks/useGravityProtocol';

const XLM_RATE = 0.12;

export default function Dashboard() {
  const gp = useGravityProtocol();

  const totalUsd  = gp.navUsd > 0 ? gp.navUsd : gp.vaultShares || 900_000;
  const xlmUsd    = totalUsd * (gp.xlmWeight  / 100);
  const usdcUsd   = totalUsd * (gp.usdcWeight / 100);
  const stakedUsd = xlmUsd;
  const tvlXLM    = (totalUsd / XLM_RATE).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const history   = [865000, 872000, 862000, 880000, 876000, 882000, totalUsd];

  return (
    <div style={{ background: '#f8f8fa', minHeight: '100vh', position: 'relative' }}>
      <AntigravityBackground />
      <Navbar />

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 28px 100px' }}>

        {/* ── Page header ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingTop: 20 }}>
          <div>
            <div style={labelStyle}>Gravity Protocol · Dashboard</div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0a0a0f', marginTop: 6, lineHeight: 1.05 }}>
              Stellar Asset Core
            </h1>
            <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af', marginTop: 6 }}>
              Decentralized yield generation &amp; asset management · TVL: {tvlXLM} XLM
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, paddingTop: 4 }}>
            {/* Live status pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Activity size={11} style={{ color: gp.isLoadingData ? '#f59e0b' : '#16a34a' }} />
              {gp.isLoadingData ? 'Syncing with Stellar...' : 'Live · Soroban RPC'}
            </div>
            {/* Rebalance button */}
            <button
              onClick={() => alert('Rebalance triggered! (UI Demo)')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 99, background: '#0a0a0f', color: '#fff', border: 'none', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
            >
              <RefreshCcw size={11} />
              Trigger Rebalance
            </button>
          </div>
        </div>

        {/* ── Freighter banner ─────────────────────────────────────── */}
        <AnimatePresence>
          {!gp.isFreighterInstalled && (
            <motion.div
              key="freighter-banner"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 16, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 20 }}
            >
              <AlertCircle size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#92400e' }}>
                Freighter wallet extension is not installed.{' '}
                <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Install Freighter</a>
                {' '}to interact with the Gravity Protocol contracts on Stellar.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bento Grid ───────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto', gap: 16, alignItems: 'start' }}>

          {/* Portfolio card — left, spans 2 rows */}
          <div style={{ ...card, gridRow: 'span 2', minHeight: 460 }}>
            <PortfolioCard
              usdBalance={totalUsd}
              xlmRate={XLM_RATE}
              historyData={history}
              yieldAPY={8.45}
              yieldEarned={gp.vaultShares}
            />
          </div>

          {/* Allocation card — top right */}
          <div style={{ ...card, minHeight: 220 }}>
            <AllocationCard
              xlmBalanceUsd={xlmUsd  > 0 ? xlmUsd  : 300_000}
              usdcBalanceUsd={usdcUsd > 0 ? usdcUsd : 450_000}
              xlmAmount={(xlmUsd > 0 ? xlmUsd : 300_000) / XLM_RATE}
              usdcAmount={usdcUsd > 0 ? usdcUsd : 450_000}
            />
          </div>

          {/* Interaction card — bottom right */}
          <div style={card}>
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
          </div>
        </div>
      </main>

      {/* ── Toast ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {(gp.txStatus === 'success' || gp.txStatus === 'error') && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,   y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 50 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderRadius: 16, background: '#fff', border: `1px solid ${gp.txStatus === 'success' ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: 360 }}>
              {gp.txStatus === 'success'
                ? <CheckCircle size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                : <AlertCircle  size={15} style={{ color: '#dc2626', flexShrink: 0 }} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0a0a0f' }}>
                  {gp.txStatus === 'success' ? 'Transaction Confirmed' : 'Transaction Failed'}
                </span>
                {gp.explorerUrl && (
                  <a href={gp.explorerUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.65rem', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 3 }}>
                    View on Stellar Expert <ExternalLink size={10} />
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

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.07)',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#9ca3af',
};
