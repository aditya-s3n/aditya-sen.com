"use client"

import { useEffect, useState } from "react"

import "./cyber.css";

export default function Background() {
  const [scanlinePosition, setScanlinePosition] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev >= 100 ? 0 : prev + 0.3))
    }, 30)

    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), Math.random() * 300 + 100)
    }, Math.random() * 5000 + 3000)

    return () => {
      clearInterval(scanlineInterval)
      clearInterval(glitchInterval)
    }
  }, [])

  return (
    <>
      <style jsx>{`
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
          animation: scanline-pulse 1.5s ease-in-out infinite alternate;
        }

        .glitch-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: ${glitchActive ? 1 : 0};
          transition: opacity 0.1s ease;
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
              transparent 33%, 
              rgba(89, 238, 244, 0.02) 66%, 
              transparent 100%
            );
          animation: rgb-shift 2s infinite ease-in-out;
          opacity: ${glitchActive ? 0.8 : 0.2};
          transition: opacity 0.1s ease;
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
