"use client"

import { useState, useEffect } from "react"



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
  const getRandomHexChar = () => hexChars[Math.floor(Math.random() * hexChars.length)]

  useEffect(() => {
    let timer = setTimeout(() => {
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

        timer = setTimeout(animateChar, cycleSpeed)
      }

      animateChar()
    }, delay * 1000)

    // Clears whichever step is pending, so the animation stops on unmount.
    return () => clearTimeout(timer)
  }, [text, delay, duration])

  return (
    <>
      <h1 className={`hex-text ${className}`}>
        {displayText}
        {!isComplete && <span className="hex-cursor d-inline-block ms-1" />}
      </h1>
    </>
  )
}
