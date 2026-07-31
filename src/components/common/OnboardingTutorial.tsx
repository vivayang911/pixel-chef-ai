import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PixelButton from '@/components/ui/PixelButton'
import { useLanguage } from '@/i18n/LanguageContext'

const LS_KEY = 'pixel-chef-tutorial-seen'

export default function OnboardingTutorial() {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  const STEPS = [
    { emoji: '🕹️', title: t('tutorial.step1Title'), body: t('tutorial.step1Text') },
    { emoji: '🥦', title: t('tutorial.step2Title'), body: t('tutorial.step2Text') },
    { emoji: '🔥', title: t('tutorial.step3Title'), body: t('tutorial.step3Text') },
    { emoji: '🧬', title: t('tutorial.step4Title'), body: t('tutorial.step4Text') },
  ]

  useEffect(() => {
    const seen = localStorage.getItem(LS_KEY)
    if (!seen) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(LS_KEY, '1')
    setVisible(false)
  }

  const current = STEPS[step]
  const isLast = step >= STEPS.length - 1

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-sm border-4 border-ink bg-ink-panel px-7 py-7 shadow-pixel-lg"
          >
            <div className="mb-5 flex justify-center gap-2">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`block h-2 w-2 ${
                    i <= step ? 'bg-cheese' : 'bg-ink-line'
                  }`}
                />
              ))}
            </div>

            <div className="mb-4 text-center text-4xl">{current.emoji}</div>

            <h2 className="mb-3 text-center font-pixel text-sm text-cream">
              {current.title}
            </h2>

            <p className="mb-6 text-center font-sans text-sm leading-relaxed text-cream/70">
              {current.body}
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={dismiss}
                className="font-terminal text-lg text-cream/40 hover:text-cream/70 transition-colors"
              >
                {t('onboarding.skip')}
              </button>

              <PixelButton
                variant="tomato"
                onClick={() => {
                  if (isLast) {
                    dismiss()
                  } else {
                    setStep((s) => s + 1)
                  }
                }}
              >
                {isLast ? t('tutorial.readyToCook') : t('onboarding.next')}
              </PixelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
