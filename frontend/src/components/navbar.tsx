'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Dashboard',     href: '/dashboard' },
  { label: 'Fund Explorer', href: '/explore' },
  { label: 'Create Fund',   href: '/create' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'transparent',
      borderBottom: 'none',
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        {/* Left section: Logo + Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={20}
              height={32}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              priority
            />
          </Link>

          {/* Nav links */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: 24, listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_LINKS.map(link => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      position: 'relative', display: 'block',
                      fontSize: '0.95rem',
                      fontWeight: 400,
                      color: active ? '#ffffff' : '#888888',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = active ? '#ffffff' : '#888888')}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right — Developers Action */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            href="/dashboard"
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, 
              padding: '10px 16px', 
              background: '#111111', 
              color: '#ffffff', 
              textDecoration: 'none',
              fontSize: '0.75rem', 
              fontWeight: 600, 
              letterSpacing: '0.05em',
              transition: 'background 0.2s',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#222')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
          >
            LAUNCH APP <ExternalLink size={14} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
