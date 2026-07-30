import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SpeechBubbleProps {
  text: string
  /** Seconds to wait before the typewriter starts. */
  startDelay?: number
}

/** Pixel speech bubble with a typewriter reveal and a blinking cursor. */
export default function SpeechBubble({ text, startDelay = 1.4 }: SpeechBubbleProps) {
  const [shown, setShown] = useState('')
  const [active, setActive] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setActive(true), startDelay * 1000)
    return () => clearTimeout(t)
  }, [startDelay])

  useEffect(() => {
    if (!active) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 26)
    return () => clearInterval(id)
  }, [active, text])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 220, damping: 18 }}
      className="relative max-w-md border-4 border-ink bg-cream px-4 py-3 text-ink shadow-pixel"
    >
      <p className="font-sans text-sm leading-relaxed sm:text-base">
        {shown}
        {!done && (
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-tomato align-middle" />
        )}
      </p>
      {/* Speech tail */}
      <span className="absolute -bottom-3 left-8 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-ink" />
    </motion.div>
  )
}
