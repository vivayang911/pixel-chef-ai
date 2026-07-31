import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import type { Ingredient, IngredientCategory } from '@/types/food'
import PixelIngredient from './PixelIngredient'
import { useLanguage } from '@/i18n/LanguageContext'

interface IngredientShelfProps {
  ingredients: Ingredient[]
  selectedIds: string[]
  onPick: (ingredient: Ingredient, e: MouseEvent<HTMLButtonElement>) => void
}

const CATEGORY_ORDER: IngredientCategory[] = ['protein', 'vegetable', 'flavor']

const CATEGORY_ACCENT: Record<IngredientCategory, string> = {
  protein: 'bg-tomato text-ink',
  vegetable: 'bg-mint text-ink',
  flavor: 'bg-cheese text-ink',
}

/** The pixel fridge shelf: ingredients grouped by category on chunky shelf planks. */
export default function IngredientShelf({ ingredients, selectedIds, onPick }: IngredientShelfProps) {
  const { t } = useLanguage()

  return (
    <div className="pixel-panel bg-ink-soft p-4 shadow-pixel">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-pixel text-[10px] text-cream">{t('memory.fridge')}</h2>
        <span className="font-terminal text-sm text-cream/50">{t('memory.clickToss')}</span>
      </div>

      <div className="space-y-5">
        {CATEGORY_ORDER.map((category, shelfIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + shelfIndex * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`border-2 border-ink px-2 py-0.5 font-pixel text-[7px] shadow-pixel-sm ${CATEGORY_ACCENT[category]}`}
              >
                {t(`common.${category}`)}
              </span>
              <span className="h-1 flex-1 bg-ink-line" />
            </div>

            {/* Shelf plank: items sit on a chunky bottom border */}
            <div className="grid grid-cols-3 gap-2 border-b-8 border-ink-line pb-3">
              {ingredients
                .filter((ing) => ing.category === category)
                .map((ing) => (
                  <PixelIngredient
                    key={ing.id}
                    ingredient={ing}
                    selected={selectedIds.includes(ing.id)}
                    onPick={onPick}
                  />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
