"use client"

import { useEffect, useState } from "react"
import "./cyber.css";

export default function EnhancedGlitchBackground() {
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchRects, setGlitchRects] = useState<
    Array<{ id: number; x: number; y: number; width: number; height: number }>
  >([])

  const leftText = [
    "0xA3F2B1",
    "PROTOCOL",
    "0x7E9C4D",
    "SYSTEM",
    "0x1B8F3A",
    "ACCESS",
    "0x9D2E7F",
    "DATA",
    "0x4C8A1E",
    "NETWORK",
    "0x6F3B9C",
    "SECURE",
    "0x2A7E4B",
    "MATRIX",
    "0x8C1F5D",
    "CYBER",
    "0x3E9A7C",
    "NODE",
    "0x5B2D8F",
    "LINK",
  ]

  const rightText = [
    "0xF4A8C2",
    "TERMINAL",
    "0x3D7B9E",
    "BUFFER",
    "0x8E4F1A",
    "STREAM",
    "0x1C9A5F",
    "PACKET",
    "0x7A3E8D",
    "SOCKET",
    "0x4F8B2C",
    "THREAD",
    "0x9C5A1E",
    "KERNEL",
    "0x2E7F4B",
    "DAEMON",
    "0x6D1A8F",
    "PROXY",
    "0xB3E7C4",
    "SHELL",
  ]

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchActive(true)

        const rects = Array.from({ length: Math.floor(Math.random() * 25) + 20 }, (_, i) => ({
          id: i,
          x: Math.random() < 0.5 ? Math.random() * 15 : 85 + Math.random() * 15,
          y: Math.random() * 100,
          width: Math.random() * 60 + 40,
          height: Math.random() * 0.8 + 0.2,
        }))
        setGlitchRects(rects)

        setTimeout(
          () => {
            setGlitchActive(false)
            setGlitchRects([])
          },
          Math.random() * 600 + 200,
        )
      },
      Math.random() * 2000 + 4000,
    )

    return () => {
      clearInterval(glitchInterval)
    }
  }, [glitchActive])

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
          animation: ${glitchActive ? "screen-shake-intense 0.4s ease-in-out, background-glitch-intense 0.4s ease-in-out" : "none"};
          transition: none;
        }

        .left-edge-line {
          position: absolute;
          left: 10px;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(252, 114, 101, 0.3) 10%,
            rgba(252, 114, 101, 0.6) 50%,
            rgba(252, 114, 101, 0.3) 90%,
            transparent 100%
          );
          box-shadow: 0 0 4px rgba(252, 114, 101, 0.4);
          animation: ${glitchActive ? "line-glitch 0.3s ease-in-out" : "line-pulse 3s infinite ease-in-out"};
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
          animation: ${glitchActive ? "glass-intense-glitch 0.3s ease-in-out" : "glass-shimmer 8s infinite ease-in-out"};
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
          animation: ${glitchActive ? "scanlines-intense-glitch 0.3s ease-in-out" : "none"};
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
          animation: ${glitchActive ? "grid-intense-glitch 0.3s ease-in-out" : "grid-flicker 3s infinite ease-in-out"};
        }

        .digital-noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
          animation: ${glitchActive ? "noise-intense-glitch 0.1s infinite steps(10)" : "noise-glitch 0.5s infinite steps(10)"};
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
          animation: ${glitchActive ? "rgb-shift-intense 0.3s ease-in-out" : "none"};
          opacity: ${glitchActive ? 0.8 : 0.1};
          transition: opacity 0.05s ease;
        }

        .color-shift-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg,
            rgba(255, 0, 0, 0.05),
            rgba(0, 255, 0, 0.05),
            rgba(0, 0, 255, 0.05),
            rgba(255, 255, 0, 0.05)
          );
          opacity: ${glitchActive ? 0.3 : 0};
          animation: ${glitchActive ? "color-shift-intense 0.2s infinite" : "none"};
          mix-blend-mode: screen;
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

        
      `}</style>

      <div className="cyber-bg">
        <div className="left-edge-line"></div>

        <div className="protocol-text">v.1.0.2</div>

        <div className="side-text left">
          {leftText.map((text, index) => (
            <span key={index}>{text}</span>
          ))}
        </div>

        <div className="side-text right">
          {rightText.map((text, index) => (
            <span key={index}>{text}</span>
          ))}
        </div>

        <div className="glass-overlay"></div>
        <div className="scan-lines"></div>
        <div className="grid-pattern"></div>
        <div className="digital-noise"></div>
        <div className="screen-distortion"></div>
        <div className="color-shift-overlay"></div>

        <div className="glitch-overlay">
          <div className="glitch-bars">
            <div className="glitch-bar" style={{ top: "15%", animationDelay: "0s" }}></div>
            <div className="glitch-bar" style={{ top: "35%", animationDelay: "0.05s" }}></div>
            <div className="glitch-bar" style={{ top: "55%", animationDelay: "0.1s" }}></div>
            <div className="glitch-bar" style={{ top: "75%", animationDelay: "0.15s" }}></div>
            <div className="glitch-bar" style={{ top: "85%", animationDelay: "0.08s" }}></div>
          </div>

          <div className="glitch-rectangles">
            {glitchRects.map((rect) => (
              <div
                key={rect.id}
                className="glitch-rect"
                style={{
                  left: `${rect.x}%`,
                  top: `${rect.y}%`,
                  width: `${rect.width}%`,
                  height: `${rect.height}%`,
                  animationDelay: `${rect.id * 0.02}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
