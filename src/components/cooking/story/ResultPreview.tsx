import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelPanel from '@/components/ui/PixelPanel'
import PixelButton from '@/components/ui/PixelButton'
import PixelChefAnimation from './PixelChefAnimation'
import PixelDishArtwork from '@/components/cooking/result/PixelDishArtwork'
import TypingText from '@/components/ai/TypingText'
import { useLanguage } from '@/i18n/LanguageContext'
import { useAICompanion } from '@/engine/aiCompanionContext'
import { generateDishVisual, generateDishReview } from '@/engine/dishImageEngine'
import type { CookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'

interface ResultPreviewProps {
  result: CookingResult
  ingredients: Ingredient[]
  onBack: () => void
  onRetry: () => void
  onMemory: () => void
}

function AnimatedNumber({ value }: { value: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / 30)
    const id = setInterval(() => {
      start = Math.min(start + step, value)
      setN(start)
      if (start >= value) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [value])
  return <span className="font-pixel text-2xl text-cream">{n}</span>
}

/** Final result screen: animated scores, pixel artwork, AI review, memory save. */
export default function ResultPreview({ result, ingredients, onBack, onRetry, onMemory }: ResultPreviewProps) {
  const { t } = useLanguage()
  const { setMood, showMessage } = useAICompanion()

  // AI Companion: set mood and message based on result
  useEffect(() => {
    if (result.success) {
      setMood('celebrate')
      showMessage(t('companion.success'), 8000)
    } else {
      setMood('comfort')
      showMessage(t('companion.failure'), 8000)
    }
  }, [result.success, setMood, showMessage, t])

  // Generate dish visual config
  const dishVisual = useMemo(() => {
    const avg = Math.round((result.score.taste + result.score.creativity + result.score.nutrition) / 3)
    return generateDishVisual(ingredients, avg)
  }, [ingredients, result.score])

  // Generate AI review
  const aiReview = useMemo(() => {
    const avg = Math.round((result.score.taste + result.score.creativity + result.score.nutrition) / 3)
    return generateDishReview(result.dishName, avg, ingredients)
  }, [result.dishName, result.score, ingredients])

  const SCORE_BARS: { key: keyof CookingResult['score']; color: string; emoji: string }[] = [
    { key: 'taste', color: 'bg-tomato', emoji: '👅' },
    { key: 'creativity', color: 'bg-grape', emoji: '🎨' },
    { key: 'nutrition', color: 'bg-mint', emoji: '💪' },
  ]

  const avg = Math.round(
    (result.score.taste + result.score.creativity + result.score.nutrition) / 3,
  )

  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      <Container className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="w-full max-w-xl"
        >
          {/* ================================================================ */}
          {/*  1. Pixel Dish Artwork                                            */}
          {/* ================================================================ */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <p className="mb-3 text-center font-pixel text-[8px] tracking-[0.3em] text-cream/50 uppercase">
              {t('result.dishCreated')}
            </p>
            <PixelDishArtwork config={dishVisual} />
          </motion.div>

          {/* ================================================================ */}
          {/*  2. Score Panel                                                   */}
          {/* ================================================================ */}
          <PixelPanel
            glow={result.success ? 'tomato' : 'cheese'}
            className="relative px-6 py-7 text-center"
          >
            <span
              className={`inline-block border-4 border-ink px-3 py-1 font-pixel text-[8px] shadow-pixel-sm ${
                result.success ? 'bg-tomato text-ink' : 'bg-cheese text-ink'
              }`}
            >
              {result.success ? t('result.cookingComplete') : t('result.flavorDiscovery')}
            </span>

            <h1 className="mt-4 font-pixel text-lg leading-relaxed text-cream sm:text-2xl">
              {result.dishName}
            </h1>

            <div className="mt-3 flex justify-center">
              <PixelChefAnimation state={result.success ? 'success' : 'fail'} />
            </div>

            {/* Animated score bars */}
            <div className="mt-5 space-y-3">
              {SCORE_BARS.map((bar, i) => (
                <div key={bar.key} className="flex items-center gap-3">
                  <span className="w-14 text-left font-pixel text-[7px] text-cream/70">
                    {t(`result.${bar.key}`)}
                  </span>
                  <span className="w-6 font-terminal text-base text-cream/50">{bar.emoji}</span>
                  <div className="flex-1 h-4 overflow-hidden border-2 border-ink bg-ink">
                    <motion.div
                      className={`h-full ${bar.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score[bar.key]}%` }}
                      transition={{ delay: 0.3 + i * 0.2, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="w-10 text-right font-pixel text-sm text-cream">
                    <AnimatedNumber value={result.score[bar.key]} />
                  </span>
                </div>
              ))}
            </div>

            {/* Overall score */}
            <div className="mt-5">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', stiffness: 260, damping: 16 }}
                className="inline-block border-4 border-ink bg-cheese px-4 py-1 font-pixel text-base text-ink shadow-pixel"
              >
                {t('result.pts', { n: avg })}
              </motion.span>
            </div>

            {/* AI message */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mx-auto mt-5 max-w-sm border-t-4 border-ink-line pt-4 font-sans text-sm leading-relaxed text-cream/80"
            >
              <TypingText text={result.message} speed={30} />
            </motion.p>

            {/* Memory update note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-3 font-terminal text-base text-grape"
            >
              {t('result.memoryNote')}
            </motion.p>
          </PixelPanel>

          {/* ================================================================ */}
          {/*  3. AI Chef Review                                               */}
          {/* ================================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mx-auto mt-4 max-w-lg rounded-xl border-2 border-cream/20 bg-surface/60 px-5 py-4 backdrop-blur"
          >
            <span className="font-terminal text-[8px] tracking-[0.25em] text-cream/50">
              {t('result.aiReview')}
            </span>
            <p className="mt-2 font-sans text-sm leading-relaxed text-cream/80 italic">
              &ldquo;
              <TypingText text={aiReview} speed={35} />
              &rdquo;
            </p>
          </motion.div>
        </motion.div>

        {/* ================================================================ */}
        {/*  4. Action Buttons                                                */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <PixelButton variant="ghost" onClick={onBack}>
            {t('result.backToKitchen')}
          </PixelButton>
          <PixelButton variant="tomato" onClick={onRetry}>
            {t('result.tryAgain')}
          </PixelButton>
          <PixelButton variant="grape" onClick={onMemory}>
            {t('result.saveToMemory')}
          </PixelButton>
        </motion.div>
      </Container>
    </section>
  )
}
