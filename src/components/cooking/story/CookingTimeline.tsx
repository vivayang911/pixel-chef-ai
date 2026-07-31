import { motion } from 'framer-motion'
import { COOKING_EVENTS } from '@/engine/cookingEngine'
import type { CookingEventType } from '@/engine/cookingEngine'

interface CookingTimelineProps {
  phase: string
  progress: number // 0–1
  firedEvents: CookingEventType[]
}

const PHASES = [
  { key: 'heat', label: 'HEAT', icon: '🔥' },
  { key: 'sizzle', label: 'SIZZLE', icon: '🥘' },
  { key: 'season', label: 'SEASON', icon: '🧂' },
  { key: 'finish', label: 'FINISH', icon: '🍽' },
]

/** Visual cooking timeline showing which stage we're in + event markers. */
export default function CookingTimeline({ phase, progress, firedEvents }: CookingTimelineProps) {
  const currentIdx = PHASES.findIndex((p) => p.key === phase)

  return (
    <div className="flex items-center gap-1">
      {PHASES.map((p, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const eventForPhase =
          i < firedEvents.length ? COOKING_EVENTS.find((e) => e.id === firedEvents[i]) : null

        return (
          <div key={p.key} className="flex flex-1 items-center gap-1">
            {/* Phase dot */}
            <div className="relative flex flex-col items-center gap-1">
              <motion.div
                animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`flex h-7 w-7 items-center justify-center border-2 border-ink ${
                  done ? 'bg-mint text-ink' : active ? 'bg-cheese text-ink' : 'bg-ink-line text-cream/40'
                }`}
              >
                <span className="text-xs">{p.icon}</span>
              </motion.div>
              <span className={`font-pixel text-[6px] ${active ? 'text-cheese' : done ? 'text-mint/70' : 'text-cream/30'}`}>
                {p.label}
              </span>
              {/* Event marker dot */}
              {eventForPhase && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 left-full ml-0.5 h-1.5 w-1.5 bg-tomato"
                  title={eventForPhase.title}
                />
              )}
            </div>
            {/* Connector line */}
            {i < PHASES.length - 1 && (
              <div className="h-1 flex-1 overflow-hidden bg-ink-line">
                <motion.div
                  className="h-full bg-mint"
                  style={{ width: done ? '100%' : active ? `${progress * 100}%` : '0%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
