import { motion } from 'framer-motion'
import type { Ingredient } from '@/types/food'
import type { TasteScore } from '@/engine/cookingEngine'

interface DishMemoryCardProps {
  dishName: string
  ingredients: Ingredient[]
  score: TasteScore
  /** Short AI note about what was learned. */
  aiNote: string
  delay?: number
}

/**
 * A pixel memory card capturing the dish just created:
 * name, ingredients, scores, and an AI note.
 */
export default function DishMemoryCard({
  dishName,
  ingredients,
  score,
  aiNote,
  delay = 0,
}: DishMemoryCardProps) {
  const avg = Math.round((score.taste + score.creativity + score.nutrition) / 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotateY: 15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        delay: delay / 1000,
        type: 'spring',
        stiffness: 180,
        damping: 18,
      }}
      className="mx-auto w-full max-w-lg border-4 border-ink bg-cream/8 px-6 py-5 shadow-pixel"
    >
      {/* Card header with dish emoji and name */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-cheese/20 text-xl">
          🍳
        </span>
        <div>
          <h3 className="font-pixel text-sm text-cream">{dishName}</h3>
          <span className="font-terminal text-[7px] text-cream/40">NEW MEMORY</span>
        </div>
      </div>

      {/* Ingredients row */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="font-terminal text-[7px] text-cream/50">INGREDIENTS:</span>
        {ingredients.map((ing, i) => (
          <motion.span
            key={ing.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: delay / 1000 + 0.3 + i * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 14,
            }}
            className="inline-block border-2 border-ink bg-ink-panel px-1.5 py-0.5 font-pixel text-[7px] text-cream"
          >
            {ing.emoji} {ing.name}
          </motion.span>
        ))}
      </div>

      {/* Score mini bars */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="font-terminal text-[7px] text-tomato">👅</span>
          <div className="h-2 w-12 border-2 border-ink bg-ink">
            <motion.div
              className="h-full bg-tomato"
              initial={{ width: 0 }}
              animate={{ width: `${score.taste}%` }}
              transition={{ delay: delay / 1000 + 0.6, duration: 0.7, ease: 'easeOut' }}
            />
          </div>
          <span className="font-pixel text-[7px] text-cream/70">{score.taste}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-terminal text-[7px] text-grape">🎨</span>
          <div className="h-2 w-12 border-2 border-ink bg-ink">
            <motion.div
              className="h-full bg-grape"
              initial={{ width: 0 }}
              animate={{ width: `${score.creativity}%` }}
              transition={{ delay: delay / 1000 + 0.8, duration: 0.7, ease: 'easeOut' }}
            />
          </div>
          <span className="font-pixel text-[7px] text-cream/70">{score.creativity}</span>
        </div>
      </div>

      {/* Average score badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="font-terminal text-[7px] text-cream/50">SCORE:</span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: delay / 1000 + 1.2,
            type: 'spring',
            stiffness: 300,
            damping: 12,
          }}
          className="inline-block border-2 border-ink bg-cheese px-2 py-0.5 font-pixel text-xs text-ink shadow-pixel-sm"
        >
          {avg} pts
        </motion.span>
      </div>

      {/* AI note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay / 1000 + 1.4 }}
        className="border-t-2 border-ink-line pt-3"
      >
        <span className="font-terminal text-[7px] text-grape">MEMORY ADDED:</span>
        <p className="mt-1 font-sans text-xs leading-relaxed text-cream/75 italic">
          &ldquo;{aiNote}&rdquo;
        </p>
      </motion.div>
    </motion.div>
  )
}
