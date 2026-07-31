import { motion } from 'framer-motion'
import type { SelectionFeedback } from '@/engine/memoryEngine'
import { useLanguage } from '@/i18n/LanguageContext'

interface AIAdvisorProps {
  feedback: SelectionFeedback
}

/** PIXEL's real-time selection analysis: ingredient memory lines + combo messages. */
export default function AIAdvisor({ feedback }: AIAdvisorProps) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="pixel-panel bg-ink-soft p-4 shadow-pixel"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 animate-blink bg-mint" />
        <h3 className="font-pixel text-[10px] text-cream">
          {t('memory.analyzing')}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Nutrition advice */}
        <div className="border-b-2 border-ink-line pb-3">
          <p className="font-sans text-sm leading-relaxed text-cream/80">
            {feedback.nutritionAdvice}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
