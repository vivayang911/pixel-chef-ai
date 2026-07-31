import { motion } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'
import type { DishVisualConfig } from '@/engine/dishImageEngine'

interface TimelineNode {
  label: string
  subtitle: string
  emoji: string
  visualConfig?: DishVisualConfig
  scoreLabel?: string
}

interface MemoryTimelineProps {
  /** Today's dish name. */
  dishName: string
  /** Future suggestion dish name. */
  futureDish: string
  /** Optional pixel visual config for today's dish. */
  todayVisual?: DishVisualConfig
  /** Delay before the timeline starts animating. */
  delay?: number
}

/**
 * A pixel memory timeline showing the chef's journey:
 * Day 1 → Today → Future recommendation.
 * Includes mini pixel artwork for today's dish.
 */
export default function MemoryTimeline({
  dishName,
  futureDish,
  todayVisual,
  delay = 0,
}: MemoryTimelineProps) {
  const { t } = useLanguage()

  const nodes: TimelineNode[] = [
    { label: 'Day 1', subtitle: 'First Cooking Adventure', emoji: '🔰', scoreLabel: 'This is where your taste story begins.' },
    { label: 'Today', subtitle: dishName, emoji: '🍳', visualConfig: todayVisual },
    { label: 'Future', subtitle: futureDish, emoji: '🔮' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="relative mx-auto w-full max-w-lg"
    >
      <h3 className="mb-5 font-terminal text-[8px] tracking-widest text-cream/50">
        {t('timeline.title')}
      </h3>

      {/* Vertical line */}
      <div className="relative ml-4 flex flex-col gap-0">
        {nodes.map((node, i) => (
          <div key={node.label} className="relative flex items-start pb-8 last:pb-0">
            {/* Connector line */}
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: delay / 1000 + 0.5 + i * 0.3, duration: 0.6 }}
                className="absolute left-[14px] top-8 w-0.5 bg-ink-line"
                style={{ height: 'calc(100% - 4px)' }}
              />
            )}

            {/* Node dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: delay / 1000 + 0.3 + i * 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 14,
              }}
              className="relative z-10 mr-4 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink bg-ink-panel text-sm"
            >
              {node.emoji}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay / 1000 + 0.5 + i * 0.3 }}
              className="flex flex-col flex-1"
            >
              <span className="font-terminal text-[7px] text-cream/40">{node.label}</span>
              <span className="font-pixel text-[10px] text-cream">{node.subtitle}</span>
              {node.scoreLabel && (
                <span className="mt-0.5 font-terminal text-[7px] text-cream/40">{node.scoreLabel}</span>
              )}

              {/* Mini pixel artwork for Today */}
              {node.visualConfig && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: delay / 1000 + 0.8 }}
                  className="mt-2 overflow-hidden"
                >
                  <svg
                    viewBox="0 0 100 80"
                    width="70"
                    height="56"
                    shapeRendering="crispEdges"
                    className="rounded border-2 border-ink bg-[#1a1725]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse cx="50" cy="45" rx="38" ry="22" fill={node.visualConfig.mainColor} opacity="0.08" />
                    {/* Mini container */}
                    {node.visualConfig.dishType === 'pan' ? (
                      <>
                        <rect x="16" y="36" width="68" height="20" rx="4" fill="#3a3a3a" stroke="#0d0b1f" strokeWidth="1.2" />
                        <rect x="20" y="38" width="60" height="16" rx="2" fill={node.visualConfig.baseColor} opacity="0.75" />
                        <rect x="76" y="40" width="12" height="4" rx="2" fill="#5a4a3a" />
                      </>
                    ) : node.visualConfig.dishType === 'bowl' ? (
                      <>
                        <path d="M22 46 Q22 66 40 68 L60 68 Q78 66 78 46" fill="#f0e6d3" stroke="#0d0b1f" strokeWidth="1.2" />
                        <ellipse cx="50" cy="48" rx="26" ry="6" fill={node.visualConfig.baseColor} stroke="#0d0b1f" strokeWidth="0.6" />
                      </>
                    ) : (
                      <>
                        <ellipse cx="52" cy="52" rx="28" ry="12" fill="#f5f0e8" stroke="#0d0b1f" strokeWidth="1.2" />
                        <ellipse cx="50" cy="50" rx="16" ry="7" fill={node.visualConfig.baseColor} />
                      </>
                    )}
                    {/* Ingredient dots */}
                    {node.visualConfig.placedIngredients.map((ing, j) => (
                      <rect
                        key={j}
                        x={ing.x * 0.45 + 8}
                        y={ing.y * 0.45 + 8}
                        width={ing.w * 0.35}
                        height={ing.h * 0.35}
                        rx="0.5"
                        fill={ing.visual.color}
                        opacity="0.8"
                        stroke="#0d0b1f"
                        strokeWidth="0.3"
                      />
                    ))}
                  </svg>
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
