import { motion } from 'framer-motion'

interface FireEffectProps {
  intensity: 'low' | 'medium' | 'high'
  className?: string
}

const FLAMES = [
  { w: 'w-3', h: 'h-8', c: 'bg-tomato', delay: 0 },
  { w: 'w-4', h: 'h-10', c: 'bg-cheese', delay: 0.08 },
  { w: 'w-3', h: 'h-12', c: 'bg-tomato', delay: 0.16 },
  { w: 'w-4', h: 'h-9', c: 'bg-cheese', delay: 0.04 },
  { w: 'w-3', h: 'h-11', c: 'bg-tomato', delay: 0.22 },
  { w: 'w-4', h: 'h-7', c: 'bg-cheese', delay: 0.12 },
]

const SPEED: Record<FireEffectProps['intensity'], number> = {
  low: 0.9,
  medium: 0.5,
  high: 0.28,
}

/** Animated pixel flames — intensity controls flicker speed + scale. */
export default function FireEffect({ intensity, className = '' }: FireEffectProps) {
  return (
    <div className={`flex items-end justify-center gap-1 ${className}`} aria-hidden>
      {FLAMES.map((f, i) => (
        <motion.span
          key={i}
          className={`block ${f.w} ${f.h} ${f.c} origin-bottom`}
          animate={{ scaleY: [1, 1.55, 0.8, 1.35, 1] }}
          transition={{
            duration: SPEED[intensity],
            repeat: Infinity,
            delay: f.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
