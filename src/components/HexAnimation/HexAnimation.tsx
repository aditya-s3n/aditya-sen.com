"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"



interface HexTextAnimationProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export default function HexTextAnimation({ text, className = "", delay = 0, duration = 5 }: HexTextAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true }) // triggers only once

  const hexChars = "0123456789ABCDEF"
  const getRandomHexChar = () => hexChars[Math.floor(Math.random() * hexChars.length)]

  useEffect(() => {
    if (!isInView) return // don't start until visible

    const startTimer = setTimeout(() => {
      const totalDuration = duration * 1000
      const timePerChar = totalDuration / text.length
      const cyclesPerChar = 8
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
          const randomChar = currentChar === " " ? " " : getRandomHexChar()
          setDisplayText(
            revealedPart +
              randomChar +
              remainingPart
                .split("")
                .map((char) => (char === " " ? " " : getRandomHexChar()))
                .join("")
          )
          cycleCount++
        } else {
          setDisplayText(
            revealedPart +
              currentChar +
              remainingPart
                .split("")
                .map((char) => (char === " " ? " " : getRandomHexChar()))
                .join("")
          )
          currentCharIndex++
          cycleCount = 0
        }

        setTimeout(animateChar, cycleSpeed)
      }

      animateChar()
    }, delay * 1000)

    return () => clearTimeout(startTimer)
  }, [text, delay, duration, isInView])

  return (
    <>
      <motion.h1
        ref={ref}
        className={`hex-text ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
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
