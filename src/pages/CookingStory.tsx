import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelChefAnimation from '@/components/cooking/story/PixelChefAnimation'
import CookingTimer from '@/components/cooking/story/CookingTimer'
import CookingTimeline from '@/components/cooking/story/CookingTimeline'
import CookingEvent from '@/components/cooking/story/CookingEvent'
import FireEffect from '@/components/cooking/story/FireEffect'
import {
  COOKING_EVENTS,
  computeCookingResult,
  getRecommendedTime,
  nameDish,
  scheduleEvents,
} from '@/engine/cookingEngine'
import type { CookingResult, CookingEventDef, CookingEventType } from '@/engine/cookingEngine'
import type { ChefAnimState } from '@/components/cooking/story/PixelChefAnimation'
import type { Ingredient } from '@/types/food'
import { useLanguage } from '@/i18n/LanguageContext'
import { generateCookingAdvice, getRandomPhrase } from '@/engine/aiChefEngine'
import TypingText from '@/components/ai/TypingText'
import { useAICompanion } from '@/engine/aiCompanionContext'

interface CookingStoryProps {
  dish: Ingredient[]
  onFinish: (result: CookingResult) => void
}

/* ------------------------------------------------------------------ */
/*  AI companion messages                                              */
/* ------------------------------------------------------------------ */

const RANDOM_CHAT: string[] = [
  'I remember you like crispy texture… this smells amazing 👃',
  'The oil is shimmering — almost time 🔥',
  'This combination is so YOU ✨',
  'A little patience goes a long way in the kitchen ⏳',
  'The sizzle tells me we are on the right track 🥘',
  'Your spice level is just right today 🌶',
  'Every chef has their own rhythm. Yours is beautiful 🎵',
]

/* ------------------------------------------------------------------ */
/*  Page state machine types                                           */
/* ------------------------------------------------------------------ */

type StoryPhase = 'intro' | 'cooking' | 'finishing'

/* ------------------------------------------------------------------ */
/*  CookingStory — the full cooking simulation                         */
/* ------------------------------------------------------------------ */

