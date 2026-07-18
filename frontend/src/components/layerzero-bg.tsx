'use client';

import React, { useEffect, useRef } from 'react';

export default function LayerZeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const centerY = height * 0.65;
      const numLines = 45; // Increased line density
      
      // We'll draw lines that sweep from left to right, meeting in the middle, simulating the perspective of the image
      for (let i = 0; i < numLines; i++) {
        const progress = i / numLines;
        // Calculate offset from center for this line
        // Use an exponential curve so lines are denser in the middle
        const yOffset = (Math.pow(progress * 2 - 1, 3)) * (height * 0.7); 
        
        const y = centerY + yOffset;
        
        // Dynamic wave effect based on time (very subtle for LayerZero)
        const wave = Math.sin(time * 0.5 + progress * 8) * 12;

        ctx.beginPath();
        ctx.moveTo(0, y + wave);

        // We want the lines to converge tightly at the center x-axis, creating the "vanishing point" effect
        // To do this, we draw a curve from the edge to the center, then center to the other edge.
        
        // Left half to center point
        ctx.quadraticCurveTo(width * 0.35, y + wave, width * 0.5, centerY);
        // Right half from center point
        ctx.quadraticCurveTo(width * 0.65, y + wave, width, y + wave);

        // Styling the line
        // The lines in the middle are brighter
        const distanceToCenter = Math.abs(progress - 0.5);
        const opacity = 1 - Math.pow(distanceToCenter * 2, 0.5); 
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.02, opacity * 0.4)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Center bright flare
      const gradient = ctx.createRadialGradient(width / 2, centerY, 0, width / 2, centerY, 400);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.01;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
