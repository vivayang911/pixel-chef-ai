import { AnimatePresence, motion } from 'framer-motion'
import type { Ingredient } from '@/types/food'

interface CookingPotProps {
  items: Ingredient[]
  /** True once the pot has enough to start cooking (3+ items incl. a protein). */
  ready: boolean
}

type PotState = 'empty' | 'filling' | 'ready'

const STATE_LABEL: Record<PotState, string> = {
  empty: '· EMPTY POT ·',
  filling: '· INGREDIENTS ·',
  ready: '★ COOKING READY ★',
}

const STEAM_COUNT = 3
const FLAMES = [
  { h: 'h-4', c: 'bg-tomato', d: 0 },
  { h: 'h-6', c: 'bg-cheese', d: 0.12 },
  { h: 'h-5', c: 'bg-tomato', d: 0.24 },
  { h: 'h-7', c: 'bg-cheese', d: 0.06 },
  { h: 'h-4', c: 'bg-tomato', d: 0.3 },
]

/**
 * The central pixel cooking pot. States: empty → filling → cooking ready.
 * Wiggles whenever a new ingredient lands, steams while filled, burns a
 * pixel fire underneath once ready.
 */
export default function CookingPot({ items, ready }: CookingPotProps) {
  const state: PotState = items.length === 0 ? 'empty' : ready ? 'ready' : 'filling'

  return (
    <div className="relative flex w-full max-w-xs flex-col items-center pt-12">
      {/* State banner */}
      <motion.span
        key={state}
        initial={{ opacity: 0, y: -8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className={`absolute top-0 border-4 border-ink px-3 py-1 font-pixel text-[8px] shadow-pixel-sm ${
          state === 'ready' ? 'bg-tomato text-ink' : 'bg-ink-panel text-cream/70'
        }`}
      >
        {STATE_LABEL[state]}
      </motion.span>

      {/* Steam */}
      {state !== 'empty' && (
        <div className="pointer-events-none absolute left-1/2 top-8 z-20 flex -translate-x-1/2 gap-4">
          {Array.from({ length: STEAM_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className="block h-2 w-2 bg-cream/50"
              animate={{ y: [8, -30], opacity: [0, 0.9, 0], scale: [1, 1.7] }}
              transition={{
                duration: ready ? 1.1 : 1.9,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <div className={`relative w-full ${ready ? 'drop-shadow-[0_0_18px_rgba(255,82,119,0.45)]' : ''}`}>
        {/* Ingredient stack inside the pot opening */}
        <div className="absolute inset-x-0 bottom-[46%] z-10 flex flex-wrap items-end justify-center gap-1 px-10">
          <AnimatePresence>
            {items.map((ing) => (
              <motion.span
                key={ing.id}
                initial={{ y: -110, opacity: 0, scale: 0.3, rotate: -50 }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                className="text-2xl leading-none"
              >
                {ing.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Pot body — wiggles every time the contents change */}
        <motion.div
          key={items.length}
          initial={{ scale: 1.06, rotate: -2.5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 11 }}
        >
          <svg
            viewBox="0 0 64 44"
            className="h-auto w-full"
            shapeRendering="crispEdges"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Handles */}
            <rect x="0" y="14" width="8" height="5" fill="#3d3570" />
            <rect x="56" y="14" width="8" height="5" fill="#3d3570" />
            {/* Pot opening (dark interior) */}
            <rect x="8" y="10" width="48" height="7" fill="#0d0b1f" />
            {/* Rim */}
            <rect x="6" y="8" width="52" height="3" fill="#5a4fa0" />
            <rect x="6" y="17" width="52" height="2" fill="#3d3570" />
            {/* Body */}
            <rect x="8" y="19" width="48" height="17" fill="#2c2550" />
            <rect x="8" y="19" width="6" height="17" fill="#3d3570" />
            <rect x="8" y="32" width="48" height="4" fill="#15122b" />
            {/* Shine */}
            <rect x="30" y="24" width="4" height="4" fill="#ffcb3b" />
            <rect x="34" y="28" width="2" height="2" fill="#ffcb3b" />
            {/* Feet */}
            <rect x="14" y="36" width="6" height="4" fill="#15122b" />
            <rect x="44" y="36" width="6" height="4" fill="#15122b" />
          </svg>

          {/* Empty hint */}
          {state === 'empty' && (
            <span className="absolute inset-x-0 top-[58%] text-center font-terminal text-sm text-cream/40">
              DROP FOOD HERE
            </span>
          )}
        </motion.div>

        {/* Pixel fire once cooking is ready */}
        {ready && (
          <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-end gap-1">
            {FLAMES.map((f, i) => (
              <motion.span
                key={i}
                className={`block w-2 ${f.h} ${f.c} origin-bottom`}
                animate={{ scaleY: [1, 1.4, 0.85, 1.25, 1] }}
                transition={{ duration: 0.55, repeat: Infinity, delay: f.d, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