export default function CookingStory({ dish, onFinish }: CookingStoryProps) {
  // --- State ---
  const { t, lang } = useLanguage()
  const { setMood, showMessage } = useAICompanion()
  const recommended = useMemo(() => getRecommendedTime(dish), [dish])
  const [phase, setPhase] = useState<StoryPhase>('intro')
  const [remaining, setRemaining] = useState(recommended)
  const [timerPaused, setTimerPaused] = useState(false)
  const [activeEvent, setActiveEvent] = useState<CookingEventDef | null>(null)
  const [aiText, setAiText] = useState('')
  const [firedEvents, setFiredEvents] = useState<CookingEventType[]>([])
  const [aiAutoMode, setAiAutoMode] = useState(false)
  const [showAutoPanel, setShowAutoPanel] = useState(false)
  const [autoProgress, setAutoProgress] = useState(0)
  const [aiBonus, setAiBonus] = useState(0)
  // --- Refs ---
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const eventTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const hasStarted = useRef(false)

  const progress = 1 - remaining / recommended
  const dishName = nameDish(dish)

  // --- Chef state ----------------------------------------------------
  const chefState: ChefAnimState = useMemo(() => {
    if (phase === 'intro') return 'idle'
    if (phase === 'finishing') return 'success'
    if (progress < 0.25) return 'prepare'
    if (progress < 0.7) return 'cook'
    return 'taste'
  }, [phase, progress])

  // --- Timestep ------------------------------------------------------
  const tick = useCallback(() => {
    setRemaining((prev) => Math.max(0, prev - 1))
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  // --- Fire an event -------------------------------------------------
  const triggerEvent = useCallback(
    (type: CookingEventType) => {
      const def = COOKING_EVENTS.find((e) => e.id === type)
      if (!def) return
      setTimerPaused(true)
      setActiveEvent(def)
      setFiredEvents((prev) => [...prev, type])
      // Use AI-generated advice text
      const advice = generateCookingAdvice(dish, type, progress, lang)
      setAiText(advice.message)

      if (aiAutoMode) {
        // Auto-resolve quickly in AI mode
        const t = setTimeout(() => {
          handleAutoResolveEvent(type)
          setAiText(getRandomPhrase(lang))
        }, 1200)
        eventTimers.current.push(t)
      } else {
        // Normal unpause after event card duration
        const t = setTimeout(() => {
          setActiveEvent(null)
          setTimerPaused(false)
        }, def.duration * 1000)
        eventTimers.current.push(t)
      }
    },
    [aiAutoMode, dish, progress, lang, handleAutoResolveEvent],
  )

  // --- Handle event fix (user clicks FIX during AI guidance) ----------
  const handleFixEvent = useCallback(() => {
    if (!activeEvent) return
    setAiBonus((prev) => prev + 5)
    setTimerPaused(false)
    setActiveEvent(null)
    // Show AI gratitude
    const advice = generateCookingAdvice(dish, activeEvent.id, progress, lang)
    setAiText(`✅ ${advice.message.split('.')[0]}. (Score +5)`)
  }, [activeEvent, dish, progress, lang])

  // --- AI auto-handle events -----------------------------------------
  const handleAutoResolveEvent = useCallback((eventType: CookingEventType) => {
    if (eventType === 'fireTooHigh' || eventType === 'tooFast') {
      setAiBonus((prev) => prev + 3)
    }
    setActiveEvent(null)
    setTimerPaused(false)
  }, [])

  // --- Finish cooking ------------------------------------------------
  const finishCooking = useCallback(() => {
    stopTimer()
    setPhase('finishing')
    const elapsed = recommended - Math.max(remaining, 0)
    const baseResult = computeCookingResult(dish, elapsed, recommended, firedEvents, lang)
    // Apply AI bonus
    const result: CookingResult = {
      ...baseResult,
      score: {
        ...baseResult.score,
        taste: Math.min(100, baseResult.score.taste + aiBonus),
        creativity: Math.min(100, baseResult.score.creativity + Math.floor(aiBonus * 0.6)),
      },
    }
    // Small delay for the chef to react
    setTimeout(() => onFinish(result), 2000)
  }, [stopTimer, dish, recommended, remaining, firedEvents, onFinish, aiBonus])

  // --- Auto-finish when timer hits 0 ----------------------------------
  useEffect(() => {
    if (phase === 'cooking' && remaining <= 0) {
      finishCooking()
    }
  }, [remaining, phase, finishCooking])

  // --- Main cooking loop: intro → start timer -------------------------
  useEffect(() => {
    if (phase !== 'cooking') return
    if (hasStarted.current) return
    hasStarted.current = true

    // Schedule events
    const schedule = scheduleEvents(recommended)
    for (const { type, atRemaining } of schedule) {
      const delay = (recommended - atRemaining) * 1000
      const t = setTimeout(() => triggerEvent(type), delay)
      eventTimers.current.push(t)
    }

    // Timer tick (respects pause, runs faster in AI auto mode)
    intervalRef.current = setInterval(() => {
      setTimerPaused((paused) => {
        if (!paused) tick()
        if (aiAutoMode && !paused) {
          setAutoProgress((prev) => Math.min(100, prev + 100 / recommended))
        }
        return paused
      })
    }, 1000)
  }, [phase, recommended, triggerEvent, tick, aiAutoMode])

  // --- Random AI chat during cooking ----------------------------------
  useEffect(() => {
    if (phase !== 'cooking') return
    const pick = () => {
      if (activeEvent) return // keep event message
      // Small chance of random chat
      if (Math.random() > 0.35) return
      setAiText(RANDOM_CHAT[Math.floor(Math.random() * RANDOM_CHAT.length)])
    }
    pick()
    const id = setInterval(pick, 4500)
    return () => clearInterval(id)
  }, [phase, activeEvent])

  // --- AI Companion: focused cooking mood ---
  useEffect(() => {
    if (phase === 'cooking') {
      setMood('focused')
      showMessage(t('companion.cooking'), 10000)
    }
  }, [phase, setMood, showMessage, t])

  // --- Intro → cooking auto-transition --------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('cooking')
      setAiText(t('cooking.aiIntro'))
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // --- Cleanup --------------------------------------------------------
  useEffect(() => () => {
    stopTimer()
    eventTimers.current.forEach(clearTimeout)
  }, [stopTimer])

  // --- Timeline helper ------------------------------------------------
  const timelinePhase = progress < 0.25 ? 'heat' : progress < 0.5 ? 'sizzle' : progress < 0.75 ? 'season' : 'finish'

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <section className="relative flex min-h-[calc(100vh-200px)] flex-col overflow-hidden">
      {/* Steam ambient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-12 opacity-30">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 bg-cream/60"
            animate={{ y: [0, -50], opacity: [0.4, 0, 0.4], scale: [1, 2] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeOut' }}
            style={{ marginLeft: i * 20 }}
          />
        ))}
      </div>

      <Container className="flex flex-1 flex-col items-center justify-between py-8">
        {/* ── Top: AI Status Bar ── */}
        <div className="flex w-full max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={phase === 'cooking' && !timerPaused ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <PixelChefAnimation state={chefState} />
            </motion.div>

            <div>
              <span
                className={`inline-block border-2 border-ink px-2 py-0.5 font-pixel text-[7px] shadow-pixel-sm ${
                  phase === 'intro'
                    ? 'bg-cheese text-ink'
                    : phase === 'finishing'
                      ? 'bg-mint text-ink'
                      : 'bg-tomato text-ink'
                }`}
              >
                {phase === 'intro' ? t('cooking.getReady') : phase === 'finishing' ? t('cooking.done') : t('cooking.cooking')}
              </span>
              <h1
                className="mt-1 max-w-48 truncate font-pixel text-[11px] text-cream sm:text-base"
                title={dishName}
              >
                {dishName}
              </h1>
            </div>
          </div>

          {phase === 'intro' && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-blink bg-cheese" />
              <span className="font-terminal text-base text-cream/70">{t('cooking.warmingUp')}</span>
            </div>
          )}
        </div>

        {/* ── Middle: Chef + Pot + Fire ── */}
        <div className="relative flex flex-1 items-center justify-center py-8">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative flex flex-col items-center"
          >
            {/* Chef center stage */}
            <div className="relative">
              <PixelChefAnimation state={chefState} />

              {/* Pot beneath chef */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <svg
                  viewBox="0 0 48 28"
                  className="h-auto w-28"
                  shapeRendering="crispEdges"
                  aria-hidden
                >
                  <rect x="0" y="10" width="6" height="4" fill="#3d3570" />
                  <rect x="42" y="10" width="6" height="4" fill="#3d3570" />
                  <rect x="6" y="6" width="36" height="3" fill="#5a4fa0" />
                  <rect x="4" y="14" width="40" height="12" fill="#2c2550" />
                  <rect x="4" y="14" width="5" height="12" fill="#3d3570" />
                  <rect x="4" y="22" width="40" height="4" fill="#15122b" />
                  <rect x="30" y="18" width="3" height="3" fill="#ffcb3b" />
                  <rect x="10" y="26" width="4" height="2" fill="#15122b" />
                  <rect x="34" y="26" width="4" height="2" fill="#15122b" />
                </svg>

                {/* Fire under pot */}
                {phase === 'cooking' && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2">
                    <FireEffect
                      intensity={
                        activeEvent?.id === 'fireTooHigh'
                          ? 'high'
                          : progress > 0.5
                            ? 'medium'
                            : 'low'
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Event popup overlay */}
          <CookingEvent
            event={activeEvent}
            onFix={handleFixEvent}
            showActions={!aiAutoMode && activeEvent !== null}
          />
        </div>

        {/* ── AI Chat Bubble ── */}
        <AnimatePresence mode="wait">
          {aiText && (
            <motion.div
              key={aiText}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto mb-6 w-full max-w-lg border-4 border-ink bg-ink-panel px-5 py-3 shadow-pixel"
            >
              {/* Bubble tail */}
              <div className="absolute -top-[6px] left-6 h-3 w-3 rotate-45 border-l-4 border-t-4 border-ink bg-ink-panel" />
              <p className="font-sans text-sm leading-relaxed text-cream/90">
                <TypingText text={aiText} speed={35} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom: Timer + Timeline + Button ── */}
        <div className="flex w-full max-w-2xl flex-col gap-5">
          {/* Timer */}
          {phase === 'cooking' && (
            <div className="flex items-center justify-between">
              <CookingTimer remaining={remaining} total={recommended} paused={timerPaused} />
              <span className="hidden font-terminal text-base text-cream/40 sm:inline">
                {recommended - remaining}s / {recommended}s
              </span>
            </div>
          )}

          {/* Timeline */}
          <CookingTimeline phase={timelinePhase} progress={progress} firedEvents={firedEvents} />

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {phase === 'cooking' && !aiAutoMode && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: remaining <= 10 ? 1 : remaining > recommended * 0.8 ? 0.3 : 1,
                    y: 0,
                  }}
                >
                  <PixelButton
                    variant="tomato"
                    disabled={remaining > recommended * 0.8}
                    onClick={finishCooking}
                  >
                    ⏹ {t('cooking.finishButton')}
                  </PixelButton>
                </motion.div>

                {/* AI Auto Cook button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <PixelButton
                    variant="ghost"
                    onClick={() => {
                      setAiAutoMode(true)
                      setShowAutoPanel(true)
                      setAiText('🤖 ' + t('cooking.aiCooking'))
                    }}
                    className="border-cheese text-cheese text-[10px]"
                  >
                    🤖 {t('cooking.autoCook')}
                  </PixelButton>
                </motion.div>
              </>
            )}

            {/* AI Auto Cook Progress Panel */}
            <AnimatePresence>
              {aiAutoMode && showAutoPanel && phase === 'cooking' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed bottom-8 left-1/2 z-30 w-80 -translate-x-1/2 rounded border-2 border-cheese bg-ink p-4 shadow-pixel"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🤖
                    </motion.span>
                    <p className="font-pixel text-sm text-cheese">{t('cooking.aiCooking')}</p>
                  </div>

                  {/* Analysis steps */}
                  <div className="space-y-1.5 mb-3">
                    {[
                      { label: 'Heat', key: '✓' },
                      { label: 'Timing', key: autoProgress > 25 ? '✓' : '○' },
                      { label: 'Flavor', key: autoProgress > 50 ? '✓' : '○' },
                      { label: 'Nutrition', key: autoProgress > 75 ? '✓' : '○' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className={`font-terminal text-xs ${item.key === '✓' ? 'text-mint' : 'text-cream/30'}`}>
                          {item.key}
                        </span>
                        <span className="font-terminal text-[10px] text-cream/60">
                          {t('cooking.analyzing')}: {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Optimization progress */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-pixel text-[8px] text-cream/50">
                        {t('cooking.aiOptimizing')}
                      </span>
                      <span className="font-pixel text-xs text-cheese">{autoProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream/10">
                      <motion.div
                        className="h-full rounded-full bg-cheese"
                        initial={{ width: 0 }}
                        animate={{ width: `${autoProgress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === 'finishing' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-terminal text-base text-cheese"
              >
                {t('cooking.tasting')}
              </motion.p>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
