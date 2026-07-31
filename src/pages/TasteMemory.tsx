import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import AIReflection from '@/components/memory/AIReflection'
import TasteDNA from '@/components/memory/TasteDNA'
import DishMemoryCard from '@/components/memory/DishMemoryCard'
import MemoryTimeline from '@/components/memory/MemoryTimeline'
import FutureSuggestion from '@/components/memory/FutureSuggestion'
import { generatePersonalityReport } from '@/engine/personalityEngine'
import type { CookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'

interface TasteMemoryPageProps {
  result: CookingResult
  dish: Ingredient[]
  onBack: () => void
  onCookAgain: () => void
}

/**
 * The final emotional destination of Pixel Chef AI.
 * PIXEL reflects on the cooking journey, reveals the chef's
 * taste DNA, records the memory, and suggests the next adventure.
 */
export default function TasteMemoryPage({
  result,
  dish,
  onBack,
  onCookAgain,
}: TasteMemoryPageProps) {
  const report = useMemo(
    () => generatePersonalityReport(dish, result.score, result.events, result.dishName),
    [dish, result],
  )

  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      {/* Floating ambient pixels */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="absolute block h-1.5 w-1.5 bg-cream/10"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 22}%`,
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
        {/*  3. Dish Memory Card                                             */}
        {/* ================================================================ */}
        <DishMemoryCard
          dishName={result.dishName}
          ingredients={dish}
          score={result.score}
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
        {/*  4. Memory Timeline (Day 1 → Today → Future)                    */}
        {/* ================================================================ */}
        <MemoryTimeline
          dishName={result.dishName}
          futureDish={report.suggestion.dish}
          delay={2400}
        />

        {/* ================================================================ */}
        {/*  5. Future Suggestion                                            */}
        {/* ================================================================ */}
        <FutureSuggestion report={report} delay={3000} />

        {/* ================================================================ */}
        {/*  6. Actions                                                      */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <PixelButton variant="ghost" onClick={onBack}>
            ◀ Back to Kitchen
          </PixelButton>
          <PixelButton variant="tomato" onClick={onCookAgain}>
            🔄 Cook Something New
          </PixelButton>
        </motion.div>
      </Container>
    </section>
  )
}
