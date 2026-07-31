import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import IngredientShelf from '@/components/cooking/IngredientShelf'
import CookingPot from '@/components/cooking/CookingPot'
import AIAdvisor from '@/components/cooking/AIAdvisor'
import TasteMemoryCard from '@/components/cooking/TasteMemoryCard'
import AIAnalysisPanel from '@/components/ai/AIAnalysisPanel'
import FlavorDNA from '@/components/ai/FlavorDNA'
import { generateFeedback } from '@/engine/memoryEngine'
import { predictFlavor, recommendIngredient } from '@/engine/aiChefEngine'
import { INGREDIENTS, type Ingredient } from '@/types/food'
import { useLanguage } from '@/i18n/LanguageContext'
import { useAICompanion } from '@/engine/aiCompanionContext'

interface FlyingItem {
  key: number
  ingredient: Ingredient
  fromX: number
  fromY: number
  toX: number
  toY: number
}

interface CreateDishProps {
  onBack: () => void
  onStartCooking: (dish: Ingredient[]) => void
}

const AMBIENT = [
  { c: 'bg-tomato', x: '6%', y: '18%', s: 9 },
  { c: 'bg-cheese', x: '92%', y: '12%', s: 8 },
  { c: 'bg-mint', x: '88%', y: '70%', s: 10 },
  { c: 'bg-grape', x: '4%', y: '78%', s: 7 },
]

