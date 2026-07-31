import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Ingredient } from '@/types/food'
import type { TasteScore } from '@/engine/cookingEngine'
import { generateDishVisual } from '@/engine/dishImageEngine'
import type { DishVisualConfig } from '@/engine/dishImageEngine'

/* ------------------------------------------------------------------ */
/*  Mini pixel artwork (simplified for memory card)                    */
/* ------------------------------------------------------------------ */

function MiniDishArtwork({ config }: { config: DishVisualConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      className="flex-shrink-0 rounded-lg border-2 border-ink bg-[#1a1725] p-1.5 shadow-inner"
    >
      <svg
        viewBox="0 0 100 80"
        width="80"
        height="64"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Warm background glow */}
        <ellipse cx="50" cy="45" rx="40" ry="25" fill={config.mainColor} opacity="0.08" />

        {/* Mini container based on type */}
        {config.dishType === 'bowl' && (
          <>
            <path d="M18 45 Q18 68 40 70 L60 70 Q82 68 82 45" fill="#f0e6d3" stroke="#0d0b1f" strokeWidth="1.5" />
            <ellipse cx="50" cy="47" rx="30" ry="6" fill={config.baseColor} stroke="#0d0b1f" strokeWidth="0.8" />
          </>
        )}
        {config.dishType === 'plate' && (
          <>
            <ellipse cx="52" cy="50" rx="32" ry="14" fill="#f5f0e8" stroke="#0d0b1f" strokeWidth="1.5" />
            <ellipse cx="50" cy="48" rx="20" ry="8" fill={config.baseColor} />
          </>
        )}
        {config.dishType === 'pan' && (
          <>
            <rect x="12" y="36" width="76" height="20" rx="4" fill="#3a3a3a" stroke="#0d0b1f" strokeWidth="1.5" />
            <rect x="16" y="38" width="68" height="16" rx="2" fill={config.baseColor} opacity="0.8" />
            <rect x="80" y="40" width="14" height="5" rx="2" fill="#5a4a3a" stroke="#0d0b1f" strokeWidth="1" />
          </>
        )}
        {config.dishType === 'soup' && (
          <>
            <path d="M18 42 Q18 70 40 74 L60 74 Q82 70 82 42" fill="#e8cfa0" stroke="#0d0b1f" strokeWidth="1.5" />
            <rect x="16" y="38" width="68" height="6" rx="2" fill="#f0d8a8" stroke="#0d0b1f" strokeWidth="1" />
            <ellipse cx="50" cy="42" rx="32" ry="6" fill={config.baseColor} stroke="#0d0b1f" strokeWidth="0.8" />
          </>
        )}

        {/* Mini ingredients as colored dots */}
        {config.placedIngredients.map((ing, i) => (
          <rect
            key={i}
            x={ing.x * 0.5 + 5}
            y={ing.y * 0.5 + 5}
            width={ing.w * 0.4}
            height={ing.h * 0.4}
            rx="1"
            fill={ing.visual.color}
            opacity="0.85"
            stroke="#0d0b1f"
            strokeWidth="0.4"
          />
        ))}

        {/* Steam dots for pan/bowl */}
        {config.steam && (
          <>
            <rect x="42" y="30" width="3" height="2" rx="1" fill="#fff" opacity="0.3" />
            <rect x="54" y="28" width="2" height="2" rx="1" fill="#fff" opacity="0.25" />
            <rect x="48" y="26" width="4" height="2" rx="1" fill="#fff" opacity="0.2" />
          </>
        )}
      </svg>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface DishMemoryCardProps {
  dishName: string
  ingredients: Ingredient[]
  score: TasteScore
  /** Short AI note about what was learned. */
  aiNote: string
  delay?: number
  /** Pre-generated visual config for pixel artwork. */
  visualConfig?: DishVisualConfig
}

/**
 * A pixel memory card capturing the dish just created:
 * name, ingredients, scores, pixel artwork, and an AI note.
 */
export default function DishMemoryCard({
  dishName,
  ingredients,
  score,
  aiNote,
  delay = 0,
  visualConfig: visualConfigProp,
}: DishMemoryCardProps) {
  const avg = Math.round((score.taste + score.creativity + score.nutrition) / 3)

  // Generate visual if not provided
  const visualConfig = useMemo(
    () => visualConfigProp ?? generateDishVisual(ingredients, avg),
    [visualConfigProp, ingredients, avg],
  )

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
      className="mx-auto w-full max-w-lg border-4 border-ink bg-cream/8 px-5 py-5 shadow-pixel"
    >
      {/* Card header with pixel artwork + dish name */}
      <div className="mb-4 flex items-center gap-4">
        <MiniDishArtwork config={visualConfig} />
        <div className="flex-1">
          <h3 className="font-pixel text-sm text-cream">{dishName}</h3>
          <span className="font-terminal text-[7px] text-cream/40">NEW MEMORY</span>
          {/* Taste profile tagline */}
          <div className="mt-1.5 flex gap-2">
            {[
              { label: 'Taste', value: score.taste, color: '#ff6b6b' },
              { label: 'Creativity', value: score.creativity, color: '#a78bfa' },
              { label: 'Nutrition', value: score.nutrition, color: '#34d399' },
            ].map((dim) => (
              <span
                key={dim.label}
                className="font-terminal text-[7px] text-cream/60"
                style={{ color: dim.color }}
              >
                {dim.label} <span className="text-cream/40">+{dim.value}</span>
              </span>
            ))}
          </div>
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
