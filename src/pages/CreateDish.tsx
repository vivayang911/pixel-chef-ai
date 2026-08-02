import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import IngredientShelf from '@/components/cooking/IngredientShelf'
import CookingPot from '@/components/cooking/CookingPot'
import AIAdvisor from '@/components/cooking/AIAdvisor'
import TasteMemoryCard from '@/components/cooking/TasteMemoryCard'
import AIAnalysisPanel from '@/components/ai/AIAnalysisPanel'
import CookingMethodSelector from '@/components/cooking/CookingMethodSelector'
import type { CookingMethod } from '@/components/cooking/CookingMethodSelector'
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
  onStartCooking: (dish: Ingredient[], method: string) => void
  /** When provided, auto-selects these ingredients on mount (demo mode) */
  autoSelectIngredients?: Ingredient[]
}

const AMBIENT = [
  { c: 'bg-tomato', x: '6%', y: '18%', s: 9 },
  { c: 'bg-cheese', x: '92%', y: '12%', s: 8 },
  { c: 'bg-mint', x: '88%', y: '70%', s: 10 },
  { c: 'bg-grape', x: '4%', y: '78%', s: 7 },
]

/** Floating AI data nodes for premium studio feel */
const AI_STUDIO_NODES = [
  { label: 'TASTE DB', c: 'bg-grape/60', x: '12%', y: '8%', duration: 3.5 },
  { label: 'FLAVOR AI', c: 'bg-mint/60', x: '82%', y: '6%', duration: 4.2 },
  { label: 'PAIRING', c: 'bg-cheese/60', x: '76%', y: '82%', duration: 3.8 },
  { label: 'NUTRITION', c: 'bg-sky/60', x: '18%', y: '84%', duration: 4.5 },
]

/** AI scanning status messages */
const SCAN_STATUS_MSGS = [
  'Taste profile loaded...',
  'Flavor pairing matrix ready...',
  'Nutrition database synced...',
  'Cooking method optimal...',
]

