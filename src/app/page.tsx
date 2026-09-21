'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HexTextAnimation from '@/components/HexAnimation/HexAnimation';
import Background from '@/components/Background/Background';
import './styles/background.css';
import './styles/landing.css';

const LOADING_MESSAGES = [
  'INIT RENDER',
  'COMPILING SHADERS',
  'BUILDING SCENE GRAPH',
  'GPU DRAW CALLS',
  'RASTERIZING IMAGE',
];

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const durationMs = 1500;
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

  const messageIndex = Math.min(
    LOADING_MESSAGES.length - 1,
    Math.floor((progress / 100) * LOADING_MESSAGES.length)
  );

  return (
    <div>
      <Background />
      <div className="landing-hero">
        {!loaded ? (
          <div className="loading-screen">
            <p className="loading-label">{LOADING_MESSAGES[messageIndex]}</p>
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
            <Link href="/aditya" className="enter-button">
              Enter
              <span className="enter-button-arrow">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
