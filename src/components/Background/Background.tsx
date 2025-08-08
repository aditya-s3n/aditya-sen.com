"use client"

import { useEffect, useState } from "react"
import "./cyber.css";

export default function CyberpunkBackground() {
  const [scanlinePosition, setScanlinePosition] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev >= 100 ? 0 : prev + 0.3))
    }, 30)

    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), Math.random() * 300 + 150)
    }, Math.random() * 3000 + 7000) // 3-10 seconds between glitches

    return () => {
      clearInterval(scanlineInterval)
      clearInterval(glitchInterval)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        .cyber-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          background: linear-gradient(135deg, #321214 0%, #07090E 100%);
          animation: ${glitchActive ? "screen-shake 0.3s ease-in-out, hue-shift 0.3s ease-in-out" : "none"};
        }

        .glass-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 25% 25%, rgba(89, 238, 244, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(252, 114, 101, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(239, 64, 64, 0.04) 0%, transparent 70%),
            linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0%, transparent 50%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(1px) brightness(1.1) contrast(1.05);
          border: 1px solid rgba(89, 238, 244, 0.1);
          animation: ${glitchActive ? "glass-glitch 0.3s ease-in-out" : "glass-shimmer 8s infinite ease-in-out"};
        }

        .glass-reflection {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 20%,
              transparent 80%,
              rgba(252, 114, 101, 0.05) 100%
            ),
            linear-gradient(45deg,
              transparent 40%,
              rgba(255, 255, 255, 0.03) 50%,
              transparent 60%
            );
          animation: ${glitchActive ? "reflection-glitch 0.3s ease-in-out" : "glass-shimmer 8s infinite ease-in-out"};
        }

        .scan-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(252, 114, 101, 0.03) 1px,
            rgba(252, 114, 101, 0.03) 2px,
            transparent 2px,
            transparent 4px
          );
          opacity: 0.6;
          animation: ${glitchActive ? "scanlines-glitch 0.3s ease-in-out" : "none"};
        }

        .moving-scanline {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(252, 114, 101, 0.3),
            rgba(252, 114, 101, 0.8),
            rgba(252, 114, 101, 0.3),
            transparent
          );
          top: ${scanlinePosition}%;
          box-shadow:
            0 0 20px rgba(252, 114, 101, 0.5),
            0 0 40px rgba(252, 114, 101, 0.3),
            0 0 60px rgba(252, 114, 101, 0.1);
          animation: ${glitchActive ? "scanline-glitch 0.3s ease-in-out" : "scanline-pulse 1.5s ease-in-out infinite alternate"};
        }

        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(252, 114, 101, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(252, 114, 101, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.7;
          animation: ${glitchActive ? "grid-glitch 0.3s ease-in-out" : "grid-flicker 3s infinite ease-in-out"};
        }

        .glitch-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: ${glitchActive ? 1 : 0};
          transition: opacity 0.05s ease;
        }

        .digital-noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
          animation: ${glitchActive ? "noise-intense-glitch 0.15s infinite steps(10)" : "noise-glitch 0.5s infinite steps(10)"};
        }

        .screen-distortion {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(90deg,
              rgba(252, 114, 101, 0.02) 0%,
              transparent 50%,
              rgba(89, 238, 244, 0.02) 100%
            );
          animation: ${glitchActive ? "rgb-shift-subtle 0.3s ease-in-out" : "none"};
          opacity: ${glitchActive ? 0.6 : 0.1};
          transition: opacity 0.05s ease;
        }
      `}</style>

      <div className="cyber-bg">
        <div className="glass-overlay"></div>
        <div className="glass-reflection"></div>
        <div className="scan-lines"></div>
        <div className="moving-scanline"></div>
        <div className="grid-pattern"></div>
        <div className="digital-noise"></div>
        <div className="screen-distortion"></div>

        <div className="glitch-overlay">
          <div className="glitch-bars">
            <div className="glitch-bar"></div>
            <div className="glitch-bar"></div>
            <div className="glitch-bar"></div>
          </div>
        </div>
      </div>
    </>
  )
}
