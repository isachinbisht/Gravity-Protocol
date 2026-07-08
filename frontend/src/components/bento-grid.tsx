'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="bento-grid">
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({ children, className = '', delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ 
        y: -5,
        borderColor: "rgba(124, 88, 255, 0.25)",
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 30px 1px rgba(124, 88, 255, 0.08)"
      }}
      className={`card ${className}`}
    >
      {/* Light sweep effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_ease-in-out_infinite] pointer-events-none z-0" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}
