import { motion, AnimatePresence } from 'framer-motion'
import type { CookingEventDef } from '@/engine/cookingEngine'
import { useLanguage } from '@/i18n/LanguageContext'
import { generateCookingAdvice } from '@/engine/aiChefEngine'

interface CookingEventProps {
  event: CookingEventDef | null
  onFix?: () => void
  showActions?: boolean
}

/** Overlay event popup: emoji + title + AI chef message, with optional FIX button. */
export default function CookingEvent({ event, onFix, showActions = false }: CookingEventProps) {
  const { lang } = useLanguage()

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key="event-card"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          className="pointer-events-auto absolute bottom-28 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="w-80 border-4 border-ink bg-ink-panel px-5 py-4 shadow-pixel text-center">
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              {event.emoji}
            </motion.span>
            <h3 className="mt-1 font-pixel text-[10px] text-cream">{event.title}</h3>

            {/* AI Chef message */}
            <div className="mt-2 rounded border border-cheese/20 bg-cheese/5 px-3 py-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm">🤖</span>
                <span className="font-pixel text-[8px] text-cheese">AI CHEF</span>
              </div>
              <p className="font-terminal text-base leading-relaxed text-cream/80">
                {event.aiMessage}
              </p>
            </div>

            {/* Action buttons when showActions is true */}
            {showActions && onFix && (
              <div className="mt-3 flex gap-2">
                <motion.button
                  onClick={onFix}
                  className="flex-1 cursor-pointer border-2 border-mint bg-mint/10 px-3 py-2 font-pixel text-[10px] text-mint shadow-pixel-sm hover:bg-mint/20 active:scale-95"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ✅ FIX IT
                </motion.button>
                <motion.button
                  className="flex-1 cursor-pointer border-2 border-cream/20 bg-cream/5 px-3 py-2 font-pixel text-[10px] text-cream/50 shadow-pixel-sm hover:bg-cream/10 active:scale-95"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  CONTINUE
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
