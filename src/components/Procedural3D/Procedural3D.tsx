'use client';

import styles from "./Procedrual3D.module.css";
import { useEffect, useRef, useState } from "react";
import type { Engine } from "./engine/Engine";
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

export default function Procedural3D({ onProgress, onReady, timeOverride }: Procedural3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const [visible, setVisible] = useState(false);

    // Keep the latest props without restarting the engine when they change.
    const latest = useRef({ onProgress, onReady, timeOverride });
    useEffect(() => {
        latest.current = { onProgress, onReady, timeOverride };
    }, [onProgress, onReady, timeOverride]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let disposed = false;
        let engine: Engine | null = null;

        (async () => {
            try {
                // Dynamic import keeps three.js out of the server bundle and off
                // the critical path; it downloads while the loading screen shows.
                const { Engine } = await import('./engine/Engine');
                if (disposed) return;
                const options = readUrlOptions();
                // A time from props (debug dropdown) wins over ?time=.
                if (latest.current.timeOverride !== undefined) options.timeOverride = latest.current.timeOverride;
                engine = new Engine(container, options);
                await engine.init((p) => latest.current.onProgress?.(p));
                if (disposed) return;
                engine.start();
                engineRef.current = engine;
                setVisible(true);
                latest.current.onReady?.();
            } catch (error) {
                if (disposed) return; // unmounted mid-init, nothing to report
                // No WebGL (or a crash): let the landing page show over the CSS background.
                console.warn('Procedural3D: falling back to static background', error);
                latest.current.onReady?.();
            }
        })();

        return () => {
            disposed = true;
            engineRef.current = null;
            engine?.dispose();
        };
    }, []);

    // Live time changes, e.g. from the debug dropdown.
    useEffect(() => {
        if (timeOverride !== undefined) engineRef.current?.setTimeOverride(timeOverride);
    }, [timeOverride]);

    return (
        <div
            ref={containerRef}
            className={`${styles.canvas} ${visible ? styles.visible : ''}`}
            aria-hidden="true"
        />
    );
}
