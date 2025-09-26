"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const meanings = [
  "We Tinker Fearlessly",
  "Wow! That's Fuego",
  "Wow! That's Fire",
  "We Transcend Fiction"
]

export default function WtfMeanings() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % meanings.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-auto mt-12 max-w-lg text-center">
      <h3 className="font-mono text-xl font-bold text-white">WTF means:</h3>
      <div className="relative h-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="text-2xl font-bold">
              <span className="text-green-400">{meanings[currentIndex].split(" ")[0]}</span>{" "}
              <span className="text-pink-500">{meanings[currentIndex].split(" ")[1]}</span>{" "}
              <span className="text-yellow-500">{meanings[currentIndex].split(" ")[2]}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
