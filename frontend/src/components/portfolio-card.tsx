'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface PortfolioCardProps {
  usdBalance:  number;
  xlmRate:     number;
  historyData: number[];
  yieldAPY:    number;
  yieldEarned: number;
}

export default function PortfolioCard({ usdBalance, xlmRate, historyData, yieldAPY, yieldEarned }: PortfolioCardProps) {
  const xlmBalance    = usdBalance / xlmRate;
  const changePercent = 5.24;

  /* ── sparkline ───────────────────────────────────────────────── */
  const W = 560, H = 120, pad = 10;
  const minV = Math.min(...historyData);
  const maxV = Math.max(...historyData);
  const range = maxV - minV || 1;

  const pts = historyData.map((v, i) => {
    const x = pad + (i / (historyData.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - minV) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `M ${pad},${H - pad} L ${pts.join(' L ')} L ${W - pad},${H - pad} Z`;

  const fmt    = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);
  const fmtXLM = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v) + ' XLM';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={label}>Net Account Value</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99, color: '#15803d', background: 'rgba(22,163,74,0.09)' }}>
          <TrendingUp size={11} /> +{changePercent}%
        </span>
      </div>

      {/* Balance */}
      <div>
        <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', fontFamily: 'monospace', color: '#0a0a0f', lineHeight: 1 }}>
          {fmt(usdBalance)}
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace', color: '#9ca3af', marginTop: 4 }}>
          {fmtXLM(xlmBalance)}
        </div>
      </div>

      {/* Sparkline */}
      <div style={{ flex: 1, marginTop: 20, marginBottom: 20, minHeight: 90 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="pg-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(10,10,15,0.15)" />
              <stop offset="100%" stopColor="rgba(10,10,15,0)"    />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#pg-area)" />
          <polyline fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
        </svg>
      </div>

      {/* Footer stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }}>
        {[
          { lbl: 'Yield Pool',    val: 'USDC Anchor' },
          { lbl: 'Staking APY',   val: `${yieldAPY.toFixed(2)}%` },
          { lbl: 'Accumulated',   val: `+${yieldEarned.toFixed(2)}` },
        ].map(({ lbl, val }, i) => (
          <div key={lbl} style={{ paddingLeft: i > 0 ? 16 : 0, paddingRight: 16, borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={label}>{lbl}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'monospace', color: '#0a0a0f' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#9ca3af',
};
