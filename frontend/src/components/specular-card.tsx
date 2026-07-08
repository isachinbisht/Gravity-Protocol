'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SpecularCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export function SpecularCard({ children, className = '', delay = 0, style }: SpecularCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);

  // White specular spotlight — light refracting off polished glass
  const specularBg = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(360px circle at ${x}px ${y}px, rgba(255,255,255,0.50), rgba(255,255,255,0.06) 65%, transparent 100%)`
  );

  // Edge border ring brightening on cursor proximity
  const borderLight = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(180px circle at ${x}px ${y}px, rgba(255,255,255,0.95), transparent 70%)`
  );

  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect();
      mouseX.set(width / 2);
      mouseY.set(height / 2);
    }
  }, [mouseX, mouseY]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const onMouseLeave = () => {
    if (!cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set(width / 2);
    mouseY.set(height / 2);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      whileHover={{
        scale: 1.01,
        boxShadow:
          '0 4px 10px rgba(0,0,0,0.07), 0 24px 64px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,1)',
      }}
      className={`card ${className}`}
      // Merge external layout style (gridColumn, gridRow, minHeight…) with card base styles
      style={style}
    >
      {/* White specular glare plane */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] mix-blend-overlay"
        style={{ background: specularBg, zIndex: 1 }}
      />

      {/* Edge luminous border ring */}
      <motion.div
        className="absolute pointer-events-none rounded-[inherit]"
        style={{
          inset: -1,
          zIndex: 2,
          backgroundImage: borderLight,
          maskImage: 'linear-gradient(#fff,#fff)',
          WebkitMaskImage: 'linear-gradient(#fff,#fff)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          border: '1px solid transparent',
          opacity: 0.55,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col" style={{ zIndex: 10 }}>
        {children}
      </div>
    </motion.div>
  );
}
