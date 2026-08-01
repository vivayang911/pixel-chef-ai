import { useState, useEffect, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Ingredient } from '@/types/food'
import { INGREDIENTS } from '@/types/food'
import { predictFlavor } from '@/engine/aiChefEngine'
import FlavorDNA from '@/components/ai/FlavorDNA'
import PixelButton from '@/components/ui/PixelButton'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type DemoStep =
  | 'memory-init'
  | 'fridge-scan'
  | 'flavor-analysis'
  | 'recipe-create'
  | 'auto-cook'
  | 'dish-reveal'

interface DemoStepConfig {
  key: DemoStep
  duration: number
  label: string
}

const DEMO_STEPS: DemoStepConfig[] = [
  { key: 'memory-init', duration: 3000, label: 'AI MEMORY INITIALIZING' },
  { key: 'fridge-scan', duration: 3000, label: 'SMART FRIDGE SCANNING' },
  { key: 'flavor-analysis', duration: 4000, label: 'AI FLAVOR ANALYSIS' },
  { key: 'recipe-create', duration: 5000, label: 'AI RECIPE CREATION' },
  { key: 'auto-cook', duration: 10000, label: 'AI COOKING MODE' },
  { key: 'dish-reveal', duration: 5000, label: 'DISH REVEAL' },
]

interface DemoModeProps {
  onNavigate: (route: string) => void
  onClose: () => void
}

/* ------------------------------------------------------------------ */
/*  Demo ingredients                                                   */
/* ------------------------------------------------------------------ */

const DEMO_INGREDIENT_IDS = ['pork-belly', 'broccoli', 'mushroom']
const DEMO_INGREDIENTS: Ingredient[] = INGREDIENTS.filter((i) =>
  DEMO_INGREDIENT_IDS.includes(i.id),
)

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const ProgressBar = memo(function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-ink/60 rounded-full overflow-hidden border border-cream/10">
        <motion.div
          className="h-full bg-grape rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <span className="text-cream/40 text-[10px] font-mono">
        {current + 1}/{total}
      </span>
    </div>
  )
})

