import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeIngredients, type AIAdvice, type AIMood } from '@/engine/aiChefEngine'
import type { Ingredient } from '@/types/food'
import type { Lang } from '@/i18n/translations'
import FlavorDNA from './FlavorDNA'
import PixelButton from '@/components/ui/PixelButton'

interface AIAnalysisPanelProps {
  selected: Ingredient[]
  allIngredients: Ingredient[]
  lang: Lang
  t: (key: string) => string
  onAddSuggestion: () => void
  onKeepRecipe: () => void
  onClose: () => void
}

const MOOD_EMOJI: Record<AIMood, string> = {
  curious: '🧐',
  happy: '😊',
  warning: '⚠️',
  excited: '🤩',
}

const SCAN_STEPS = [
  'Initializing taste analysis…',
  'Scanning ingredient profiles…',
  'Computing flavor matrix…',
  'Evaluating nutrition…',
  'Generating AI recommendations…',
]

export default function AIAnalysisPanel({
  selected,
  allIngredients,
  lang,
  t,
  onAddSuggestion,
  onKeepRecipe,
  onClose,
}: AIAnalysisPanelProps) {
  const [scanStep, setScanStep] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [advice, setAdvice] = useState<AIAdvice | null>(null)

  useEffect(() => {
    // Run the "scan" animation
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      setScanStep(currentStep)
      if (currentStep >= SCAN_STEPS.length) {
        clearInterval(interval)
        const result = analyzeIngredients(selected, allIngredients, lang)
        setAdvice(result)
        setTimeout(() => setShowResult(true), 400)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [selected, allIngredients, lang])

  if (!advice) {
    // Scanning phase
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="mx-4 w-full max-w-md rounded border-2 border-cheese bg-ink p-6"
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
        >
          {/* Pixel AI Avatar */}
          <div className="mb-4 flex flex-col items-center">
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-cheese bg-ink"
              animate={{ boxShadow: ['0 0 8px #ffcb3b', '0 0 24px #ffcb3b', '0 0 8px #ffcb3b'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="pixel-text text-[32px]">🤖</span>
              {/* Scan line */}
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-cheese"
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
            </motion.div>
            <p className="mt-2 font-pixel text-sm text-cheese">
              PIXEL AI ANALYSIS
            </p>
          </div>

          {/* Scan Steps */}
          <div className="space-y-2">
            {SCAN_STEPS.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: i <= scanStep ? 1 : 0.3 }}
              >
                <span className="font-terminal text-xs text-cream">
                  {i < scanStep ? '✓' : i === scanStep ? '▸' : '·'}
                </span>
                <span className="font-terminal text-[10px] text-cream/70">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream/10">
            <motion.div
              className="h-full rounded-full bg-cheese"
              initial={{ width: '0%' }}
              animate={{
                width: `${Math.min(100, (scanStep / SCAN_STEPS.length) * 100)}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Results phase
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/85 py-8 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="mx-4 w-full max-w-md rounded border-2 border-cheese bg-ink p-5"
          initial={{ scale: 0.85, y: 40 }}
          animate={showResult ? { scale: 1, y: 0 } : { scale: 0.85, y: 40 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          {/* Header with pixel AI */}
          <div className="mb-3 flex items-center gap-3">
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-mint bg-ink text-[28px]"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {MOOD_EMOJI[advice.mood]}
            </motion.div>
            <div className="flex-1">
              <p className="font-pixel text-sm text-mint">PIXEL AI ANALYSIS</p>
              <p className="font-terminal text-[11px] leading-tight text-cream/80">
                {advice.message}
              </p>
            </div>
          </div>

          {/* Flavor DNA Radar */}
          <div className="mb-4 rounded border border-cream/10 bg-cream/5 p-3">
            <p className="mb-1 text-center font-pixel text-[10px] text-cream/50">
              FLAVOR DNA
            </p>
            <div className="mx-auto h-36 w-36">
              <FlavorDNA prediction={advice.tastePrediction} />
            </div>
          </div>

          {/* Taste bars */}
          <div className="mb-3 space-y-2">
            {[
              { label: 'Richness', emoji: '🔥', value: advice.tastePrediction.rich, color: 'bg-tomato' },
              { label: 'Freshness', emoji: '🌱', value: advice.tastePrediction.fresh, color: 'bg-mint' },
              { label: 'Spice', emoji: '🌶', value: advice.tastePrediction.spicy, color: 'bg-cheese' },
              { label: 'Sweet', emoji: '🍬', value: advice.tastePrediction.sweet, color: 'bg-grape' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={showResult ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-0.5 flex items-center justify-between font-terminal text-[9px]">
                  <span className="text-cream/60">
                    {item.emoji} {item.label}
                  </span>
                  <span className="text-cream/80">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-cream/10">
                  <motion.div
                    className={`${item.color} h-full rounded-full`}
                    initial={{ width: 0 }}
                    animate={showResult ? { width: `${item.value}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nutrition */}
          <motion.div
            className="mb-3 rounded border border-cream/10 bg-cream/5 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={showResult ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <p className="mb-1 font-pixel text-[10px] text-cream/50">NUTRITION</p>
            <div className="flex items-center justify-between">
              <span className="font-terminal text-xs text-cream/70">
                Estimated Calories
              </span>
              <span className="font-pixel text-sm text-cheese">
                {advice.nutrition.calories} kcal
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="whitespace-nowrap font-terminal text-[9px] text-cream/40">
                Health Score
              </span>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-cream/10">
                <motion.div
                  className={`h-full rounded-full ${
                    advice.nutrition.healthScore >= 70 ? 'bg-mint' : advice.nutrition.healthScore >= 40 ? 'bg-cheese' : 'bg-tomato'
                  }`}
                  initial={{ width: 0 }}
                  animate={showResult ? { width: `${advice.nutrition.healthScore}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </div>
              <span className="font-pixel text-xs text-cream/70">
                {advice.nutrition.healthScore}
              </span>
            </div>
          </motion.div>

          {/* AI Suggestions */}
          {advice.suggestions.length > 0 && (
            <motion.div
              className="mb-4 rounded border border-cheese/30 bg-cheese/5 p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={showResult ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <p className="mb-1 font-pixel text-[10px] text-cheese">AI SUGGESTION</p>
              {advice.suggestions.map((s, i) => (
                <p key={i} className="font-terminal text-[10px] leading-relaxed text-cream/70">
                  "{s}"
                </p>
              ))}
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <PixelButton
              onClick={onAddSuggestion}
              variant="ghost"
              className="flex-1 text-xs border-cheese text-cheese"
            >
              🤖 ADD SUGGESTION
            </PixelButton>
            <PixelButton
              onClick={onKeepRecipe}
              variant="cheese"
              className="flex-1 text-xs"
            >
              KEEP MY RECIPE
            </PixelButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
