import { motion, AnimatePresence } from 'framer-motion'
import { useAICompanion } from '@/engine/aiCompanionContext'
import TypingText from '@/components/ai/TypingText'
import { playAIMessage } from '@/engine/audioEngine'
import type { AIMood } from '@/engine/aiChefEngine'
import { useEffect, useRef } from 'react'

/* ------------------------------------------------------------------ */
/*  Mood visual config                                                  */
/* ------------------------------------------------------------------ */

interface MoodVisuals {
  aura: string
  eyes: React.ReactNode
  mouth: React.ReactNode
  accessory: React.ReactNode | null
}

const MOOD_CONFIG: Record<AIMood, MoodVisuals> = {
  idle: {
    aura: 'from-stone-400/10 to-stone-400/0',
    eyes: (
      <g>
        <rect x="24" y="32" width="4" height="4" fill="#0d0b1f" />
        <rect x="36" y="32" width="4" height="4" fill="#0d0b1f" />
      </g>
    ),
    mouth: (
      <rect x="28" y="40" width="8" height="2" fill="#0d0b1f" rx="1" />
    ),
    accessory: null,
  },
  happy: {
    aura: 'from-cheese/20 to-cheese/0',
    eyes: (
      <g>
        <rect x="24" y="34" width="4" height="2" fill="#0d0b1f" rx="1" />
        <rect x="36" y="34" width="4" height="2" fill="#0d0b1f" rx="1" />
      </g>
    ),
    mouth: (
      <>
        <rect x="26" y="40" width="12" height="3" fill="#0d0b1f" rx="1" />
        <rect x="24" y="40" width="2" height="3" fill="#0d0b1f" rx="1" />
        <rect x="38" y="40" width="2" height="3" fill="#0d0b1f" rx="1" />
      </>
    ),
    accessory: null,
  },
  curious: {
    aura: 'from-mint/15 to-mint/0',
    eyes: (
      <g>
        <rect x="24" y="32" width="4" height="4" fill="#0d0b1f" />
        <rect x="36" y="30" width="5" height="5" fill="#0d0b1f" />
      </g>
    ),
    mouth: (
      <rect x="29" y="40" width="6" height="3" fill="#0d0b1f" rx="1.5" />
    ),
    accessory: (
      <motion.text
        x="46"
        y="30"
        fontSize="8"
        fill="#a78bfa"
        animate={{ opacity: [0.4, 1, 0.4], y: [30, 27, 30] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ fontFamily: 'monospace' }}
      >
        ?
      </motion.text>
    ),
  },
  thinking: {
    aura: 'from-grape/15 to-grape/0',
    eyes: (
      <g>
        <rect x="24" y="31" width="3" height="3" fill="#0d0b1f" />
        <rect x="37" y="33" width="3" height="3" fill="#0d0b1f" />
      </g>
    ),
    mouth: (
      <rect x="30" y="41" width="4" height="1.5" fill="#0d0b1f" rx="0.5" />
    ),
    accessory: (
      <g>
        <motion.circle
          cx="48" cy="28" r="2" fill="#c084fc"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        />
        <motion.circle
          cx="52" cy="26" r="1.5" fill="#c084fc"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
        />
        <motion.circle
          cx="50" cy="31" r="1" fill="#c084fc"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
        />
      </g>
    ),
  },
  focused: {
    aura: 'from-tomato/15 to-tomato/0',
    eyes: (
      <g>
        <rect x="23" y="33" width="4" height="2" fill="#0d0b1f" />
        <rect x="35" y="33" width="4" height="2" fill="#0d0b1f" />
      </g>
    ),
    mouth: (
      <rect x="28" y="41" width="8" height="1.5" fill="#0d0b1f" />
    ),
    accessory: (
      <motion.text
        x="45" y="30" fontSize="7" fill="#ef4444"
        animate={{ y: [30, 27, 30] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ fontFamily: 'monospace' }}
      >
        💧
      </motion.text>
    ),
  },
  warning: {
    aura: 'from-red/20 to-red/0',
    eyes: (
      <g>
        <rect x="23" y="31" width="5" height="5" fill="#0d0b1f" />
        <rect x="35" y="31" width="5" height="5" fill="#0d0b1f" />
      </g>
    ),
    mouth: (
      <rect x="27" y="40" width="10" height="4" fill="#0d0b1f" rx="2" />
    ),
    accessory: (
      <motion.text
        x="44" y="28" fontSize="10" fill="#f59e0b"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ fontFamily: 'monospace' }}
      >
        !
      </motion.text>
    ),
  },
  excited: {
    aura: 'from-cheese/25 to-cheese/0',
    eyes: (
      <g>
        <rect x="23" y="31" width="5" height="3" fill="#0d0b1f" />
        <rect x="35" y="31" width="5" height="3" fill="#0d0b1f" />
        <rect x="25" y="29" width="1" height="2" fill="#ffd700" />
        <rect x="28" y="30" width="1" height="1" fill="#ffd700" />
        <rect x="37" y="29" width="1" height="2" fill="#ffd700" />
        <rect x="40" y="30" width="1" height="1" fill="#ffd700" />
      </g>
    ),
    mouth: (
      <>
        <rect x="24" y="39" width="16" height="4" fill="#0d0b1f" rx="2" />
        <rect x="28" y="43" width="8" height="2" fill="#ff5277" rx="1" />
      </>
    ),
    accessory: (
      <g>
        <motion.text x="14" y="6" fontSize="8" fill="#ffd700"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ fontFamily: 'monospace' }}
        >✨</motion.text>
        <motion.text x="44" y="8" fontSize="8" fill="#ffd700"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
          style={{ fontFamily: 'monospace' }}
        >✨</motion.text>
      </g>
    ),
  },
  celebrate: {
    aura: 'from-cheese/30 via-pink/20 to-cheese/30',
    eyes: (
      <g>
        <rect x="23" y="31" width="5" height="3" fill="#0d0b1f" />
        <rect x="35" y="31" width="5" height="3" fill="#0d0b1f" />
        <rect x="25" y="28" width="2" height="2" fill="#ffd700" />
        <rect x="28" y="29" width="1" height="1" fill="#ffd700" />
        <rect x="37" y="28" width="2" height="2" fill="#ffd700" />
        <rect x="40" y="29" width="1" height="1" fill="#ffd700" />
      </g>
    ),
    mouth: (
      <>
        <rect x="24" y="39" width="16" height="5" fill="#0d0b1f" rx="2" />
        <rect x="27" y="44" width="10" height="2" fill="#ff5277" rx="1" />
      </>
    ),
    accessory: (
      <g>
        {/* Party hat */}
        <polygon points="32,2 28,12 36,12" fill="#f59e0b" />
        <polygon points="32,3 29,11 35,11" fill="#ffd700" />
        <motion.circle cx="32" cy="2" r="1.5" fill="#ff5277" />
        {/* Confetti */}
        {[14, 18, 46, 50, 44].map((x, i) => (
          <motion.rect
            key={i}
            x={x} y={8 + i * 1.5} width="3" height="3"
            fill={['#ff5277', '#ffd700', '#4cc9f0', '#a78bfa', '#34d399'][i]}
            animate={{
              y: [8 + i * 1.5, 18 + i, 8 + i * 1.5],
              opacity: [1, 0.5, 1],
              rotate: [0, 45 * (i % 2 === 0 ? 1 : -1), 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </g>
    ),
  },
  comfort: {
    aura: 'from-mint/15 to-mint/0',
    eyes: (
      <g>
        <rect x="24" y="33" width="4" height="2" fill="#0d0b1f" rx="1" />
        <rect x="36" y="33" width="4" height="2" fill="#0d0b1f" rx="1" />
      </g>
    ),
    mouth: (
      <rect x="28" y="40" width="8" height="2" fill="#0d0b1f" rx="1" />
    ),
    accessory: (
      <motion.text x="45" y="32" fontSize="8"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontFamily: 'monospace' }}
      >
        💚
      </motion.text>
    ),
  },
}

/* ------------------------------------------------------------------ */
/*  Hand-built pixel-art chef svg (expressionless base)                */
/* ------------------------------------------------------------------ */

function ChefAvatar({ mood }: { mood: AIMood }) {
  const { eyes, mouth, accessory } = MOOD_CONFIG[mood]

  return (
    <svg
      viewBox="0 0 64 64"
      width="64"
      height="64"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" fill="none" />

      {/* Hat */}
      <rect x="20" y="6" width="24" height="6" fill="#fdf6e3" />
      <rect x="16" y="12" width="6" height="6" fill="#fdf6e3" />
      <rect x="42" y="12" width="6" height="6" fill="#fdf6e3" />
      <rect x="22" y="12" width="20" height="8" fill="#fdf6e3" />
      <rect x="18" y="20" width="28" height="6" fill="#fdf6e3" />

      {/* Face */}
      <rect x="18" y="26" width="28" height="20" fill="#ffcb3b" />
      <rect x="18" y="26" width="28" height="3" fill="#0d0b1f" />

      {/* Eyes (mood-driven) */}
      {eyes}

      {/* Cheeks */}
      <rect x="22" y="38" width="4" height="3" fill="#ff5277" opacity="0.6" />
      <rect x="38" y="38" width="4" height="3" fill="#ff5277" opacity="0.6" />

      {/* Mouth (mood-driven) */}
      {mouth}

      {/* Body / Apron */}
      <rect x="16" y="46" width="32" height="14" fill="#4cc9f0" />
      <rect x="28" y="46" width="8" height="14" fill="#fdf6e3" />
      <rect x="28" y="52" width="8" height="3" fill="#ff5277" />

      {/* Accessory (mood-driven overlay: particles, hat, mark) */}
      {accessory}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Floating companion with speech bubble                              */
/* ------------------------------------------------------------------ */

export default function AIChefCompanion() {
  const { state, hideMessage } = useAICompanion()
  const { mood, message, messageVisible } = state
  const prevMessageRef = useRef<string | null>(null)

  // Play audio on message change
  useEffect(() => {
    if (message && message !== prevMessageRef.current) {
      playAIMessage()
      prevMessageRef.current = message
    }
  }, [message])

  // Floating breathing animation
  const floating = {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  }

  // Eye blink animation
  const blink = {
    scaleY: [1, 1, 0.1, 1, 1, 1, 1, 1, 0.1, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-1">
      {/* Speech bubble */}
      <AnimatePresence>
        {messageVisible && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative max-w-[220px] rounded-xl border-2 border-cream/40 bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-4 h-3 w-3 rotate-45 rounded-[1px] border-b-2 border-r-2 border-cream/40 bg-surface/95" />

            <p className="text-xs leading-relaxed text-cream/90 whitespace-pre-line">
              <TypingText text={message} speed={35} />
            </p>

            {/* Dismiss button */}
            <button
              onClick={() => hideMessage()}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] text-cream/40 hover:text-cream/80 border border-cream/20 transition-colors"
              aria-label="Dismiss"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chef avatar with mood aura */}
      <motion.div
        animate={floating}
        className="relative"
      >
        {/* Aura glow */}
        <motion.div
          className={`absolute inset-0 -m-3 rounded-full bg-gradient-radial ${MOOD_CONFIG[mood].aura} blur-sm`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Avatar circle */}
        <motion.div
          className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-cream/30 bg-surface/90 shadow-[0_0_12px_rgba(0,0,0,0.3)] backdrop-blur-sm cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={blink}
          style={{ transformOrigin: 'center' }}
        >
          <ChefAvatar mood={mood} />
        </motion.div>

        {/* Status dot */}
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface"
          animate={{
            backgroundColor:
              mood === 'celebrate' ? '#ffd700' :
              mood === 'thinking' ? '#c084fc' :
              mood === 'focused' ? '#ef4444' :
              mood === 'warning' ? '#f59e0b' :
              mood === 'comfort' ? '#34d399' :
              mood === 'excited' ? '#ffd700' :
              mood === 'curious' ? '#a78bfa' :
              mood === 'happy' ? '#4cc9f0' :
              '#94a3b8',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  )
}
