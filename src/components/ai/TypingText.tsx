import { useState, useEffect, useRef } from 'react'

interface TypingTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

/** Reveals characters one-by-one with a blinking cursor. */
export default function TypingText({
  text,
  speed = 40,
  className = '',
  onComplete,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    if (!text) {
      setDone(true)
      onComplete?.()
      return
    }

    const interval = setInterval(() => {
      indexRef.current += 1
      setDisplayed(text.slice(0, indexRef.current))

      if (indexRef.current >= text.length) {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-[1px] animate-pulse align-middle" />
      )}
    </span>
  )
}
