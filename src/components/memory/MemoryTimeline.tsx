import { motion } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'

interface TimelineNode {
  label: string
  subtitle: string
  emoji: string
}

interface MemoryTimelineProps {
  /** Today's dish name. */
  dishName: string
  /** Future suggestion dish name. */
  futureDish: string
  /** Delay before the timeline starts animating. */
  delay?: number
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    label: 'Day 1',
    subtitle: 'First Cooking Adventure',
    emoji: '🔰',
  },
]

/**
 * A pixel memory timeline showing the chef's journey:
 * Day 1 → Today → Future recommendation.
 */
export default function MemoryTimeline({ dishName, futureDish, delay = 0 }: MemoryTimelineProps) {
  const { t } = useLanguage()
  const nodes: TimelineNode[] = [
    ...TIMELINE_NODES,
    { label: 'Today', subtitle: dishName, emoji: '🍳' },
    { label: 'Future', subtitle: futureDish, emoji: '🔮' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="relative mx-auto w-full max-w-lg"
    >
      <h3 className="mb-4 font-terminal text-[8px] tracking-widest text-cream/50">
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
              className="flex flex-col"
            >
              <span className="font-terminal text-[7px] text-cream/40">{node.label}</span>
              <span className="font-pixel text-[10px] text-cream">{node.subtitle}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