const PixelChefAvatar = memo(function PixelChefAvatar({
  scanning,
}: {
  scanning: boolean
}) {
  return (
    <div className="relative w-24 h-24 mx-auto">
      {/* 8-bit chef face */}
      <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-0.5">
        {[
          [0, 1, 1, 0],
          [1, 1, 1, 1],
          [1, 0, 0, 1],
          [1, 1, 1, 1],
        ].flatMap((row, ri) =>
          row.map((val, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={`rounded-sm ${val ? 'bg-cream' : 'bg-transparent'}`}
            />
          )),
        )}
      </div>
      {/* Toque (chef hat) */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <div className="w-10 h-2 bg-cream/90 rounded-t-sm" />
        <div className="w-14 h-4 bg-cream/80 rounded-t-sm -mt-0.5" />
      </div>
      {/* Scanning ring */}
      {scanning && (
        <motion.div
          className="absolute inset-0 -m-2 rounded-full border-2 border-grape/50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
})

const FridgeScan = memo(function FridgeScan({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="relative w-40 h-48 mx-auto mt-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Fridge body */}
          <div className="absolute inset-0 border-2 border-cream/30 bg-ink/80 rounded-lg">
            {/* Interior light */}
            <motion.div
              className="absolute inset-2 bg-cream/5 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            {/* Handle */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-cream/20 rounded-full" />
          </div>

          {/* Ingredients appearing from fridge */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
            {DEMO_INGREDIENTS.map((ing, i) => (
              <motion.div
                key={ing.id}
                className="flex flex-col items-center"
                initial={{ y: -40, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5 + i * 0.6,
                  type: 'spring',
                  stiffness: 150,
                }}
              >
                <motion.span
                  className="text-2xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 2,
                    delay: 1.2 + i * 0.6,
                    repeat: Infinity,
                  }}
                >
                  {ing.emoji}
                </motion.span>
                <motion.span
                  className="text-cream/70 text-[9px] font-mono mt-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.6 }}
                >
                  {ing.name}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const AutoCookIndicators = memo(function AutoCookIndicators() {
  const indicators = [
    { label: 'Heat', icon: '🔥', color: '#ff6b6b' },
    { label: 'Timing', icon: '⏱', color: '#ffa94d' },
    { label: 'Flavor', icon: '🧬', color: '#da77f2' },
    { label: 'Nutrition', icon: '🥗', color: '#51cf66' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-xs mx-auto mt-4">
      {indicators.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex items-center gap-2 px-3 py-2 border border-cream/10 bg-cream/3 rounded"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.2 }}
        >
          <motion.span
            className="text-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          >
            {item.icon}
          </motion.span>
          <div>
            <p className="text-cream/80 text-xs font-mono">{item.label}</p>
            <motion.div
              className="mt-1 h-1 rounded-full"
              style={{ backgroundColor: item.color, width: '100%' }}
              animate={{ width: ['30%', '80%', '95%', '100%'] }}
              transition={{
                duration: 8,
                delay: 0.5 + i * 0.3,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
})

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DemoMode({ onNavigate, onClose }: DemoModeProps) {
  const { t } = useLanguage()
  const [stepIndex, setStepIndex] = useState(0)
  const [exiting, setExiting] = useState(false)

  const currentStep = DEMO_STEPS[stepIndex]
  const isLastStep = stepIndex >= DEMO_STEPS.length

  const demoFlavor = useMemo(
    () => predictFlavor(DEMO_INGREDIENTS),
    [],
  )

  // Progress through steps automatically
  useEffect(() => {
    if (isLastStep) return

    // Navigate at specific steps
    if (currentStep.key === 'recipe-create') {
      // After a brief delay, navigate to studio and let app auto-select
      const navTimer = setTimeout(() => onNavigate('studio'), 800)
      return () => clearTimeout(navTimer)
    }

    if (currentStep.key === 'auto-cook') {
      // Auto-cooking: navigate to cooking story
      const navTimer = setTimeout(() => onNavigate('story'), 800)
      return () => clearTimeout(navTimer)
    }

    if (currentStep.key === 'dish-reveal') {
      // Navigate to result
      const navTimer = setTimeout(() => onNavigate('result'), 800)
      return () => clearTimeout(navTimer)
    }

    // For internal steps, just advance the timer
    const timer = setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, DEMO_STEPS.length - 1))
    }, currentStep.duration)

    return () => clearTimeout(timer)
  }, [stepIndex, isLastStep, currentStep, onNavigate])

  const handleSkip = () => {
    setExiting(true)
    setTimeout(() => onClose(), 400)
  }

  // Step content
  const renderStepContent = () => {
    switch (currentStep.key) {
      case 'memory-init':
        return (
          <div className="flex flex-col items-center gap-4">
            <PixelChefAvatar scanning />
            <motion.p
              className="text-cream/60 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.label}
            </motion.p>
            <motion.p
              className="text-cream/80 text-sm max-w-xs text-center leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              "Hello Chef.
              <br />
              I am learning your taste memory..."
            </motion.p>
            {/* Memory grid animation */}
            <div className="grid grid-cols-6 gap-1 mt-2">
              {Array.from({ length: 18 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-sm"
                  style={{
                    backgroundColor:
                      i % 3 === 0 ? '#A855F7' : i % 3 === 1 ? '#FBBF24' : '#34D399',
                    opacity: 0.3 + Math.random() * 0.5,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.08,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
        )

      case 'fridge-scan':
        return (
          <div className="flex flex-col items-center gap-4">
            <motion.p
              className="text-cream/60 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.label}
            </motion.p>
            <FridgeScan show />
            <motion.p
              className="text-cream/80 text-sm max-w-xs text-center leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              "I found ingredients in your kitchen."
            </motion.p>
          </div>
        )

      case 'flavor-analysis':
        return (
          <div className="flex flex-col items-center gap-4">
            <motion.p
              className="text-cream/60 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.label}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <FlavorDNA prediction={demoFlavor} />
            </motion.div>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {(['Spicy', 'Rich', 'Fresh', 'Nutrition'] as const).map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-cream/70 text-[10px] font-mono px-2 py-1 border border-cream/10 rounded"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.3 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="text-cream/80 text-sm max-w-xs text-center leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              "Your taste profile prefers rich flavors with balanced nutrition."
            </motion.p>
          </div>
        )

      case 'recipe-create':
        return (
          <div className="flex flex-col items-center gap-4">
            <motion.p
              className="text-cream/60 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.label}
            </motion.p>
            <motion.div
              className="w-20 h-20 rounded-full border-2 border-grape/40 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-3xl">📖</span>
            </motion.div>
            <motion.p
              className="text-cream/80 text-sm max-w-xs text-center leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              "AI is creating your comfort recipe..."
            </motion.p>
            <motion.div
              className="mt-2 px-4 py-1.5 border border-grape/30 bg-grape/10 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-grape/80 text-xs font-mono">
                Entering AI Cooking Studio →
              </span>
            </motion.div>
          </div>
        )

      case 'auto-cook':
        return (
          <div className="flex flex-col items-center gap-3">
            <motion.p
              className="text-cream/60 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.label}
            </motion.p>
            <motion.p
              className="text-grape font-bold text-lg font-mono"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              AUTO COOK WITH AI
            </motion.p>
            <AutoCookIndicators />
            <motion.p
              className="text-cream/50 text-[10px] font-mono mt-2"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI controlling the cooking process...
            </motion.p>
          </div>
        )

      case 'dish-reveal':
        return (
          <div className="flex flex-col items-center gap-4">
            <motion.p
              className="text-cream/60 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.label}
            </motion.p>
            <motion.div
              className="w-24 h-24 rounded-full border-2 border-grape/30 flex items-center justify-center bg-grape/5"
              animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 0px #a855f7', '0 0 30px #a855f7', '0 0 0px #a855f7'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="text-4xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                🍽️
              </motion.span>
            </motion.div>
            <motion.p
              className="text-cream/80 text-sm max-w-xs text-center leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              "Created from your ingredients.
              <br />
              Designed for your taste."
            </motion.p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {!exiting && stepIndex < DEMO_STEPS.length && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress bar */}
          <ProgressBar current={stepIndex} total={DEMO_STEPS.length} />

          {/* Step content */}
          <motion.div
            key={currentStep.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            {renderStepContent()}
          </motion.div>

          {/* Skip button */}
          <motion.div
            className="absolute bottom-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <PixelButton variant="ghost" onClick={handleSkip}>
              Skip Demo →
            </PixelButton>
          </motion.div>

          {/* Bottom pixel decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-grape/30 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
