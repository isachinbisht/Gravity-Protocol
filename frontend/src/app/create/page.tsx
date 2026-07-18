'use client';

import React, { useState } from 'react';
import { ShieldCheck, Rocket, Coins } from 'lucide-react';
import AntigravityBackground from '@/components/antigravity-bg';
import { Navbar } from '@/components/navbar';

export default function CreateFundWizard() {
  const [fundName,   setFundName]   = useState('');
  const [xlmWeight,  setXlmWeight]  = useState(50);
  const usdcWeight = 100 - xlmWeight;
  const [fee,        setFee]        = useState(2.0);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Deploying Fund: ${fundName || 'Untitled Fund'}\n` +
      `Allocations: ${xlmWeight}% XLM / ${usdcWeight}% USDC\n` +
      `Fee: ${fee}%\n` +
      `(UI Demo — Backend not yet connected)`,
    );
  };

  return (
    <div className="app-shell" style={{ position: 'relative' }}>
      <AntigravityBackground />
      <Navbar />

      {/* ── slider thumb styles injected once ──────────────────────── */}
      <style>{`
        .gp-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; border-radius: 99px;
          outline: none; cursor: pointer;
        }
        .gp-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #0a0a0f; border: 2.5px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.28); cursor: pointer;
        }
        .gp-slider::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: #0a0a0f; border: 2.5px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.28); cursor: pointer;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 28px 120px' }}>

        {/* ── Page header ─────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.28)' }}>
              <Coins size={18} color="var(--bg-void)" />
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.05 }}>
            Deploy a New Vault.
          </h1>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Create a permissionless on-chain fund — set assets, weights &amp; fee tier.
          </p>
        </div>

        {/* ── Form ────────────────────────────────────────────────── */}
        <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Step 1 — Vault Details */}
          <div style={card}>
            <StepBadge n={1} />
            <div style={{ marginTop: 4 }}>
              <div style={sectionTitle}>Vault Details</div>
              <p style={sectionDesc}>Give your vault a unique, memorable name.</p>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={fieldLabel}>Vault Name</div>
              <input
                type="text"
                value={fundName}
                onChange={e => setFundName(e.target.value)}
                placeholder="e.g. Yield Maximizer XLM"
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  marginTop: 8,
                  padding: '13px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-outer)',
                  borderRadius: 14,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border 0.15s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => (e.target.style.border = '1px solid #d1d5db')}
                onBlur={e => (e.target.style.border = '1px solid #f3f4f6')}
              />
            </div>
          </div>

          {/* Step 2 — Allocations */}
          <div style={card}>
            <StepBadge n={2} />
            <div style={{ marginTop: 4 }}>
              <div style={sectionTitle}>Target Allocations</div>
              <p style={sectionDesc}>
                Set the initial asset weights. The smart contract rebalances automatically to maintain this ratio.
              </p>
            </div>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* XLM bar */}
              <AllocationBar symbol="XLM" letter="X" pct={xlmWeight} />

              {/* Range slider */}
              <div style={{ padding: '4px 0 2px' }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={xlmWeight}
                  onChange={e => setXlmWeight(Number(e.target.value))}
                  className="gp-slider"
                  style={{
                    background: `linear-gradient(to right, #0a0a0f 0%, #0a0a0f ${xlmWeight}%, rgba(0,0,0,0.1) ${xlmWeight}%, rgba(0,0,0,0.1) 100%)`,
                  }}
                />
                {/* Tick labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  {[0, 25, 50, 75, 100].map(v => (
                    <span key={v} style={{ fontSize: '0.6rem', fontWeight: 600, color: '#d1d5db', fontFamily: 'monospace' }}>{v}%</span>
                  ))}
                </div>
              </div>

              {/* USDC bar */}
              <AllocationBar symbol="USDC" letter="U" pct={usdcWeight} />
            </div>

            {/* Oracle notice */}
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-outer)', borderRadius: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ShieldCheck size={15} style={{ color: 'var(--text-primary)', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', lineHeight: 1.6, textTransform: 'uppercase' }}>
                Prices monitored via the on-chain Reflector oracle. Swaps execute automatically through the Stellar DEX.
              </p>
            </div>
          </div>

          {/* Step 3 — Performance Fee */}
          <div style={card}>
            <StepBadge n={3} />
            <div style={{ marginTop: 4 }}>
              <div style={sectionTitle}>Performance Fee</div>
              <p style={sectionDesc}>Charged only on withdrawal profits, not on principal.</p>
            </div>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Numeric input */}
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={fee}
                  onChange={e => setFee(Number(e.target.value))}
                  style={{
                    width: 96,
                    padding: '13px 36px 13px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-outer)',
                    borderRadius: 14,
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.border = '1px solid #d1d5db')}
                  onBlur={e => (e.target.style.border = '1px solid #f3f4f6')}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', pointerEvents: 'none' }}>%</span>
              </div>

              {/* Quick preset buttons */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[0.5, 1, 2, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFee(v)}
                    style={{
                      padding: '7px 12px',
                      border: fee === v ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                      borderRadius: 10,
                      background: fee === v ? '#0a0a0f' : '#fff',
                      color: fee === v ? '#fff' : '#6b7280',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            {/* Fee bar visualiser */}
            <div style={{ marginTop: 16, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 99,
                  background: 'linear-gradient(90deg,#374151,#0a0a0f)',
                  width: `${Math.min((fee / 20) * 100, 100)}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: '0.58rem', fontWeight: 600, color: '#d1d5db' }}>0%</span>
              <span style={{ fontSize: '0.58rem', fontWeight: 600, color: '#d1d5db' }}>20% max</span>
            </div>
          </div>

          {/* Review summary */}
          {fundName && (
            <div style={{ padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-outer)', borderRadius: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 4 }}>Review</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{fundName}</div>
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <Stat label="XLM" value={`${xlmWeight}%`} />
                <Stat label="USDC" value={`${usdcWeight}%`} />
                <Stat label="Fee" value={`${fee}%`} />
              </div>
            </div>
          )}

          {/* Deploy button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px 0',
              background: 'var(--text-primary)',
              color: 'var(--bg-void)',
              border: 'none',
              borderRadius: 18,
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
              marginTop: 4,
              transition: 'background 0.15s, transform 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a2e')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0f')}
          >
            <Rocket size={14} />
            Deploy Smart Contract
          </button>
        </form>
      </main>
    </div>
  );
}

/* ─────────── sub-components ──────────────────────────────────────────── */

function StepBadge({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 9, background: 'var(--text-primary)', color: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
        {n}
      </div>
    </div>
  );
}

function AllocationBar({ symbol, letter, pct }: { symbol: string; letter: string; pct: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800 }}>
            {letter}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{symbol}</span>
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{pct}%</span>
      </div>
      <div style={{ height: 26, borderRadius: 999, background: 'rgba(255,255,255,0.1)', padding: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div
          style={{
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg,#374151,#0a0a0f)',
            width: `${Math.max(pct, 0)}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ─────────── shared styles ───────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-outer)',
  borderRadius: 24,
  padding: 24,
  boxShadow: 'var(--shadow-card)', backdropFilter: 'blur(24px)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: 'var(--text-primary)',
  marginTop: 2,
};

const sectionDesc: React.CSSProperties = {
  fontSize: '0.68rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginTop: 4,
  lineHeight: 1.5,
};

const fieldLabel: React.CSSProperties = {
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
};
