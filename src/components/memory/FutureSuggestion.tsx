import { motion } from 'framer-motion'
import type { PersonalityReport } from '@/types/memory'
import { useLanguage } from '@/i18n/LanguageContext'

interface FutureSuggestionProps {
  report: PersonalityReport
  delay?: number
}

/**
 * PIXEL's next-challenge recommendation card.
 * Shown at the bottom of the TasteMemory page as a "what's next" teaser.
 */
export default function FutureSuggestion({ report, delay = 0 }: FutureSuggestionProps) {
  const { t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, type: 'spring', stiffness: 160, damping: 16 }}
      className="mx-auto w-full max-w-lg border-4 border-ink bg-ink-panel px-6 py-5 shadow-pixel"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <motion.span
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
          className="text-base"
        >
          🔮
        </motion.span>
        <div>
          <h3 className="font-terminal text-[8px] tracking-widest text-cream/50">
            {t('diary.suggestion')}
          </h3>
          <p className="font-pixel text-sm text-cream">
            {report.suggestion.dish}
          </p>
        </div>
      </div>

      {/* Reason */}
      <motion.p
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay / 1000 + 0.3 }}
        className="mb-4 border-l-4 border-grape pl-3 font-sans text-xs leading-relaxed text-cream/75"
      >
        {report.suggestion.reason}
      </motion.p>

      {/* Stats footer */}
      <div className="flex items-center gap-4 border-t-2 border-ink-line pt-3">
        <div className="flex items-center gap-1.5">
          <span className="font-terminal text-[7px] text-cream/40">{t('diary.healthScore')}</span>
          <div className="h-2 w-14 border-2 border-ink bg-ink">
            <motion.div
              className="h-full bg-mint"
              initial={{ width: 0 }}
              animate={{ width: `${report.healthScore}%` }}
              transition={{ delay: delay / 1000 + 0.6, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="font-pixel text-[7px] text-mint/80">{report.healthScore}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-terminal text-[7px] text-cream/40">{t('diary.favoriteIngredients')}</span>
          <span className="font-pixel text-[9px] text-cream/80">
            {report.favoriteIngredients.join(' ')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
