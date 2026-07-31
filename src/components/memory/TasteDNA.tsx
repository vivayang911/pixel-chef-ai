import { motion, AnimatePresence } from 'framer-motion'

interface TasteDNAProps {
  /** e.g. "🔥 Fire Chef" */
  personality: string
  /** Trait strings like ["Crispy Lover", "Fast Cooker", ...] */
  traits: string[]
  /** Delay before traits start appearing (ms). */
  delay?: number
}

const TRAIT_COLORS = ['bg-tomato', 'bg-grape', 'bg-mint', 'bg-cheese']

/**
 * A pixel DNA helix that reveals the chef's cooking personality
 * with floating trait tags.
 */
export default function TasteDNA({ personality, traits, delay = 0 }: TasteDNAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, type: 'spring', stiffness: 160, damping: 16 }}
      className="relative mx-auto w-full max-w-lg overflow-hidden border-4 border-ink bg-ink-panel px-6 py-6 shadow-pixel"
    >
      {/* Pixel DNA decoration */}
      <div className="pointer-events-none absolute inset-y-0 -left-1 flex flex-col items-center justify-center gap-1 opacity-25">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 bg-cream"
            animate={{ x: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 -right-1 flex flex-col items-center justify-center gap-1 opacity-25">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 bg-cream"
            animate={{ x: [0, -6, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Title */}
      <h3 className="mb-1 font-terminal text-[8px] tracking-widest text-cream/50">
        YOUR COOKING PERSONALITY
      </h3>

      {/* Personality type */}
      <motion.p
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay / 1000 + 0.2, type: 'spring', stiffness: 260, damping: 14 }}
        className="mb-5 font-pixel text-lg text-cream"
      >
        {personality}
      </motion.p>

      {/* Traits */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {traits.map((trait, i) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: delay / 1000 + 0.3 + i * 0.18,
                type: 'spring',
                stiffness: 300,
                damping: 16,
              }}
              className={`inline-block border-2 border-ink px-2.5 py-1 font-pixel text-[7px] text-ink shadow-pixel-sm ${
                TRAIT_COLORS[i % TRAIT_COLORS.length]
              }`}
            >
              {trait}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
