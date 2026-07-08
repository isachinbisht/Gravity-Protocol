'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface AllocationCardProps {
  xlmBalanceUsd: number;
  usdcBalanceUsd: number;
  xlmAmount: number;
  usdcAmount: number;
}

const assets = [
  {
    symbol: 'USDC',
    label: 'Stellar Anchor',
    dotColor: '#06b6d4',
    barFrom: '#2563eb',
    barTo: '#06b6d4',
    barShadow: 'rgba(37,99,235,0.35)',
    key: 'usdc',
  },
  {
    symbol: 'XLM',
    label: 'Stellar Native',
    dotColor: '#8b5cf6',
    barFrom: '#8b5cf6',
    barTo: '#ec4899',
    barShadow: 'rgba(139,92,246,0.35)',
    key: 'xlm',
  },
] as const;

export default function AllocationCard({
  xlmBalanceUsd,
  usdcBalanceUsd,
  xlmAmount,
  usdcAmount,
}: AllocationCardProps) {
  const total = xlmBalanceUsd + usdcBalanceUsd;
  const usdcPct = total > 0 ? (usdcBalanceUsd / total) * 100 : 60;
  const xlmPct  = total > 0 ? (xlmBalanceUsd  / total) * 100 : 40;

  const pcts: Record<string, number> = { usdc: usdcPct, xlm: xlmPct };
  const vals: Record<string, number> = { usdc: usdcBalanceUsd, xlm: xlmBalanceUsd };

  const fmtUSD = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-[0.12em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Basket Allocation
        </span>
        <Clock size={14} style={{ color: 'var(--text-muted)' }} />
      </div>

      {/* Capsule rows */}
      <div className="flex flex-col gap-5">
        {assets.map((a) => {
          const pct = pcts[a.key];
          const val = vals[a.key];

          return (
            <div key={a.key} className="flex flex-col gap-2">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                    style={{ background: a.dotColor, boxShadow: `0 0 6px ${a.dotColor}` }}
                  />
                  <span
                    className="text-sm font-bold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {a.symbol}
                  </span>
                </div>
                <span
                  className="text-sm font-bold tracking-tight font-mono"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {pct.toFixed(0)}%
                  <span
                    className="ml-1 text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ({fmtUSD(val)})
                  </span>
                </span>
              </div>

              {/* Thick rounded capsule track */}
              <div
                className="h-7 w-full rounded-full p-[3px] overflow-hidden"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.10), inset 0 -1px 0 rgba(255,255,255,0.8)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.3 }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, ${a.barFrom}, ${a.barTo})`,
                    boxShadow: `0 2px 10px ${a.barShadow}`,
                    minWidth: pct > 4 ? undefined : 0,
                  }}
                >
                  {/* Top sheen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent rounded-full" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
