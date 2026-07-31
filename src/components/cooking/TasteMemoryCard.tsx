import { motion } from 'framer-motion'
import type { TasteProfile } from '@/engine/memoryEngine'
import { useLanguage } from '@/i18n/LanguageContext'

interface TasteMemoryCardProps {
  profile: TasteProfile
}

/** PIXEL's evolving taste profile: preferred tags and health goal. */
export default function TasteMemoryCard({ profile }: TasteMemoryCardProps) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
      className="pixel-panel bg-ink-soft p-4 shadow-pixel"
    >
      <h3 className="mb-3 font-pixel text-[10px] text-cream">
        {t('memory.yourTasteProfile')}
      </h3>

      <div className="space-y-3">
        {/* Preferred flavor tags */}
        <div>
          <span className="font-terminal text-base text-cream/50">{t('memory.likes')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.likes.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.1 }}
                className="inline-block border-2 border-ink bg-grape/30 px-2 py-0.5 font-terminal text-lg text-cream/80 shadow-pixel-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-ink-line pt-3">
          <span className="font-terminal text-lg text-cream/50">
            {t('memory.healthGoal')}
            <span className="text-mint">{profile.healthGoal}</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
