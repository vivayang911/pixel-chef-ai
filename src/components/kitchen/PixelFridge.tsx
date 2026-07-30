import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PixelFood, { type FoodKind } from './PixelFood'
import PixelChef from '@/components/ui/PixelChef'

interface Ingredient {
  kind: FoodKind
  left: string
  top: string
  delay: number
}

const INGREDIENTS: Ingredient[] = [
  { kind: 'tomato', left: '4%', top: '2%', delay: 0.1 },
  { kind: 'broccoli', left: '56%', top: '2%', delay: 0.95 },
  { kind: 'egg', left: '74%', top: '0%', delay: 0.25 },
  { kind: 'cheese', left: '0%', top: '48%', delay: 0.4 },
  { kind: 'mushroom', left: '82%', top: '44%', delay: 0.55 },
  { kind: 'fish', left: '34%', top: '82%', delay: 0.7 },
  { kind: 'carrot', left: '14%', top: '84%', delay: 1.0 },
  { kind: 'chili', left: '64%', top: '84%', delay: 0.85 },
]

/**
 * The interactive pixel fridge: the door swings open on load (and toggles on
 * click), spilling floating ingredients and revealing the AI chef.
 */
export default function PixelFridge() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative mx-auto" style={{ perspective: 1000 }}>
      {/* Warm light beam when the door is open */}
      <motion.div
        className="pointer-events-none absolute -left-6 top-10 h-44 w-44 rounded-full bg-cheese/25 blur-2xl"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.4 }}
        transition={{ duration: 0.6 }}
      />

      {/* Floating ingredients that spill out of the fridge */}
      {INGREDIENTS.map((ing) => (
        <motion.div
          key={ing.kind}
          className="absolute"
          style={{ left: ing.left, top: ing.top }}
          initial={false}
          animate={
            open ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 12 }
          }
          transition={{
            delay: open ? ing.delay : 0,
            type: 'spring',
            stiffness: 260,
            damping: 18,
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: ing.delay,
            }}
            className="rounded-none border-2 border-ink bg-ink-panel p-1 shadow-pixel-sm"
          >
            <PixelFood kind={ing.kind} className="h-7 w-7" />
          </motion.div>
        </motion.div>
      ))}

      {/* Fridge body (clickable to toggle the door) */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle the fridge door"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative block w-44 cursor-pointer rounded-none border-4 border-ink bg-ink-panel shadow-pixel outline-none sm:w-56"
        style={{ aspectRatio: '5 / 7' }}
      >
        {/* Interior (revealed behind the door) */}
        <div className="absolute inset-2 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-grape/30 to-ink-soft">
          <span className="font-pixel text-[8px] text-grape">FRESH</span>
          <span className="font-terminal text-sm text-cream/50">INGREDIENTS</span>
        </div>

        {/* Door */}
        <motion.div
          className="absolute inset-0 border-4 border-ink bg-sky/20"
          style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden' }}
          animate={{ rotateY: open ? -118 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="absolute right-2 top-1/2 h-10 w-2 -translate-y-1/2 bg-ink" />
          <span className="absolute left-3 top-3 font-pixel text-[8px] text-ink">
            PIXEL
          </span>
          <span className="absolute bottom-3 left-3 font-terminal text-sm text-ink/70">
            FRIDGE
          </span>
        </motion.div>
      </motion.button>

      {/* AI chef mascot with a waving hand */}
      <motion.div
        className="absolute -bottom-8 -left-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 16 }}
      >
        <div className="relative">
          <PixelChef className="h-24 w-24 animate-float-y sm:h-28 sm:w-28" />
          <motion.div
            className="absolute -right-2 top-2"
            style={{ transformOrigin: 'bottom center' }}
            animate={{ rotate: [-12, 16, -12] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              viewBox="0 0 10 10"
              className="h-5 w-5"
              shapeRendering="crispEdges"
              aria-hidden="true"
            >
              <rect x="3" y="2" width="4" height="5" fill="#ffcb3b" />
              <rect x="2" y="6" width="6" height="3" fill="#ffcb3b" />
              <rect x="2" y="8" width="1" height="1" fill="#0d0b1f" />
              <rect x="4" y="8" width="1" height="1" fill="#0d0b1f" />
              <rect x="6" y="8" width="1" height="1" fill="#0d0b1f" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
