import { motion, AnimatePresence } from 'framer-motion'
import type { CookingEventDef } from '@/engine/cookingEngine'

interface CookingEventProps {
  event: CookingEventDef | null
}

/** Overlay event popup: emoji + title + AI message, fades in/out. */
export default function CookingEvent({ event }: CookingEventProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key="event-card"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          className="pointer-events-none absolute bottom-28 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="w-72 border-4 border-ink bg-ink-panel px-5 py-4 shadow-pixel text-center">
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              {event.emoji}
            </motion.span>
            <h3 className="mt-1 font-pixel text-[10px] text-cream">{event.title}</h3>
            <p className="mt-2 font-terminal text-base text-cream/80">{event.aiMessage}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
