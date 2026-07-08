'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface PortfolioCardProps {
  usdBalance: number;
  xlmRate: number;
  historyData: number[];
  yieldAPY: number;
  yieldEarned: number;
}

export default function PortfolioCard({
  usdBalance,
  xlmRate,
  historyData,
  yieldAPY,
  yieldEarned,
}: PortfolioCardProps) {
  const xlmBalance = usdBalance / xlmRate;
  const changePercent = 5.24;

  // SVG Sparkline
  const svgW = 560;
  const svgH = 110;
  const pad = 8;
  const minVal = Math.min(...historyData);
  const maxVal = Math.max(...historyData);
  const range = maxVal - minVal || 1;

  const pts = historyData.map((v, i) => {
    const x = pad + (i / (historyData.length - 1)) * (svgW - pad * 2);
    const y = svgH - pad - ((v - minVal) / range) * (svgH - pad * 2);
    return `${x},${y}`;
  });

  const polylinePoints = pts.join(' ');
  const areaPath = `M ${pad},${svgH - pad} L ${pts.join(' L ')} L ${svgW - pad},${svgH - pad} Z`;

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const fmtXLM = (v: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v) + ' XLM';

  return (
    <div className="h-full flex flex-col">

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-[10px] font-bold tracking-[0.12em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Net Account Value
        </span>
        <span
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ color: '#16a34a', background: 'rgba(22,163,74,0.10)' }}
        >
          <TrendingUp size={11} />
          +{changePercent}%
        </span>
      </div>

      {/* Big USD balance */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={usdBalance}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
        >
          <h2
            className="font-extrabold tracking-tighter font-mono leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--text-primary)' }}
          >
            {fmt(usdBalance)}
          </h2>
          <p
            className="text-base font-semibold tracking-tight font-mono mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {fmtXLM(xlmBalance)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Sparkline chart */}
      <div className="flex-1 my-4 relative min-h-[90px]">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(139,92,246,0.18)" />
              <stop offset="60%"  stopColor="rgba(37,99,235,0.07)" />
              <stop offset="100%" stopColor="rgba(37,99,235,0.00)" />
            </linearGradient>
            <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#8b5cf6" />
              <stop offset="50%"  stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Filled area */}
          <motion.path
            d={areaPath}
            fill="url(#area-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Crisp stroked line */}
          <motion.polyline
            fill="none"
            stroke="url(#line-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
          />
        </svg>
      </div>

      {/* Three-column footer stats */}
      <div
        className="grid grid-cols-3 pt-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        {[
          { label: 'Stellar Yield Pool', value: 'USDC Anchor' },
          { label: 'Staking APY',        value: `${yieldAPY.toFixed(2)}%` },
          { label: 'Accumulated ALE',    value: `+${yieldEarned.toFixed(2)}` },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            className={`px-4 flex flex-col gap-1 ${i > 0 ? 'border-l' : ''}`}
            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          >
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em]"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </span>
            <span
              className="text-xl font-extrabold tracking-tight font-mono"
              style={{ color: 'var(--text-primary)' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