/** The AI Memory Cooking Studio: pick ingredients, feed the pot, get memory advice. */
export default function CreateDish({ onBack, onStartCooking }: CreateDishProps) {
  const { t, lang } = useLanguage()
  const { setMood, showMessage } = useAICompanion()
  const [selected, setSelected] = useState<Ingredient[]>([])
  const [flying, setFlying] = useState<FlyingItem[]>([])
  const potRef = useRef<HTMLDivElement>(null)
  const flySeq = useRef(0)
  const prevLenRef = useRef(0)

  const selectedIds = selected.map((i) => i.id)
  const hasProtein = selected.some((i) => i.category === 'protein')
  const ready = selected.length >= 3 && hasProtein
  const feedback = useMemo(() => generateFeedback(selected, lang), [selected, lang])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiPanelDismissed, setAIPanelDismissed] = useState(false)

  const flavor = useMemo(() => predictFlavor(selected), [selected])

  // AI Companion: set curious mood on enter
  useEffect(() => {
    setMood('curious')
  }, [setMood])

  // AI Companion: show ingredient choice message when adding new ingredient
  useEffect(() => {
    if (selected.length > prevLenRef.current && selected.length <= 3) {
      showMessage(t('companion.ingredientChoice'), 5000)
    }
    prevLenRef.current = selected.length
  }, [selected.length, showMessage, t])

  // Auto-show AI analysis when 3 ingredients are selected
  useEffect(() => {
    if (selected.length >= 3 && !aiPanelDismissed) {
      const timer = setTimeout(() => {
        setShowAIPanel(true)
        setMood('thinking')
        showMessage(t('companion.analyzing'), 8000)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [selected.length, aiPanelDismissed, setMood, showMessage, t])

  function handleKeepRecipe() {
    setShowAIPanel(false)
    onStartCooking(selected)
  }

  function handleAiAddSuggestion() {
    const rec = recommendIngredient(selected, INGREDIENTS)
    if (rec && !selectedIds.includes(rec.id)) {
      setSelected((prev) => [...prev, rec])
    }
    // Dismiss panel, return to ingredient picking
    setShowAIPanel(false)
    setAIPanelDismissed(true)
    setMood('curious')
  }

  function handleCloseAIPanel() {
    setShowAIPanel(false)
    setAIPanelDismissed(true)
    setMood('curious')
  }

  function handlePick(ingredient: Ingredient, e: MouseEvent<HTMLButtonElement>) {
    // Already in the pot → click removes it.
    if (selectedIds.includes(ingredient.id)) {
      setSelected((prev) => prev.filter((i) => i.id !== ingredient.id))
      return
    }
    const pot = potRef.current?.getBoundingClientRect()
    const key = ++flySeq.current
    setFlying((prev) => [
      ...prev,
      {
        key,
        ingredient,
        fromX: e.clientX,
        fromY: e.clientY,
        toX: pot ? pot.left + pot.width / 2 : window.innerWidth / 2,
        toY: pot ? pot.top + pot.height * 0.45 : window.innerHeight / 2,
      },
    ])
  }

  function handleLand(item: FlyingItem) {
    setSelected((prev) =>
      prev.some((i) => i.id === item.ingredient.id) ? prev : [...prev, item.ingredient],
    )
    setFlying((prev) => prev.filter((f) => f.key !== item.key))
  }

  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      {/* Ambient floating pixels */}
      {AMBIENT.map((p, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute ${p.c}`}
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          animate={{ y: [0, -14, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Flying ingredient layer (click point → pot) */}
      <AnimatePresence>
        {flying.map((f) => (
          <motion.span
            key={f.key}
            className="pointer-events-none fixed left-0 top-0 z-50 text-3xl leading-none"
            initial={{ x: f.fromX - 15, y: f.fromY - 15, scale: 0.6, rotate: 0, opacity: 0.9 }}
            animate={{ x: f.toX - 15, y: f.toY - 15, scale: 1.4, rotate: 340, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 170, damping: 15 }}
            onAnimationComplete={() => handleLand(f)}
          >
            {f.ingredient.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <Container>
        {/* Page header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <PixelButton variant="ghost" onClick={onBack}>
            {t('common.back')}
          </PixelButton>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            className="font-pixel text-lg leading-relaxed text-cream sm:text-2xl"
          >
            {t('studio.title')}
          </motion.h1>
          <span className="hidden border-4 border-ink bg-grape px-3 py-1 font-pixel text-[8px] text-ink shadow-pixel-sm sm:inline-block">
            {t('studio.step')}
          </span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[290px_1fr_320px]">
          {/* Left: the fridge shelf */}
          <IngredientShelf ingredients={INGREDIENTS} selectedIds={selectedIds} onPick={handlePick} />

          {/* Center: the pot + start button */}
          <div className="flex flex-col items-center gap-8">
            <div ref={potRef} className="flex w-full justify-center">
              <CookingPot items={selected} ready={ready} />
            </div>

            <p className="text-center font-terminal text-lg text-cream/60">
              {t('studio.itemsCount', { n: selected.length, max: 3 })}{' '}
              {hasProtein ? (
                <span className="text-mint">{t('studio.proteinReady')}</span>
              ) : (
                <span className="text-tomato">{t('studio.needProtein')}</span>
              )}
            </p>

            <motion.div
              animate={ready ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={ready ? { duration: 1.2, repeat: Infinity } : undefined}
            >
              <PixelButton
                variant="tomato"
                disabled={!ready}
                onClick={() => onStartCooking(selected)}
                className="px-8 py-4 text-xs"
              >
                {t('studio.startCooking')}
              </PixelButton>
            </motion.div>
          </div>

          {/* Right: PIXEL's brain */}
          <div className="space-y-6">
            <AIAdvisor feedback={feedback} />
            <TasteMemoryCard profile={feedback.tasteProfile} />
            {/* Flavor DNA preview */}
            {selected.length > 0 && (
              <motion.div
                className="rounded border border-cream/10 bg-cream/5 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="mb-2 text-center font-pixel text-[10px] text-cream/50">
                  {t('studio.flavorDNA')}
                </p>
                <div className="mx-auto h-32 w-32">
                  <FlavorDNA prediction={flavor} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* AI Analysis Panel overlay */}
      <AnimatePresence>
        {showAIPanel && (
          <AIAnalysisPanel
            selected={selected}
            allIngredients={INGREDIENTS}
            lang={lang}
            t={t}
            onAddSuggestion={handleAiAddSuggestion}
            onKeepRecipe={handleKeepRecipe}
            onClose={handleCloseAIPanel}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
