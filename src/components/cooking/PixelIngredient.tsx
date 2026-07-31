import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import type { Ingredient } from '@/types/food'

interface PixelIngredientProps {
  ingredient: Ingredient
  selected: boolean
  onPick: (ingredient: Ingredient, e: MouseEvent<HTMLButtonElement>) => void
}

/** A single ingredient sitting on the fridge shelf — pressable, springy, glows when in the pot. */
export default function PixelIngredient({ ingredient, selected, onPick }: PixelIngredientProps) {
  return (
    <motion.button
      type="button"
      onClick={(e) => onPick(ingredient, e)}
      aria-pressed={selected}
      whileHover={{ scale: 1.08, rotate: -2, y: -3 }}
      whileTap={{ scale: 0.9, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 420, damping: 17 }}
      className={`relative flex w-full flex-col items-center gap-1 border-4 border-ink px-1 py-2 outline-none ${
        selected
          ? 'bg-cheese text-ink shadow-glow-cheese'
          : 'bg-ink-panel text-cream shadow-pixel-sm hover:bg-ink-line'
      }`}
    >
      <span className="text-2xl leading-none">{ingredient.emoji}</span>
      <span className="font-pixel text-[7px] leading-tight">{ingredient.name.toUpperCase()}</span>
      <span className={`font-terminal text-xs ${selected ? 'text-ink/70' : 'text-cream/50'}`}>
        {ingredient.calories} kcal
      </span>

      {/* "in the pot" badge */}
      {selected && (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center border-2 border-ink bg-tomato font-pixel text-[8px] text-ink"
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  )
}
