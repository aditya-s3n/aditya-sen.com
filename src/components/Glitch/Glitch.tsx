'use client';

import { useEffect, useState } from 'react';
import styles from './Glitch.module.css';

const INTRO_DELAY_MS = 200;
const BURST_MS = 660; // matches the animation length in Glitch.module.css

type GlitchProps = {
  text: string;
  minGap?: number; // seconds between glitches, picked at random in [minGap, maxGap]
  maxGap?: number;
  onMount?: boolean; // also glitch as soon as the text appears
};

// Text that tears into colour-shifted slices at random moments
export default function Glitch({ text, minGap = 3, maxGap = 10, onMount = false }: GlitchProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setTimeout>;

    const schedule = (delay = (minGap + Math.random() * (maxGap - minGap)) * 1000) => {
      timer = setTimeout(() => {
        setActive(true);
        timer = setTimeout(() => {
          setActive(false);
          schedule();
        }, BURST_MS);
      }, delay);
    };

    schedule(onMount ? INTRO_DELAY_MS : undefined);
    return () => clearTimeout(timer);
  }, [minGap, maxGap, onMount]);

  return (
    <span className={`${styles.glitch} ${active ? styles.active : ''}`} data-text={text}>
      {text}
    </span>
  );
}
