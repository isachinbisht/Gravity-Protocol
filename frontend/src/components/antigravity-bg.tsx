'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function AntigravityBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // loadSlim is ~80% smaller bundle than loadFull and supports all features we need
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Memoize options so the Particles component never re-renders unnecessarily
  const options = useMemo(() => ({
    background: {
      color: { value: "#ffffff" },
    },
    // Cap at 60fps — plenty smooth for a background, halves CPU load vs 120
    fpsLimit: 60,
    interactivity: {
      detectsOn: "window" as const,
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4,
          factor: 5,   // much lower than 100 — avoids heavy physics bursts
          speed: 1,
          maxSpeed: 20,
        },
      },
    },
    particles: {
      color: { value: "#3b82f6" },
      move: {
        enable: true,
        direction: "top" as const,
        random: true,
        speed: { min: 0.2, max: 0.8 },
        straight: false,
        outModes: { default: "out" as const },
      },
      number: {
        // Density-based capping with a hard limit of 60 particles
        density: { enable: true, width: 1200, height: 1200 },
        value: 60,
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        // Disable animation — each animated particle adds per-frame CPU work
        animation: { enable: false },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1.5, max: 4 },
      },
    },
    // Disable retina doubling — cuts rendering work in half on HiDPI screens
    detectRetina: false,
  }), []);

  if (!init) {
    return <div className="fixed inset-0 z-[-1] bg-white" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-auto z-[-1]">
      <Particles
        id="tsparticles"
        options={options}
      />
    </div>
  );
}
