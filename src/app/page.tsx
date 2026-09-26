'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import HexTextAnimation from '@/components/HexAnimation/HexAnimation';
import Background from '@/components/Background/Background';
import Procedural3D from '@/components/Procedural3D/Procedural3D';
import { formatSFTime } from '@/components/Procedural3D/sky/sunPosition';
import type { LoadProgress } from '@/components/Procedural3D/types';
import './styles/background.css';
import './styles/landing.css';

// Keep the loader up at least this long so fast machines don't just flash it.
const MIN_LOADING_MS = 800;

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('INIT RENDER');
  const [sceneReady, setSceneReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sfTime, setSfTime] = useState('');
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  const handleProgress = useCallback((p: LoadProgress) => {
    setProgress(Math.round(p.value * 100));
    setStage(p.stage);
  }, []);

  const handleReady = useCallback(() => {
    setProgress(100);
    setSceneReady(true);
  }, []);

  // Once the scene is ready, wait out the minimum time, then show the page.
  useEffect(() => {
    if (!sceneReady) return;
    const elapsed = performance.now() - mountedAt.current;
    const timeout = setTimeout(() => setLoaded(true), Math.max(0, MIN_LOADING_MS - elapsed) + 300);
    return () => clearTimeout(timeout);
  }, [sceneReady]);

  // San Francisco clock, matching the sky being rendered.
  useEffect(() => {
    if (!loaded) return;
    const tick = () => setSfTime(formatSFTime(new Date()));
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <div>
      <Background />
      <Procedural3D onProgress={handleProgress} onReady={handleReady} />
      <div className="landing-hero">
        {!loaded ? (
          <div className="loading-screen">
            <p className="loading-label">{stage}</p>
            <div className="loading-bar-track">
              <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-percent">{progress}%</p>
          </div>
        ) : (
          <div className="landing-content landing-panel" data-augmented-ui="tl-clip br-clip border">
            <p className="landing-name">Aditya Sen</p>
            <div className="landing-tag-container" data-augmented-ui="bl-clip-y tr-clip-y border">
              <HexTextAnimation text="Graphics & Rendering Engineer" className="landing-tag mb-0" duration={2} />
            </div>
            <Link href="/aditya" className="enter-button">
              Enter
              <span className="enter-button-arrow">&rarr;</span>
            </Link>
            {sfTime && <p className="landing-time">SAN FRANCISCO · {sfTime}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
