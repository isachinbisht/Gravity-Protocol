'use client';

import React from 'react';

export default function AntigravityBackground() {
  // Generate a random spray of colorful dots radiating from center-left
  const particles = React.useMemo(() => {
    const arr = [];
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b'];
    
    for (let i = 0; i < 150; i++) {
      // Create a burst pattern from x=20% y=50%
      const angle = (Math.random() - 0.5) * Math.PI; // -90 to 90 degrees
      const radius = Math.random() * 60 + 5; // 5vw to 65vw
      
      const x = 20 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius * 1.5; // Stretch vertically
      
      const size = Math.random() * 2 + 1; // 1 to 3px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.max(0.1, 1 - (radius / 65)); // fade out at edges
      
      arr.push({ id: i, x, y, size, color, opacity });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fafafa]">
      {/* Subtle radial gradient to brighten the center slightly */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)'
        }}
      />
      
      {/* Particle effect */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
