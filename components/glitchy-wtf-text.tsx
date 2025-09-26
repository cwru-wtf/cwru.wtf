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
  const [displayText, setDisplayText] = useState(meanings[0])
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchProgress, setGlitchProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setGlitchProgress(0)
      
      const nextIndex = (currentIndex + 1) % meanings.length
      const currentMeaning = meanings[currentIndex]
      const nextMeaning = meanings[nextIndex]
      const maxLength = Math.max(currentMeaning.length, nextMeaning.length)
      
      let progress = 0
      const glitchInterval = setInterval(() => {
        progress += 1
        setGlitchProgress(progress)
        
        // Create text that gradually transitions from left to right
        const transitionText = Array.from({ length: maxLength }, (_, i) => {
          if (i < progress - 3) {
            // Already transitioned - show final character
            return nextMeaning[i] || ''
          } else if (i < progress) {
            // Currently transitioning - show glitch
            if (currentMeaning[i] === ' ' || nextMeaning[i] === ' ') return ' '
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          } else {
            // Not yet reached - show original character
            return currentMeaning[i] || ''
          }
        }).join('')
        
        setDisplayText(transitionText)
        
        if (progress > maxLength + 3) {
          clearInterval(glitchInterval)
          setCurrentIndex(nextIndex)
          setDisplayText(nextMeaning)
          setIsGlitching(false)
          setGlitchProgress(0)
        }
      }, 80)
    }, 4000)

    return () => clearInterval(interval)
  }, [currentIndex])

  const getCharColor = (index: number, char: string) => {
    if (!isGlitching) {
      // When not glitching, use theme colors distributed across characters
      const colorIndex = index % 3
      return colorIndex === 0 ? 'text-green-400' : 
             colorIndex === 1 ? 'text-pink-500' : 'text-yellow-500'
    }
    
    if (index < glitchProgress - 3) {
      // Completed transition - use theme colors in order
      const colorIndex = index % 3
      return colorIndex === 0 ? 'text-green-400' : 
             colorIndex === 1 ? 'text-pink-500' : 'text-yellow-500'
    } else if (index < glitchProgress) {
      // Currently glitching - cycle through colors rapidly
      const colors = ['text-red-400', 'text-cyan-400', 'text-purple-400']
      return colors[Math.floor(Math.random() * colors.length)]
    } else {
      // Not yet reached - use theme colors for static state too
      const colorIndex = index % 3
      return colorIndex === 0 ? 'text-green-400' : 
             colorIndex === 1 ? 'text-pink-500' : 'text-yellow-500'
    }
  }

  return (
    <motion.p 
      className="mt-6 text-xl text-gray-300 font-mono"
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
      <span className="text-gray-300">
        . A collective of CWRU students building the future (or just building cool stuff).
      </span>
    </motion.p>
  )
}
