import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import AIReflection from '@/components/memory/AIReflection'
import TasteDNA from '@/components/memory/TasteDNA'
import DishMemoryCard from '@/components/memory/DishMemoryCard'
import MemoryTimeline from '@/components/memory/MemoryTimeline'
import FutureSuggestion from '@/components/memory/FutureSuggestion'
import { generatePersonalityReport } from '@/engine/personalityEngine'
import { generateDishVisual } from '@/engine/dishImageEngine'
import type { CookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'
import { useLanguage } from '@/i18n/LanguageContext'

interface SavedDishEntry {
  dishName: string
  ingredients: string[]
  score: { taste: number; creativity: number; nutrition: number }
  method: string
  createdAt: string
}

interface TasteMemoryPageProps {
  result: CookingResult
  dish: Ingredient[]
  onBack: () => void
  onCookAgain: () => void
}

/**
 * Taste Memory — the AI learning destination.
 * Shows personal taste profile, cooking history, and AI understanding.
 */
export default function TasteMemoryPage({
  result,
  dish,
  onBack,
  onCookAgain,
}: TasteMemoryPageProps) {
  const { t, lang } = useLanguage()
  const [savedDishes, setSavedDishes] = useState<SavedDishEntry[]>([])

  // Load all saved dishes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pixel-chef-dishes')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setSavedDishes(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const report = useMemo(
    () => generatePersonalityReport(dish, result.score, result.events, result.dishName, lang),
    [dish, result, lang],
  )

  const sessionCount = savedDishes.length

  // Compute top preferences from all saved dishes
  const topPreferences = useMemo(() => {
    const allIngredients: string[] = []
    const allMethods: string[] = []

    for (const entry of savedDishes) {
      for (const ing of entry.ingredients) {
        allIngredients.push(ing)
      }
      if (entry.method) allMethods.push(entry.method)
    }

    // Count frequencies
    const ingFreq: Record<string, number> = {}
    for (const ing of allIngredients) { ingFreq[ing] = (ingFreq[ing] || 0) + 1 }
    const topIngs = Object.entries(ingFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    const methodFreq: Record<string, number> = {}
    for (const m of allMethods) { methodFreq[m] = (methodFreq[m] || 0) + 1 }
    const topMethod = Object.entries(methodFreq).sort((a, b) => b[1] - a[1])[0]

    // Average score
    const avgScore = savedDishes.length > 0
      ? Math.round(savedDishes.reduce((sum, d) => sum + Math.round((d.score.taste + d.score.creativity + d.score.nutrition) / 3), 0) / savedDishes.length)
      : 0

    return { topIngs, topMethod, avgScore }
  }, [savedDishes])

  // Generate pixel artwork visual config for memory
  const dishVisual = useMemo(() => {
    const avg = Math.round((result.score.taste + result.score.creativity + result.score.nutrition) / 3)
    return generateDishVisual(dish, avg)
  }, [dish, result.score])

  // AI understanding statement
  const understandingText = useMemo(() => {
    if (sessionCount <= 1) {
      return t('memory.noHistory')
    }
    const methodLabel = topPreferences.topMethod
      ? topPreferences.topMethod[0].replace('stir-fry', 'Stir-fry').replace('steam', 'Steam').replace('boil', 'Boil').replace('fry', 'Deep fry').replace('bake', 'Bake').replace('braise', 'Braise')
      : ''
    return `After ${sessionCount} cooking sessions, I learned you prefer: ${topPreferences.topIngs.map(([name]) => name).join(' + ')} ${methodLabel ? `cooked via ${methodLabel}` : ''}`
  }, [sessionCount, topPreferences, t])

  // Check if ingredients suggest preferences
  const detectedPreferences = useMemo(() => {
    const allTags: string[] = []
    for (const ing of dish) {
      if (ing.tasteTags) allTags.push(...ing.tasteTags)
    }
    const hasCrispy = allTags.includes('crispy')
    const hasSpicy = allTags.includes('spicy')
    const hasUmami = allTags.includes('umami')
    const hasFresh = allTags.includes('fresh')
    const hasSweet = allTags.includes('sweet')

    const resultTags: string[] = []
    if (hasCrispy) resultTags.push('crispy texture')
    if (hasSpicy) resultTags.push('spicy flavor')
    if (hasUmami) resultTags.push('umami depth')
    if (hasFresh) resultTags.push('fresh ingredients')
    if (hasSweet) resultTags.push('sweet notes')
    return resultTags
  }, [dish])

  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-grape/4 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-mint/4 blur-3xl" />
        <div className="absolute left-1/2 top-2/3 h-40 w-40 rounded-full bg-cheese/4 blur-3xl" />
      </div>

      {/* Floating ambient pixels */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.span
            key={i}
            className="absolute block h-1.5 w-1.5 bg-cream/10"
            style={{
              left: `${8 + i * 12}%`,
              top: `${12 + (i % 4) * 18}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3.5 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <Container className="flex flex-col items-center gap-8">
        {/* ================================================================ */}
        {/*  0. AI Understanding Banner (NEW)                                 */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl rounded-lg border border-grape/20 bg-grape/5 p-5 text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex gap-px">
              {[0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1].map((v, i) => (
                <div key={i} className={`h-2 ${v ? 'w-1 bg-grape' : 'w-px bg-transparent'}`} />
              ))}
            </div>
            <span className="font-mono text-[9px] text-grape/60 uppercase tracking-widest">
              AI Taste Analysis
            </span>
          </div>

          <p className="mb-3 font-pixel text-sm leading-relaxed text-cream">
            {sessionCount > 1 ? t('memory.aiUnderstanding') : t('memory.firstCookAI')}
          </p>

          {/* Understanding statement */}
          {sessionCount > 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-sans text-sm italic leading-relaxed text-cream/70"
            >
              &ldquo;{understandingText}&rdquo;
            </motion.p>
          )}

          {/* Session stats bar */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-1.5 rounded border border-cream/10 bg-cream/3 px-3 py-1.5">
              <span className="font-pixel text-base text-cheese">{sessionCount}</span>
              <span className="font-mono text-[9px] text-cream/50 uppercase">Sessions</span>
            </div>
            {sessionCount >= 2 && topPreferences.avgScore > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-cream/10 bg-cream/3 px-3 py-1.5">
                <span className="font-pixel text-base text-mint">{topPreferences.avgScore}%</span>
                <span className="font-mono text-[9px] text-cream/50 uppercase">Avg Score</span>
              </div>
            )}
            {topPreferences.topMethod && sessionCount >= 2 && (
              <div className="flex items-center gap-1.5 rounded border border-cream/10 bg-cream/3 px-3 py-1.5">
                <span className="font-pixel text-sm text-sky">🔥</span>
                <span className="font-mono text-[9px] text-cream/50 uppercase">
                  Fav: {topPreferences.topMethod[0]}
                </span>
              </div>
            )}
            {detectedPreferences.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-cream/10 bg-cream/3 px-3 py-1.5">
                <span className="font-pixel text-sm text-grape">🧬</span>
                <span className="font-mono text-[9px] text-cream/50 uppercase max-w-32 truncate">
                  {detectedPreferences.slice(0, 2).join(', ')}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/*  1. AI Reflection (typewriter diary)                             */}
        {/* ================================================================ */}
        <AIReflection text={report.memory} />

        {/* ================================================================ */}
        {/*  2. Taste DNA (personality archetype + traits)                   */}
        {/* ================================================================ */}
        <TasteDNA
          personality={report.personality}
          traits={report.traits}
          delay={1200}
        />

        {/* ================================================================ */}
        {/*  3. Cooking History Timeline (NEW)                                */}
        {/* ================================================================ */}
        {sessionCount >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-[8px] text-cream/40 uppercase tracking-widest">
                Cooking History
              </span>
              <div className="h-px flex-1 bg-cream/10" />
            </div>
            <div className="space-y-2">
              {savedDishes.slice(-4).reverse().map((entry, i) => {
                const avg = Math.round((entry.score.taste + entry.score.creativity + entry.score.nutrition) / 3)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 + i * 0.1 }}
                    className="flex items-center gap-3 rounded border border-cream/10 bg-cream/3 p-3"
                  >
                    {/* Score badge */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-cheese/30 bg-cheese/10">
                      <span className="font-pixel text-xs text-cheese">{avg}</span>
                    </div>
                    {/* Dish info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-pixel text-xs text-cream/80">{entry.dishName}</p>
                      <p className="truncate font-mono text-[9px] text-cream/40">
                        {entry.ingredients.join(', ')}
                        {entry.method ? ` · ${entry.method}` : ''}
                      </p>
                    </div>
                    {/* Date */}
                    <span className="flex-shrink-0 font-mono text-[8px] text-cream/30">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/*  4. Dish Memory Card (latest dish)                               */}
        {/* ================================================================ */}
        <DishMemoryCard
          dishName={result.dishName}
          ingredients={dish}
          score={result.score}
          visualConfig={dishVisual}
          aiNote={
            dish.some((i) => i.tasteTags.includes('crispy'))
              ? 'User enjoys crispy garlic flavor and bold seasoning.'
              : dish.some((i) => i.id === 'chili')
                ? 'Spice tolerance is increasing. User prefers complex heat layers.'
                : 'User leans toward balanced, well-rounded flavor profiles.'
          }
          delay={1800}
        />

        {/* ================================================================ */}
        {/*  5. Memory Timeline (Day 1 → Today → Future)                    */}
        {/* ================================================================ */}
        <MemoryTimeline
          dishName={result.dishName}
          futureDish={report.suggestion.dish}
          todayVisual={dishVisual}
          delay={2400}
        />

        {/* ================================================================ */}
        {/*  6. Future Suggestion                                            */}
        {/* ================================================================ */}
        <FutureSuggestion report={report} delay={3000} />

        {/* ================================================================ */}
        {/*  7. Actions                                                      */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <PixelButton variant="ghost" onClick={onBack}>
            {t('memory.backToKitchen')}
          </PixelButton>
          <PixelButton variant="tomato" onClick={onCookAgain}>
            {t('memory.cookNew')}
          </PixelButton>
        </motion.div>
      </Container>
    </section>
  )
}
