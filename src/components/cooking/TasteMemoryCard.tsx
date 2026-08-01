import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TasteProfile } from '@/engine/memoryEngine'
import { useLanguage } from '@/i18n/LanguageContext'

interface TasteMemoryCardProps {
  profile: TasteProfile
}

/** PIXEL's evolving taste profile: preferred tags and health goal. */
export default function TasteMemoryCard({ profile }: TasteMemoryCardProps) {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
      className="pixel-panel bg-ink-soft p-4 shadow-pixel"
    >
      <h3 className="mb-1 font-pixel text-[10px] text-cream">
        {t('memory.yourTasteProfile')}
      </h3>
      <p className="mb-3 font-terminal text-sm text-tomato">{profile.title}</p>

      <div className="space-y-3">
        {/* Preferred flavor tags */}
        <div>
          <span className="font-terminal text-base text-cream/50">{t('memory.likes')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.likes.map((tag) => {
              const active = selected.has(tag)
              return (
                <motion.button
                  key={tag}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggle(tag)}
                  aria-pressed={active}
                  className={`cursor-pointer border-2 border-ink px-2 py-0.5 font-terminal text-lg shadow-pixel-sm transition-colors ${
                    active
                      ? 'bg-grape/60 text-cream'
                      : 'bg-ink/40 text-cream/40 hover:text-cream/70'
                  }`}
                >
                  {tag}
                </motion.button>
              )
            })}
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
