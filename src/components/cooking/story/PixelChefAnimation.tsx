import { motion } from 'framer-motion'
import PixelChef from '@/components/ui/PixelChef'

export type ChefAnimState = 'idle' | 'prepare' | 'cook' | 'taste' | 'success' | 'fail'

/** Motion patterns per chef state — rotate + float keyframes. */
const MOTIONS: Record<ChefAnimState, { rotate: number[]; y: number[]; duration: number }> = {
  idle:     { rotate: [0],              y: [0, -10, 0],                duration: 2.8 },
  prepare:  { rotate: [-5, 5],          y: [0, -6, 0],                 duration: 0.7 },
  cook:     { rotate: [-8, 8],          y: [0, -5, 0],                 duration: 0.4 },
  taste:    { rotate: [-2, 2],          y: [0, -4, 0],                 duration: 1.4 },
  success:  { rotate: [0, -12, 0, 12, 0], y: [0, -18, 0, -14, 0],    duration: 0.9 },
  fail:     { rotate: [0, 4, 0],        y: [0, 6, 0],                  duration: 2.5 },
}

const EMOTE: Record<ChefAnimState, string | null> = {
  idle: null,
  prepare: '💧',
  cook: '👨‍🍳',
  taste: '🤔',
  success: '✨',
  fail: '😔',
}

/** Animated pixel chef mascot — changes motion + expression per cooking state. */
export default function PixelChefAnimation({ state }: { state: ChefAnimState }) {
  const m = MOTIONS[state]

  return (
    <motion.div
      key={state}
      animate={{ rotate: m.rotate, y: m.y }}
      transition={{ duration: m.duration, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <PixelChef className="h-28 w-28" />
      {EMOTE[state] && (
        <motion.span
          initial={{ scale: 0, y: 6 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 16 }}
          className="absolute -right-4 -top-1 text-lg"
        >
          {EMOTE[state]}
        </motion.span>
      )}

      {/* Success sparkles */}
      {state === 'success' && (
        <>
          <motion.span
            className="pointer-events-none absolute -left-2 top-1 text-base"
            animate={{ scale: [1, 1.4, 1], rotate: [0, 25, -25, 0] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          >
            ⭐
          </motion.span>
          <motion.span
            className="pointer-events-none absolute right-0 top-3 text-sm"
            animate={{ scale: [1, 1.5, 1], rotate: [0, -30, 30, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0.4 }}
          >
            🌟
          </motion.span>
        </>
      )}
    </motion.div>
  )
}
