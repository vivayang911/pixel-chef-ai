import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PixelButton from '@/components/ui/PixelButton'

const STEPS = [
  {
    emoji: '🧊',
    title: 'Open the Fridge',
    body: 'Your pixel fridge is packed with fresh ingredients waiting to be discovered.',
  },
  {
    emoji: '🥬',
    title: 'Pick Ingredients',
    body: 'Click on any ingredient to toss it into the cooking pot. Mix proteins, veggies, and flavors!',
  },
  {
    emoji: '🤖',
    title: 'Cook with AI',
    body: 'PIXEL remembers your taste and gives real-time advice. Fire events, timing, and creativity all count.',
  },
  {
    emoji: '📝',
    title: 'Save Your Memory',
    body: 'After each cook, PIXEL writes a diary entry, discovers your taste DNA, and suggests your next dish.',
  },
]

const LS_KEY = 'pixel-chef-tutorial-seen'

/**
 * First-visit onboarding overlay.
 * Checks localStorage so it only plays once per browser.
 */
export default function OnboardingTutorial() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

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
            {/* Step indicator dots */}
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

            {/* Emoji */}
            <div className="mb-4 text-center text-4xl">{current.emoji}</div>

            {/* Title */}
            <h2 className="mb-3 text-center font-pixel text-sm text-cream">
              {current.title}
            </h2>

            {/* Body */}
            <p className="mb-6 text-center font-sans text-sm leading-relaxed text-cream/70">
              {current.body}
            </p>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={dismiss}
                className="font-terminal text-lg text-cream/40 hover:text-cream/70 transition-colors"
              >
                Skip
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
                {isLast ? '🎮 Let\'s Cook!' : 'Next ▶'}
              </PixelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
