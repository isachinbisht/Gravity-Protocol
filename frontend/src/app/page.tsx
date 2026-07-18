'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LayerZeroAnimation from '@/components/layerzero-bg';
import { Navbar } from '@/components/navbar';

export default function LandingPage() {
  return (
    <div style={{ background: '#000000', minHeight: '100vh', position: 'relative', overflow: 'hidden', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Background Canvas Animation */}
      <LayerZeroAnimation />

      {/* Navigation */}
      <Navbar />

      {/* Main Hero Content */}
      <main style={{ 
        position: 'relative', 
        zIndex: 10, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center'
      }}>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: '800px',
            marginBottom: '40px'
          }}
        >
          Decentralized asset management <br/> 
          <span style={{ color: '#888888' }}>for the Stellar network</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'inline-block',
              background: '#ffffff',
              color: '#000000',
              padding: '14px 28px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Learn More
          </Link>
        </motion.div>
        
      </main>
      
      {/* Soft gradient overlay at the top and bottom to blend with background if necessary */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20vh',
        background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20vh',
        background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
    </div>
  );
}
