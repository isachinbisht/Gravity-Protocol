'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, Wallet } from 'lucide-react';
import { useGravityProtocol } from '@/hooks/useGravityProtocol';

const NAV_LINKS = [
  { label: 'Dashboard',     href: '/' },
  { label: 'Fund Explorer', href: '/explore' },
  { label: 'Create Fund',   href: '/create' },
];

export function Navbar() {
  const gp       = useGravityProtocol();
  const pathname = usePathname();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(248,248,250,0.85)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      <nav style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 28px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            <Coins size={14} color="#fff" />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.02em' }}>
            Gravity Protocol
          </span>
        </Link>

        {/* Nav links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 2, listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    position: 'relative', display: 'block',
                    padding: '6px 14px', fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#0a0a0f' : '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  {link.label}
                  {active && (
                    <span style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#0a0a0f', borderRadius: 2 }} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right — network + wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Stellar Testnet badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563eb', display: 'inline-block', opacity: 0.85 }} />
            Stellar Testnet
          </div>

          {/* Wallet chip */}
          {gp.isConnected && gp.shortAddress ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 99, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', fontSize: '0.76rem', fontWeight: 600, color: '#0a0a0f', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', display: 'inline-block', flexShrink: 0 }} />
              {gp.shortAddress}
            </div>
          ) : (
            <button
              onClick={gp.connectWallet}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 99, background: '#0a0a0f', color: '#fff', border: 'none', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.18)', transition: 'background 0.15s' }}
            >
              <Wallet size={13} />
              {gp.isFreighterInstalled ? 'Connect Wallet' : 'Install Freighter'}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
