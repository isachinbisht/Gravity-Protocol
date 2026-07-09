'use client';

import React from 'react';

interface AllocationCardProps {
  xlmBalanceUsd:  number;
  usdcBalanceUsd: number;
  xlmAmount:      number;
  usdcAmount:     number;
}

const ASSETS = [
  { symbol: 'USDC', letter: 'U', key: 'usdc' as const },
  { symbol: 'XLM',  letter: 'X', key: 'xlm'  as const },
];

export default function AllocationCard({ xlmBalanceUsd, usdcBalanceUsd }: AllocationCardProps) {
  const total   = xlmBalanceUsd + usdcBalanceUsd || 1;
  const pcts    = { usdc: (usdcBalanceUsd / total) * 100, xlm: (xlmBalanceUsd / total) * 100 };
  const fmtUSD  = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  const vals    = { usdc: usdcBalanceUsd, xlm: xlmBalanceUsd };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <span style={label}>Basket Allocation</span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
        {ASSETS.map(a => {
          const pct = pcts[a.key];
          const val = vals[a.key];
          return (
            <div key={a.key}>
              {/* Label row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#0a0a0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800, flexShrink: 0 }}>
                    {a.letter}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a0a0f' }}>{a.symbol}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: '#0a0a0f' }}>{pct.toFixed(0)}%</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 500, color: '#9ca3af', marginLeft: 6 }}>{fmtUSD(val)}</span>
                </div>
              </div>
              {/* Bar */}
              <div style={{ height: 26, borderRadius: 999, background: '#f3f4f6', padding: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#374151,#0a0a0f)', width: `${pct}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#9ca3af',
};
