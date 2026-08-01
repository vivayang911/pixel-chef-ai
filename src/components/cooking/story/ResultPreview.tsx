import { useState, useEffect, useMemo, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'
import {
  generateDishVisual,
  generateAIStory,
  generateFlavorDecisions,
  generateSmokeParticles,
  generatePixelParticles,
} from '@/engine/dishImageEngine'
import type {
  AIStory,
  FlavorDecision,
  SmokeParticle,
  PixelParticle,
} from '@/engine/dishImageEngine'
import PixelPanel from '@/components/ui/PixelPanel'
import PixelButton from '@/components/ui/PixelButton'
import { useLanguage } from '@/i18n/LanguageContext'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  result: CookingResult
  ingredients: Ingredient[]
  method?: string
  flavorProfile?: string
  onFinish?: () => void
  onRetry: () => void
  onBack?: () => void
  onMemory?: () => void
}

type RevealStage = 'dark' | 'smoke' | 'reveal' | 'particles' | 'celebrate' | 'score' | 'story' | 'decisions' | 'actions'

const STAGE_ORDER: RevealStage[] = [
  'dark',
  'smoke',
  'reveal',
  'particles',
  'celebrate',
  'score',
  'story',
  'decisions',
  'actions',
]

const STAGE_DELAYS: Record<RevealStage, number> = {
  dark: 800,
  smoke: 1200,
  reveal: 1000,
  particles: 800,
  celebrate: 600,
  score: 800,
  story: 600,
  decisions: 600,
  actions: 400,
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const SmokeEffect = memo(function SmokeEffect({ particles }: { particles: SmokeParticle[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cream/20"
          style={{
            left: `calc(50% + ${p.x}px)`,
            bottom: '20%',
            width: p.size,
            height: p.size * 0.7,
          }}
          initial={{ opacity: 0, y: 0, scale: 0.3 }}
          animate={{
            opacity: [0, p.opacity, 0],
            y: p.y,
            scale: [0.3, 1.5, 2.5],
            x: p.drift,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
})

const PixelBurst = memo(function PixelBurst({
  particles,
  show,
}: {
  particles: PixelParticle[]
  show: boolean
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {show &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                left: '50%',
                top: '42%',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
})

const ChefCelebration = memo(function ChefCelebration({ show }: { show: boolean }) {
  const emojis = ['🎉', '✨', '👨‍🍳', '🔥', '⭐', '💫', '🌟', '🎊']

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {emojis.map((emoji, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              initial={{ y: 0, scale: 0 }}
              animate={{
                y: [0, -20, 0],
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.12,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const ScoreBar = memo(function ScoreBar({
  label,
  score,
  color,
  delay,
  show,
}: {
  label: string
  score: number
  color: string
  delay: number
  show: boolean
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay }}
        >
          <span className="text-cream/80 text-xs w-20 text-right font-mono uppercase tracking-wider">
            {label}
          </span>
          <div className="flex-1 h-3 bg-ink/60 rounded-sm border border-cream/10 overflow-hidden relative">
            <motion.div
              className="h-full rounded-sm"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
            />
            {/* Pixel notch markers */}
            {[25, 50, 75].map((notch) => (
              <div
                key={notch}
                className="absolute top-0 h-full w-px bg-ink/40"
                style={{ left: `${notch}%` }}
              />
            ))}
          </div>
          <motion.span
            className="text-cream font-mono text-sm w-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + 1 }}
          >
            {score}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const AIStorySection = memo(function AIStorySection({
  story,
  show,
}: {
  story: AIStory
  show: boolean
}) {
  const { t } = useLanguage()
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="mt-6 px-4 py-4 border border-grape/30 bg-grape/5 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-grape/90 text-xs uppercase tracking-widest mb-2 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('result.aiChefStory')}
          </motion.p>
          <motion.h3
            className="text-cream font-bold text-sm mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {story.title}
          </motion.h3>
          <motion.p
            className="text-cream/70 text-xs leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {story.narrative}
          </motion.p>
          <motion.p
            className="text-grape/60 text-xs italic mt-2 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {story.signature}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const FlavorDecisionCard = memo(function FlavorDecisionCard({
  decision,
  index,
  show,
}: {
  decision: FlavorDecision
  index: number
  show: boolean
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex items-start gap-3 px-3 py-2 border border-cream/10 bg-cream/3 rounded"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 }}
        >
          <span className="text-lg flex-shrink-0 mt-0.5">{decision.icon}</span>
          <div className="min-w-0">
            <p className="text-cream/90 text-xs font-mono truncate">{decision.title}</p>
            <p className="text-cream/50 text-[10px] leading-relaxed">{decision.description}</p>
            <span className="text-cream/25 text-[9px] font-mono">{decision.timing}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

/* ------------------------------------------------------------------ */
/*  Pixel Dish — Emoji-based guaranteed visual                        */
/* ------------------------------------------------------------------ */

/** Maps ingredient categories to emoji representations */
const DISH_EMOJI: Record<string, string> = {
  pork: '🥓',
  'pork belly': '🥩',
  beef: '🥩',
  chicken: '🍗',
  salmon: '🍣',
  tuna: '🐟',
  tofu: '🧈',
  egg: '🥚',
  rice: '🍚',
  noodle: '🍜',
  ramen: '🍜',
  bread: '🍞',
  lettuce: '🥬',
  tomato: '🍅',
  broccoli: '🥦',
  carrot: '🥕',
  corn: '🌽',
  potato: '🥔',
  mushroom: '🍄',
  cheese: '🧀',
  default: '🍲',
}

/** Maps cooking method to container emoji */
const METHOD_BOWL: Record<string, string> = {
  boil: '🍲',
  steam: '🥟',
  stir_fry: '🥘',
  fry: '🍳',
  grill: '🥩',
  bake: '🫕',
  raw: '🍣',
  default: '🍽️',
}

function getDishEmojis(ingredients: readonly Ingredient[]): string[] {
  const emojis = ingredients
    .map((ing) => {
      const key = ing.name.toLowerCase().trim()
      return DISH_EMOJI[key] ?? ing.emoji ?? DISH_EMOJI.default
    })
    .slice(0, 5)
  return emojis.length > 0 ? emojis : [DISH_EMOJI.default]
}

const FallbackPixelDish = memo(function FallbackPixelDish({
  ingredients,
  method,
  dishName,
}: {
  ingredients: readonly Ingredient[]
  method: string
  dishName: string
}) {
  const emojis = getDishEmojis(ingredients)
  const bowl = METHOD_BOWL[method] ?? METHOD_BOWL.default

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ minHeight: 'clamp(140px, 30vh, 300px)' }}
      aria-hidden="true"
    >
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          imageRendering: 'pixelated',
          filter:
            'drop-shadow(0 0 16px rgba(168,85,247,0.3)) drop-shadow(0 0 6px rgba(251,191,36,0.2))',
        }}
      >
        {/* Bowl / plate emoji background */}
        <div className="text-center leading-none" style={{ fontSize: 'clamp(80px, 20vw, 160px)' }}>
          {bowl}
        </div>

        {/* Ingredient emojis layered above */}
        <div
          className="absolute inset-0 flex items-center justify-center flex-wrap gap-1"
          style={{
            padding: '8px',
            fontSize: 'clamp(24px, 6vw, 52px)',
            lineHeight: 1,
          }}
        >
          {emojis.map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.15,
                type: 'spring',
                stiffness: 200,
              }}
              className="inline-block"
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        {/* Dish name below */}
        <div
          className="mt-1 px-3 py-0.5 rounded bg-cream/10 border border-cream/15"
          style={{ fontSize: 'clamp(10px, 1.5vw, 13px)' }}
        >
          <span className="text-cream/60 font-mono tracking-wider uppercase">
            {dishName}
          </span>
        </div>
      </div>
    </div>
  )
})

const AIDecisionCheck = memo(function AIDecisionCheck({
  text,
  show,
  delay,
}: {
  text: string
  show: boolean
  delay: number
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex items-center gap-3 px-3 py-2 border border-cream/5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay }}
        >
          <motion.span
            className="text-green-400 text-sm flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: delay + 0.2 }}
          >
            ✓
          </motion.span>
          <span className="text-cream/70 text-xs font-mono">{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

/* ------------------------------------------------------------------ */
/*  Derivation Helpers                                                 */
/* ------------------------------------------------------------------ */

function deriveMethod(ingredients: Ingredient[], result: CookingResult): string {
  const hasProtein = ingredients.some((i) => i.category === 'protein')
  const categories = new Set(ingredients.map((i) => i.category))
  const isFresh = categories.has('vegetable') && !hasProtein

  if (result.score.creativity >= 80) return 'grill'
  if (result.score.taste >= 80 && hasProtein) return 'stirFry'
  if (hasProtein && categories.has('seasoning')) return 'deepFry'
  if (isFresh) return 'steam'
  if (hasProtein) return 'simmer'
  return 'bake'
}

function deriveFlavorProfile(ingredients: Ingredient[]): string {
  const flavorTotals = { spicy: 0, rich: 0, fresh: 0, sweet: 0, savory: 0 }

  // Use known flavor traits per ingredient category
  for (const ing of ingredients) {
    const id = ing.id ?? ''
    if (id.includes('chili')) flavorTotals.spicy += 2
    if (id.includes('pork') || id.includes('belly')) flavorTotals.rich += 2
    if (id.includes('broccoli') || id.includes('herb')) flavorTotals.fresh += 2
    if (id.includes('carrot') || id.includes('sweet')) flavorTotals.sweet += 2
    if (id.includes('garlic') || id.includes('mushroom')) flavorTotals.savory += 2
    if (id.includes('chicken')) { flavorTotals.rich += 1; flavorTotals.savory += 1 }
    if (id.includes('fish')) { flavorTotals.fresh += 2; flavorTotals.savory += 1 }
  }

  // Find the dominant flavor
  const entries = Object.entries(flavorTotals) as [string, number][]
  entries.sort((a, b) => b[1] - a[1])

  return entries[0]?.[0] ?? 'savory'
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ResultPreview({
  result,
  ingredients,
  method: methodProp,
  flavorProfile: flavorProfileProp,
  onFinish,
  onRetry,
  onBack,
  onMemory: _onMemory,
}: Props) {
  const { t } = useLanguage()
  const [stage, setStage] = useState<RevealStage>('dark')
  const [showParticles, setShowParticles] = useState(false)

  // Derive method and flavor profile from ingredients if not provided
  const method = useMemo(
    () => methodProp ?? deriveMethod(ingredients, result),
    [methodProp, ingredients, result],
  )

  const flavorProfile = useMemo(
    () => flavorProfileProp ?? deriveFlavorProfile(ingredients),
    [flavorProfileProp, ingredients],
  )

  const finishAction = onFinish ?? onBack ?? (() => {})

  // Generate all data
  const dishVisual = useMemo(
    () => {
      const visual = generateDishVisual(ingredients, method, flavorProfile, result.score.taste)
      console.log('[ResultPreview] dishVisual:', {
        layers: visual.layers?.length,
        containerLabel: visual.containerLabel,
        dishTitle: visual.dishTitle,
        effect: visual.effect,
        method: visual.method,
        baseColor: visual.baseColor,
        accentColor: visual.accentColor,
        layersDetail: visual.layers?.map(l => ({
          type: l.type,
          shape: l.shape,
          x: l.x,
          y: l.y,
          width: l.width,
          height: l.height,
          color: l.color,
          emoji: l.emoji,
        })),
      })
      return visual
    },
    [ingredients, method, flavorProfile, result.score.taste],
  )

  const aiStory = useMemo(
    () => generateAIStory(result, ingredients, method, flavorProfile),
    [result, ingredients, method, flavorProfile],
  )

  const flavorDecisions = useMemo(
    () => generateFlavorDecisions(result, ingredients, method, flavorProfile),
    [result, ingredients, method, flavorProfile],
  )

  const smokeParticles = useMemo(() => generateSmokeParticles(30), [])
  const pixelParticles = useMemo(
    () =>
      generatePixelParticles(40, [
        dishVisual.baseColor,
        dishVisual.accentColor,
        dishVisual.garnishColor,
        '#FBBF24',
        '#A855F7',
      ]),
    [dishVisual],
  )

  // Progress through stages
  useEffect(() => {
    const currentIndex = STAGE_ORDER.indexOf(stage)
    if (currentIndex < STAGE_ORDER.length - 1) {
      const delay = STAGE_DELAYS[stage]
      const timer = setTimeout(() => {
        const nextStage = STAGE_ORDER[currentIndex + 1]
        setStage(nextStage)
        if (nextStage === 'particles') {
          setShowParticles(true)
        }
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [stage])

  const stageIndex = STAGE_ORDER.indexOf(stage)
  const isAtLeast = useCallback(
    (s: RevealStage) => STAGE_ORDER.indexOf(s) <= stageIndex,
    [stageIndex],
  )

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 py-8">
      <PixelPanel glow="grape" className="w-full max-w-lg relative overflow-visible">
        {/* Synthesizing text — stage dark */}
        <AnimatePresence>
          {stage === 'dark' && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-ink/90 z-20"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="text-grape font-mono text-sm tracking-[0.3em] uppercase"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {t('result.synthesizing')}
              </motion.p>
              <motion.div className="mt-4 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-grape/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dish Area with relative positioning for effects */}
        <div className="relative flex flex-col items-center py-6 min-h-[280px]">
          {/* Smoke effect */}
          {isAtLeast('smoke') && <SmokeEffect particles={smokeParticles} />}

          {/* Pixel burst */}
          <PixelBurst particles={pixelParticles} show={showParticles} />

          {/* Chef celebration */}
          <ChefCelebration show={isAtLeast('celebrate')} />

          {/* Dish artwork */}
          <AnimatePresence>
            {isAtLeast('reveal') && (
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 120,
                  damping: 12,
                }}
              >
                {/* Steam/sizzle/glow effect indicator */}
                {dishVisual.effect === 'steam' && (
                  <motion.div
                    className="absolute inset-0 -top-8 flex justify-center gap-4 z-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-8 bg-cream/15 rounded-full"
                        animate={{
                          y: [-10, -30],
                          opacity: [0.3, 0],
                          scaleX: [1, 1.8],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {dishVisual.effect === 'sizzle' && (
                  <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {Array.from({ length: 6 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: dishVisual.accentColor,
                          left: `${40 + Math.random() * 20}%`,
                          top: `${60 + Math.random() * 20}%`,
                        }}
                        animate={{
                          y: [-2, -20, -40],
                          opacity: [0.8, 0.4, 0],
                          x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30],
                        }}
                        transition={{
                          duration: 1 + Math.random(),
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {dishVisual.effect === 'glow' && (
                  <motion.div
                    className="absolute inset-0 rounded-full z-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${dishVisual.accentColor}20 0%, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {dishVisual.effect === 'frost' && (
                  <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {Array.from({ length: 6 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cream/40 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.4,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Emoji-based pixel dish — primary visual that always renders */}
                <FallbackPixelDish
                  ingredients={ingredients}
                  method={method}
                  dishName={result.dishName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dish Name */}
        <AnimatePresence>
          {isAtLeast('reveal') && (
            <motion.h2
              className="text-center text-cream font-bold text-xl mt-2 font-mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {result.dishName}
            </motion.h2>
          )}
        </AnimatePresence>

        {/* Score section */}
        <div className="mt-4 space-y-2 px-4">
          <AnimatePresence>
            {isAtLeast('score') && (
              <motion.p
                className="text-cream/50 text-[10px] uppercase tracking-widest font-mono mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {t('result.cookingAnalysis')}
              </motion.p>
            )}
          </AnimatePresence>

          <ScoreBar
            label={t('result.taste')}
            score={result.score.taste}
            color="#A855F7"
            delay={0}
            show={isAtLeast('score')}
          />
          <ScoreBar
            label={t('result.creativity')}
            score={result.score.creativity}
            color="#FBBF24"
            delay={0.2}
            show={isAtLeast('score')}
          />
          <ScoreBar
            label={t('result.nutrition')}
            score={result.score.nutrition}
            color="#34D399"
            delay={0.4}
            show={isAtLeast('score')}
          />

          <AnimatePresence>
            {isAtLeast('score') && (
              <motion.div
                className="text-center mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <span className="text-cream/70 text-xs font-mono">{t('result.totalScore')} </span>
                <motion.span
                  className="text-grape font-bold text-2xl font-mono"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 10,
                    delay: 1.2,
                  }}
                >
                  {Math.round(
                    (result.score.taste + result.score.creativity + result.score.nutrition) / 3,
                  )}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chef Story */}
        <AIStorySection story={aiStory} show={isAtLeast('story')} />

        {/* WHY AI CREATED THIS — key decision summary */}
        <AnimatePresence>
          {isAtLeast('decisions') && (
            <motion.div
              className="mt-5 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-cream/50 text-[10px] uppercase tracking-widest font-mono mb-3">
                WHY AI CREATED THIS
              </p>
              <div className="space-y-2">
                <AIDecisionCheck
                  text="Balanced protein and vegetables"
                  show={isAtLeast('decisions')}
                  delay={0.2}
                />
                <AIDecisionCheck
                  text="Adjusted flavor based on your taste preference"
                  show={isAtLeast('decisions')}
                  delay={0.4}
                />
                <AIDecisionCheck
                  text="Optimized nutrition balance for your health goal"
                  show={isAtLeast('decisions')}
                  delay={0.6}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flavor Decision Panel */}
        <AnimatePresence>
          {isAtLeast('decisions') && (
            <motion.div
              className="mt-5 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-cream/50 text-[10px] uppercase tracking-widest font-mono mb-3">
                {t('result.aiDecisionLog')}
              </p>
              <div className="space-y-2">
                {flavorDecisions.map((decision, i) => (
                  <FlavorDecisionCard
                    key={i}
                    decision={decision}
                    index={i}
                    show={isAtLeast('decisions')}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <AnimatePresence>
          {isAtLeast('actions') && (
            <motion.div
              className="mt-6 px-4 pb-2 flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PixelButton
                variant="outline"
                onClick={onRetry}
                className="flex-1 text-xs"
              >
                {t('result.tryAgain')}
              </PixelButton>
              <PixelButton
                variant="primary"
                onClick={finishAction}
                className="flex-1 text-xs"
              >
                {t('common.finish')}
              </PixelButton>
            </motion.div>
          )}
        </AnimatePresence>
      </PixelPanel>
    </div>
  )
}
