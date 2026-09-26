'use client';

import styles from "./Procedrual3D.module.css";
import { useEffect, useRef, useState } from "react";
import type { Procedural3DProps } from "./types";

/** Reads ?time=<ISO date> (preview another time of day) and ?debug (FPS panel). */
function readUrlOptions() {
    const params = new URLSearchParams(window.location.search);
    const time = params.get('time');
    const parsed = time ? new Date(time) : null;
    return {
        timeOverride: parsed && !Number.isNaN(parsed.getTime()) ? parsed : null,
        debug: params.has('debug'),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
}

export default function Procedural3D({ onProgress, onReady }: Procedural3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    // Keep the latest callbacks without restarting the engine when they change.
    const callbacks = useRef({ onProgress, onReady });
    useEffect(() => {
        callbacks.current = { onProgress, onReady };
    }, [onProgress, onReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let disposed = false;
        let engine: import('./engine/Engine').Engine | null = null;

        (async () => {
            try {
                // Dynamic import keeps three.js out of the server bundle and off
                // the critical path; it downloads while the loading screen shows.
                const { Engine } = await import('./engine/Engine');
                if (disposed) return;
                engine = new Engine(container, readUrlOptions());
                await engine.init((p) => callbacks.current.onProgress?.(p));
                if (disposed) return;
                engine.start();
                setVisible(true);
                callbacks.current.onReady?.();
            } catch (error) {
                if (disposed) return; // unmounted mid-init, nothing to report
                // No WebGL (or a crash): let the landing page show over the CSS background.
                console.warn('Procedural3D: falling back to static background', error);
                callbacks.current.onReady?.();
            }
        })();

        return () => {
            disposed = true;
            engine?.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${styles.canvas} ${visible ? styles.visible : ''}`}
            aria-hidden="true"
        />
    );
}
