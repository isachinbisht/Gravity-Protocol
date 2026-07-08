'use client';

import { motion } from 'framer-motion';

export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft diffused light blob — top-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: '-20%', left: '-10%',
          background: 'radial-gradient(circle, rgba(180,200,255,0.30) 0%, rgba(200,220,255,0.10) 50%, transparent 75%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, 60, -40, 0], y: [0, -80, 60, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Soft diffused light blob — bottom-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          bottom: '-15%', right: '-8%',
          background: 'radial-gradient(circle, rgba(210,185,255,0.25) 0%, rgba(230,210,255,0.08) 50%, transparent 75%)',
          filter: 'blur(70px)',
        }}
        animate={{ x: [0, -70, 50, 0], y: [0, 80, -60, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Centre subtle warm fill */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          top: '30%', left: '35%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.20) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.12, 0.92, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
