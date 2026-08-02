import { useEffect, useState, useMemo } from 'react'
import { motion, type Variants } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelChef from '@/components/ui/PixelChef'
import PixelFridge from './PixelFridge'
import SpeechBubble from './SpeechBubble'
import AIAssistantBadge from '@/components/ai/AIAssistantBadge'
import { useLanguage } from '@/i18n/LanguageContext'
import { getRandomPhrase } from '@/engine/aiChefEngine'
import { useAICompanion } from '@/engine/aiCompanionContext'

/* ------------------------------------------------------------------ */
/*  Stagger text animation                                             */
/* ------------------------------------------------------------------ */

const titleContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
}
const letter: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 22 } },
}

function StaggerText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.span
      variants={titleContainer}
      initial="hidden"
      animate="show"
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {text.split('').map((c, i) => (
        <motion.span key={i} variants={letter} className="inline-block" aria-hidden>
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/*  Floating AI status particles                                       */
/* ------------------------------------------------------------------ */

const FLOATING_NODES = [
  { c: 'bg-grape/80', x: '70%', y: '15%', s: 6, duration: 3.5, label: 'TASTE ENGINE' },
  { c: 'bg-mint/80', x: '85%', y: '40%', s: 5, duration: 4.2, label: 'NUTRITION DB' },
  { c: 'bg-sky/80', x: '65%', y: '70%', s: 7, duration: 3.8, label: 'MEMORY CORE' },
  { c: 'bg-cheese/80', x: '30%', y: '78%', s: 5, duration: 4.5, label: 'FLAVOR AI' },
  { c: 'bg-tomato/80', x: '18%', y: '22%', s: 6, duration: 3.2, label: 'PALETTE MATCH' },
]

const PARTICLES = [
  { c: 'bg-grape/40', x: '8%', y: '18%', s: 10, duration: 4.2 },
  { c: 'bg-cheese/40', x: '82%', y: '10%', s: 8, duration: 5.1 },
  { c: 'bg-mint/40', x: '72%', y: '68%', s: 12, duration: 4.8 },
  { c: 'bg-sky/40', x: '16%', y: '72%', s: 9, duration: 5.5 },
  { c: 'bg-grape/40', x: '48%', y: '6%', s: 7, duration: 3.8 },
  { c: 'bg-cream/30', x: '90%', y: '50%', s: 6, duration: 4.5 },
  { c: 'bg-tomato/30', x: '34%', y: '82%', s: 5, duration: 5.9 },
  { c: 'bg-cheese/30', x: '56%', y: '76%', s: 8, duration: 4.1 },
]

const STARS = [
  { x: '12%', y: '22%', delay: 0 },
  { x: '62%', y: '14%', delay: 0.7 },
  { x: '78%', y: '60%', delay: 1.3 },
  { x: '28%', y: '74%', delay: 1.9 },
  { x: '44%', y: '30%', delay: 0.4 },
]

/* ------------------------------------------------------------------ */
/*  AI status message rotator                                          */
/* ------------------------------------------------------------------ */

const AI_STATUS_MESSAGES = [
  'Memory synchronized',
  'Learning your taste...',
  'Flavor profile updating...',
  'Analyzing cooking patterns...',
  'Nutrition engine online',
  'Palette recognition active',
  'Recipe creativity: READY',
]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface MemoryKitchenProps {
  onStart?: () => void
  onWatchDemo?: () => void
}

export default function MemoryKitchen({ onStart, onWatchDemo }: MemoryKitchenProps) {
  const { t, lang } = useLanguage()
  const { setMood, showMessage } = useAICompanion()
  const [hasMemory, setHasMemory] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)

  // Check for saved memories
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pixel-chef-dishes')
      if (raw) {
        const dishes = JSON.parse(raw)
        if (Array.isArray(dishes) && dishes.length > 0) {
          setHasMemory(true)
        }
      }
    } catch {
      // no saved memory yet
    }
  }, [])

  // Rotate AI status messages
  useEffect(() => {
    const id = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % AI_STATUS_MESSAGES.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // AI Companion: set mood on mount, show personalized greeting
  useEffect(() => {
    setMood('happy')
    if (hasMemory) {
      showMessage(t('companion.welcomeBack'), 8000)
    } else {
      const timer = setTimeout(() => {
        showMessage(t('companion.letsDiscover'), 6000)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [hasMemory, setMood, showMessage, t])

  const greetingText = hasMemory
    ? getRandomPhrase(lang)
    : t('home.demoGreeting')
  const statusText = hasMemory
    ? t('home.statusMemory')
    : t('home.statusReady')

  // Random memory dishes count
  const memoryCount = useMemo(() => {
    try {
      const raw = localStorage.getItem('pixel-chef-dishes')
      if (raw) {
        const dishes = JSON.parse(raw)
        if (Array.isArray(dishes)) return dishes.length
      }
    } catch { /* noop */ }
    return 0
  }, [])

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-10 sm:pt-16">
      {/* Kitchen atmosphere background */}
      <div className="pointer-events-none absolute inset-0 bg-kitchen" />

      {/* Premium warm lighting layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-grape/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full bg-tomato/4 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cheese/3 blur-3xl" />
      </div>

      {/* Rising steam columns */}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={`steam-${i}`}
          className="pointer-events-none absolute top-1/2 block h-10 w-1.5 rounded-none bg-cream/10 blur-sm"
          style={{ left: `${48 + i * 7}%` }}
          animate={{
            y: [0, -40, -80],
            opacity: [0, 0.3, 0],
            scaleX: [1, 1.8, 2.5],
          }}
          transition={{
            duration: 3.2 + i * 0.6,
            repeat: Infinity,
            delay: i * 1.1,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Floating AI nodes with labels */}
      {FLOATING_NODES.map((node, i) => (
        <motion.div
          key={`node-${i}`}
          className="pointer-events-none absolute"
          style={{ left: node.x, top: node.y }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        >
          {/* Node dot */}
          <motion.span
            className={`block ${node.c} mx-auto`}
            style={{ width: node.s, height: node.s }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Connection line */}
          <motion.div
            className="mx-auto mt-1 h-px w-8 bg-cream/5"
            animate={{ width: [8, 28, 8], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
          />
          {/* Label */}
          <span className="block text-center font-mono text-[6px] text-cream/25 tracking-widest mt-0.5">
            {node.label}
          </span>
        </motion.div>
      ))}

      {/* Ambient particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute ${p.c}`}
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* Twinkling stars */}
      {STARS.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          className="pointer-events-none absolute block h-2.5 w-2.5 bg-cheese/60"
          style={{ left: star.x, top: star.y }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 45, 90],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
        />
      ))}

      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* ---- Left Column: Hero content ---- */}
        <div>
          {/* Dev challenge badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block border-4 border-ink bg-mint px-3 py-1 font-pixel text-[9px] text-ink shadow-pixel-sm"
          >
            {t('home.devChallenge')}
          </motion.span>

          {/* Main title */}
          <h1 className="mt-5 font-pixel text-3xl leading-relaxed text-cream sm:text-5xl">
            <StaggerText text={t('home.memory')} className="text-tomato" />
            <br />
            <StaggerText text={t('home.kitchen')} className="text-cheese" />
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-5 max-w-md font-sans text-base text-cream/70 sm:text-lg"
          >
            {t('home.tagline')}
          </motion.p>

          {/* Greeting Speech Bubble */}
          <div className="mt-6">
            <SpeechBubble text={greetingText} />
          </div>

          {/* AI Learning Status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="mt-4"
          >
            <div className="flex items-center gap-3">
              {/* Pulsing dot */}
              <motion.span
                className="block h-2.5 w-2.5 bg-mint"
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Status text */}
              <span className="font-terminal text-sm text-cream/50">{statusText}</span>
              {/* Separator */}
              <span className="font-terminal text-sm text-cream/20">·</span>
              {/* Rotating status */}
              <motion.span
                key={statusIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.6, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-[11px] text-grape/60 tracking-wide"
              >
                {AI_STATUS_MESSAGES[statusIndex]}
              </motion.span>
            </div>
          </motion.div>

          {/* AI Identity Panel */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            className="mt-4"
          >
            <AIAssistantBadge />
          </motion.div>

          {/* Memory stats (if user has cooked before) */}
          {hasMemory && memoryCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.5 }}
              className="mt-4 flex gap-4"
            >
              <div className="flex items-center gap-2 border border-cream/10 bg-cream/3 px-3 py-2">
                <span className="font-pixel text-sm text-cheese">{memoryCount}</span>
                <span className="font-mono text-[9px] text-cream/50 uppercase">Dishes created</span>
              </div>
              <div className="flex items-center gap-2 border border-cream/10 bg-cream/3 px-3 py-2">
                <span className="font-mono text-[11px] text-mint">ACTIVE</span>
                <span className="font-mono text-[9px] text-cream/50 uppercase">Taste Learning</span>
              </div>
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <PixelButton variant="tomato" onClick={onStart}>
              {t('home.startCooking')}
            </PixelButton>
            <PixelButton variant="ghost" onClick={onWatchDemo}>
              {t('home.watchDemo')}
            </PixelButton>
          </motion.div>
        </div>

        {/* ---- Right Column: Smart Fridge & AI Chef ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center py-10"
        >
          {/* Fridge glow aura */}
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream/8 blur-3xl" />
            <div className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-mint/5 blur-3xl" />
          </motion.div>

          {/* Smart Fridge with AI status display */}
          <div className="relative">
            <PixelFridge />

            {/* Fridge AI interface overlay */}
            <motion.div
              className="absolute right-2 top-4 flex items-center gap-1 border border-mint/20 bg-mint/5 px-2 py-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="h-1.5 w-1.5 bg-mint" />
              <span className="font-mono text-[7px] text-mint/60 tracking-wider">SMART FRIDGE</span>
            </motion.div>

            {/* "AI ANALYZING" scanline on fridge */}
            <motion.div
              className="absolute inset-x-4 top-12 h-px bg-cream/10"
              animate={{ top: [12, 80, 12], opacity: [0, 0.4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* AI Chef mascot */}
          <motion.div
            className="absolute -bottom-12 -right-8 sm:-bottom-14 sm:-right-10 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { delay: 0.5, type: 'spring', stiffness: 200, damping: 16 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            }}
          >
            <div className="relative">
              {/* Chef glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-cheese/20 blur-xl"
                animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <PixelChef className="relative z-10 h-20 w-20 sm:h-24 sm:w-24" />

              {/* AI badge on chef */}
              <motion.div
                className="absolute -top-1 right-0 z-20 flex items-center gap-0.5 border border-grape/40 bg-grape/20 px-1.5 py-0.5"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="font-mono text-[7px] text-grape tracking-wider">AI</span>
              </motion.div>

              {/* Waving spoon */}
              <motion.div
                className="absolute -right-2 top-2 z-10"
                style={{ transformOrigin: 'bottom center' }}
                animate={{ rotate: [-12, 16, -12] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  viewBox="0 0 10 10"
                  className="h-5 w-5"
                  shapeRendering="crispEdges"
                  aria-hidden="true"
                >
                  <rect x="3" y="2" width="4" height="5" fill="#ffcb3b" />
                  <rect x="2" y="6" width="6" height="3" fill="#ffcb3b" />
                  <rect x="2" y="8" width="1" height="1" fill="#0d0b1f" />
                  <rect x="4" y="8" width="1" height="1" fill="#0d0b1f" />
                  <rect x="6" y="8" width="1" height="1" fill="#0d0b1f" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
