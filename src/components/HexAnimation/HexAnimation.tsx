"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface HexTextAnimationProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export default function HexTextAnimation({ text, className = "", delay = 0, duration = 5 }: HexTextAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const hexChars = "0123456789ABCDEF"

  const getRandomHexChar = () => {
    return hexChars[Math.floor(Math.random() * hexChars.length)]
  }

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const totalDuration = duration * 1000 // Convert to milliseconds
      const timePerChar = totalDuration / text.length
      const cyclesPerChar = 8 // Number of hex characters to cycle through per letter
      const cycleSpeed = timePerChar / cyclesPerChar

      let currentCharIndex = 0
      let cycleCount = 0

      const animateChar = () => {
        if (currentCharIndex >= text.length) {
          setDisplayText(text)
          setIsComplete(true)
          return
        }

        const currentChar = text[currentCharIndex]
        const revealedPart = text.slice(0, currentCharIndex)
        const remainingPart = text.slice(currentCharIndex + 1)

        if (cycleCount < cyclesPerChar) {
          // Show random hex character for current position
          const randomChar = currentChar === " " ? " " : getRandomHexChar()
          setDisplayText(
            revealedPart +
              randomChar +
              remainingPart
                .split("")
                .map((char) => (char === " " ? " " : getRandomHexChar()))
                .join(""),
          )
          cycleCount++
        } else {
          // Reveal the actual character
          setDisplayText(
            revealedPart +
              currentChar +
              remainingPart
                .split("")
                .map((char) => (char === " " ? " " : getRandomHexChar()))
                .join(""),
          )
          currentCharIndex++
          cycleCount = 0
        }

        setTimeout(animateChar, cycleSpeed)
      }

      animateChar()
    }, delay * 1000)

    return () => clearTimeout(startTimer)
  }, [text, delay, duration])

  return (
    <>
      <style jsx>{`
        .hex-text {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
        }
        .hex-cursor {
          width: 4px;
          height: 2rem;
          background-color: currentColor;
          animation: blink 0.8s infinite alternate;
        }
        @keyframes blink {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <motion.h1
        className={`hex-text ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        {displayText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="hex-cursor d-inline-block ms-1"
          />
        )}
      </motion.h1>
    </>
  )
}