/** The AI Memory Cooking Studio: pick ingredients, feed the pot, get memory advice. */
export default function CreateDish({
  onBack,
  onStartCooking,
  autoSelectIngredients,
}: CreateDishProps) {
  const { t, lang } = useLanguage()
  const { setMood, showMessage } = useAICompanion()
  const [selected, setSelected] = useState<Ingredient[]>([])
  const [showMethodSelector, setShowMethodSelector] = useState(false)
  const [pendingIngredients, setPendingIngredients] = useState<Ingredient[]>([])
  const [flying, setFlying] = useState<FlyingItem[]>([])
  const [demoAutoStarted, setDemoAutoStarted] = useState(false)
  const potRef = useRef<HTMLDivElement>(null)
  const flySeq = useRef(0)
  const prevLenRef = useRef(0)

  const selectedIds = selected.map((i) => i.id)
  const hasProtein = selected.some((i) => i.category === 'protein')
  const ready = selected.length >= 3 && hasProtein
  const feedback = useMemo(() => generateFeedback(selected, lang), [selected, lang])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiPanelDismissed, setAIPanelDismissed] = useState(false)
  const [aiScanStatus, setAiScanStatus] = useState(0)

  const flavor = useMemo(() => predictFlavor(selected), [selected])

  // Rotate AI scan status messages when ingredients are selected but not enough
  useEffect(() => {
    if (selected.length > 0 && selected.length < 3) {
      const id = setInterval(() => {
        setAiScanStatus((prev) => (prev + 1) % SCAN_STATUS_MSGS.length)
      }, 2500)
      return () => clearInterval(id)
    }
  }, [selected.length])

  // AI Companion: set curious mood on enter
  useEffect(() => {
    setMood('curious')
  }, [setMood])

  // Auto-select ingredients for demo mode
  useEffect(() => {
    if (autoSelectIngredients && autoSelectIngredients.length > 0 && !demoAutoStarted) {
      setDemoAutoStarted(true)
      // Select ingredients one by one with delays for visual effect
      autoSelectIngredients.forEach((ing, i) => {
        setTimeout(() => {
          setSelected((prev) => {
            if (prev.find((s) => s.id === ing.id)) return prev
            return [...prev, ing]
          })
          showMessage(`Adding ${ing.name}... 🔍`, 2000)
        }, 500 + i * 600)
      })
      // Auto-trigger cooking after all ingredients are added
      setTimeout(() => {
        setSelected((prev) => {
          if (prev.length >= 3 && prev.some((s) => s.category === 'protein')) {
            // Delay the actual call to allow state to settle
            setTimeout(() => onStartCooking(prev, 'stir-fry'), 600)
          }
          return prev
        })
      }, 500 + autoSelectIngredients.length * 600 + 800)
    }
  }, [autoSelectIngredients, demoAutoStarted, showMessage, onStartCooking])

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
    setPendingIngredients(selected)
    setShowMethodSelector(true)
  }

  const handleMethodSelected = useCallback((method: CookingMethod) => {
    setShowMethodSelector(false)
    setTimeout(() => {
      onStartCooking(pendingIngredients, method)
    }, 320)
  }, [pendingIngredients, onStartCooking])

  const handleMethodBack = useCallback(() => {
    setShowMethodSelector(false)
    setPendingIngredients([])
  }, [])

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

  // Pairing confidence based on selected count
  const pairingConfidence = selected.length >= 3 ? 92 : selected.length >= 2 ? 65 : selected.length >= 1 ? 35 : 0

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

      {/* AI Studio Data Nodes */}
      {AI_STUDIO_NODES.map((node, i) => (
        <motion.div
          key={`node-${i}`}
          className="pointer-events-none absolute"
          style={{ left: node.x, top: node.y }}
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: node.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <motion.span className={`mx-auto block ${node.c}`} style={{ width: 4, height: 4 }} />
          <span className="block text-center font-mono text-[6px] text-cream/20 tracking-widest mt-0.5">
            {node.label}
          </span>
        </motion.div>
      ))}

      {/* Kitchen scanline effect */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cheese/5"
        animate={{ top: ['10%', '90%', '10%'], opacity: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">🧑‍🍳</span>
            <h1 className="font-pixel text-lg leading-relaxed text-cream sm:text-2xl">
              {t('studio.title')}
            </h1>
          </motion.div>
          {/* AI status badge */}
          <div className="flex items-center gap-2">
            {selected.length > 0 && selected.length < 3 && (
              <motion.span
                key={aiScanStatus}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.6, y: 0 }}
                className="hidden font-mono text-[9px] text-grape/60 sm:inline"
              >
                {SCAN_STATUS_MSGS[aiScanStatus]}
              </motion.span>
            )}
            <span className="hidden border-4 border-ink bg-grape px-3 py-1 font-pixel text-[8px] text-ink shadow-pixel-sm sm:inline-block">
              {t('studio.step')}
            </span>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[290px_1fr_320px]">
          {/* Left: the fridge shelf */}
          <IngredientShelf ingredients={INGREDIENTS} selectedIds={selectedIds} onPick={handlePick} />

          {/* Center: the pot + start button */}
          <div className="flex flex-col items-center gap-8">
            {/* AI pairing confidence indicator */}
            {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 border border-grape/20 bg-grape/5 px-4 py-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[8px] text-grape/60 uppercase tracking-wider">AI Pairing</span>
                  <span className="font-pixel text-sm text-grape">{pairingConfidence}%</span>
                </div>
                <div className="h-3 w-px bg-grape/20" />
                <div className="flex items-center gap-1">
                  {selected.map((ing) => (
                    <div
                      key={ing.id}
                      className="h-3 w-3 border border-grape/40 opacity-60"
                      style={{ backgroundColor: ing.color ?? '#5a4fa0' }}
                    />
                  ))}
                </div>
                {/* Connecting line animation */}
                {selected.length >= 2 && (
                  <motion.div
                    className="h-px w-8 bg-gradient-to-r from-grape/40 to-transparent"
                    animate={{ scaleX: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            )}

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

            {/* AI scan pulse for ready state */}
            {ready && !showAIPanel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  className="h-2 w-2 bg-mint"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-mono text-[9px] text-mint/70 uppercase tracking-wider">
                  AI Ready to analyze
                </span>
              </motion.div>
            )}

            <motion.div
              animate={ready ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={ready ? { duration: 1.2, repeat: Infinity } : undefined}
            >
              <PixelButton
                variant="tomato"
                disabled={!ready}
                onClick={() => { setPendingIngredients(selected); setShowMethodSelector(true) }}
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

      {/* Cooking Method Selector overlay */}
      <CookingMethodSelector
        visible={showMethodSelector}
        onSubmit={handleMethodSelected}
        onBack={handleMethodBack}
      />
    </section>
  )
}
