'use client';

import { useEffect, useState } from 'react';
import HexTextAnimation from '@/components/HexAnimation/HexAnimation';
import Background from '@/components/Background/Background';
import './styles/background.css';
import './styles/landing.css';

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const durationMs = 1800;
    let frame: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLoaded(true), 300);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div>
      <Background />
      <div className="landing-hero">
        {!loaded ? (
          <div className="loading-screen" data-augmented-ui="tl-clip br-clip border">
            <p className="loading-label">INITIALIZING RENDERER</p>
            <div className="loading-bar-track">
              <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-percent">{progress}%</p>
          </div>
        ) : (
          <div className="landing-content">
            <p className="landing-name">Aditya Sen</p>
            <div className="landing-tag-container" data-augmented-ui="bl-clip-y tr-clip-y border">
              <HexTextAnimation text="Graphics & Rendering Engineer" className="landing-tag mb-0" duration={2} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
