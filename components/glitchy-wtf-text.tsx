"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const meanings = [
  "We Tinker Fearlessly",
  "Wow! That's Fuego",
  "Wow! That's Fire",
  "We Transcend Fiction"
]

const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~01010101"

export default function GlitchyWtfText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isGlitching, setIsGlitching] = useState(true)
  const [glitchProgress, setGlitchProgress] = useState(0)
  const [hasMounted, setHasMounted] = useState(false)

  // Glitch transition logic extracted for reuse
  const startGlitch = (fromIndex: number, toIndex: number) => {
    setIsGlitching(true)
    setGlitchProgress(0)

    const currentMeaning = meanings[fromIndex]
    const nextMeaning = meanings[toIndex]
    const maxLength = Math.max(currentMeaning.length, nextMeaning.length)

    let progress = 0
    const glitchInterval = setInterval(() => {
      progress += 1
      setGlitchProgress(progress)

      const transitionText = Array.from({ length: maxLength }, (_, i) => {
        if (i < progress - 3) {
          return nextMeaning[i] || ''
        } else if (i < progress) {
          if (currentMeaning[i] === ' ' || nextMeaning[i] === ' ') return ' '
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          return currentMeaning[i] || ''
        }
      }).join('')

      setDisplayText(transitionText)

      if (progress > maxLength + 3) {
        clearInterval(glitchInterval)
        setCurrentIndex(toIndex)
        setDisplayText(nextMeaning)
        setIsGlitching(false)
        setGlitchProgress(0)
      }
    }, 80)
  }

  // Immediately glitch on mount: from empty string to first meaning
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true)
      // Build up first meaning from "nothing" with glitch chars
      const target = meanings[0]
      let progress = 0
      setIsGlitching(true)
      const glitchInterval = setInterval(() => {
        progress += 1
        setGlitchProgress(progress)

        const transitionText = Array.from({ length: target.length }, (_, i) => {
          if (i < progress - 3) {
            return target[i] || ''
          } else if (i < progress) {
            if (target[i] === ' ') return ' '
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          } else {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }
        }).join('')

        setDisplayText(transitionText)

        if (progress > target.length + 3) {
          clearInterval(glitchInterval)
          setDisplayText(target)
          setIsGlitching(false)
          setGlitchProgress(0)
        }
      }, 60)
    }
  }, [hasMounted])

  // Cycle through meanings after initial mount
  useEffect(() => {
    if (!hasMounted) return

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % meanings.length
      startGlitch(currentIndex, nextIndex)
    }, 4000)

    return () => clearInterval(interval)
  }, [currentIndex, hasMounted])

  const getCharColor = (index: number, char: string) => {
    if (!isGlitching) {
      const colorIndex = index % 3
      return colorIndex === 0 ? 'text-green-500' :
             colorIndex === 1 ? 'text-pink-500' : 'text-yellow-500'
    }

    if (index < glitchProgress - 3) {
      const colorIndex = index % 3
      return colorIndex === 0 ? 'text-green-500' :
             colorIndex === 1 ? 'text-pink-500' : 'text-yellow-500'
    } else if (index < glitchProgress) {
      const colors = ['text-red-500', 'text-cyan-600', 'text-purple-600']
      return colors[Math.floor(Math.random() * colors.length)]
    } else {
      const colorIndex = index % 3
      return colorIndex === 0 ? 'text-green-500' :
             colorIndex === 1 ? 'text-pink-500' : 'text-yellow-500'
    }
  }

  return (
    <motion.p
      className="text-6xl text-muted-foreground font-mono"
      animate={isGlitching ? {
        x: [0, -0.5, 0.5, 0],
      } : {}}
      transition={{ duration: 0.1, repeat: isGlitching ? Infinity : 0 }}
    >
      <span className="font-bold">
        {displayText.split('').map((char, index) => (
          <span
            key={index}
            className={`transition-colors duration-100 ${getCharColor(index, char)} ${
              isGlitching && index >= glitchProgress - 3 && index < glitchProgress
                ? 'glitch-text'
                : ''
            }`}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.p>
  )
}
