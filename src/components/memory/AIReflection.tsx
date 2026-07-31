import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'

interface AIReflectionProps {
  /** Full AI reflection text; it will be typed out character by character. */
  text: string
  /** Called when the typewriter finishes (to stagger downstream animations). */
  onComplete?: () => void
}

const CHARS_PER_TICK = 3

/** PIXEL's reflective diary entry — typewriter animation mimicking AI writing a diary. */
export default function AIReflection({ text, onComplete }: AIReflectionProps) {
  const { t } = useLanguage()
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += CHARS_PER_TICK
      if (i >= text.length) {
        setDisplayed(text)
        setDone(true)
        clearInterval(id)
        onComplete?.()
      } else {
        setDisplayed(text.slice(0, i))
      }
    }, 35)
    return () => clearInterval(id)
  }, [text, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className="relative mx-auto w-full max-w-xl border-4 border-ink bg-cream/10 px-6 py-5 shadow-pixel"
    >
      {/* Bookmark tab */}
      <div className="absolute -top-0.5 right-6 h-0 w-0 border-b-[14px] border-l-[10px] border-r-[10px] border-b-ink border-l-transparent border-r-transparent" />

      {/* Pixel journal lines */}
      <div className="pointer-events-none absolute inset-x-4 bottom-2 top-10 flex flex-col gap-[11px] opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="block h-px bg-cream" />
        ))}
      </div>

      {/* Date header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="font-pixel text-[7px] text-cheese/70">{t('diary.title')}</span>
        <span className="h-px flex-1 bg-ink-line" />
      </div>

      {/* Typing text */}
      <p className="relative font-sans text-sm leading-relaxed text-cream/90">
        {displayed}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity }}
            className="ml-0.5 inline-block h-4 w-1.5 bg-cheese align-middle"
          />
        )}
      </p>

      {/* Stamp when complete */}
      {done && (
        <motion.div
          initial={{ opacity: 0, rotate: -12, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 220 }}
          className="absolute -bottom-2 -right-2 rotate-6 border-2 border-ink bg-mint px-2.5 py-0.5"
        >
          <span className="font-terminal text-[8px] text-ink">{t('diary.saved')}</span>
        </motion.div>
      )}
    </motion.div>
  )
}
