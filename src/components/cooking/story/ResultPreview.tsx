import { useEffect, useMemo, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import type { Ingredient } from '@/types/food'
import type { TasteScore } from '@/engine/cookingEngine'
import { generateDishVisual } from '@/engine/dishImageEngine'
import type { DishVisualConfig } from '@/engine/dishImageEngine'
import { useLanguage } from '@/i18n/LanguageContext'

/* ------------------------------------------------------------------ */
/*  Celebration particles & effects                                    */
/* ------------------------------------------------------------------ */

const CELEBRATION_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  delay: Math.random() * 1.5,
  duration: 2.5 + Math.random() * 3,
  size: 4 + Math.random() * 8,
  color: ['bg-tomato', 'bg-cheese', 'bg-mint', 'bg-grape', 'bg-sky'][Math.floor(Math.random() * 5)],
}))

const SPARKLE_STARS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: `${8 + Math.random() * 84}%`,
  y: `${5 + Math.random() * 90}%`,
  delay: Math.random() * 2,
  size: 6 + Math.random() * 10,
}))

/* ------------------------------------------------------------------ */
/*  Large Pixel Dish Artwork                                           */
/* ------------------------------------------------------------------ */

function HeroDishArtwork({ config }: { config: DishVisualConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.3 }}
      className="relative mx-auto"
    >
      {/* Spotlight glow behind the dish */}
      <motion.div
        className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.mainColor}22 0%, ${config.mainColor}08 40%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary glow ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <svg
        viewBox="0 0 240 200"
        className="h-auto w-full max-w-[340px] sm:max-w-[400px]"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Warm background glow on the dish */}
        <ellipse cx="120" cy="115" rx="90" ry="55" fill={config.mainColor} opacity="0.1" />

        {/* Dish base */}
        {config.dishType === 'bowl' && (
          <>
            <path d="M44 115 Q44 178 98 182 L142 182 Q196 178 196 115" fill="#f0e6d3" stroke="#0d0b1f" strokeWidth="2.5" />
            <path d="M42 115 Q42 180 98 184 L142 184 Q198 180 198 115" fill="none" stroke="#c4b8a0" strokeWidth="1" opacity="0.5" />
            <ellipse cx="120" cy="118" rx="74" ry="14" fill={config.baseColor} stroke="#0d0b1f" strokeWidth="1.5" />
            {/* Bowl rim highlight */}
            <ellipse cx="120" cy="114" rx="76" ry="14" fill="none" stroke="#fff" strokeWidth="1" opacity="0.12" />
          </>
        )}
        {config.dishType === 'plate' && (
          <>
            <ellipse cx="122" cy="130" rx="78" ry="32" fill="#f5f0e8" stroke="#0d0b1f" strokeWidth="2.5" />
            <ellipse cx="122" cy="128" rx="78" ry="32" fill="none" stroke="#e8e0d0" strokeWidth="1" opacity="0.5" />
            <ellipse cx="120" cy="126" rx="50" ry="18" fill={config.baseColor} />
            <ellipse cx="120" cy="124" rx="52" ry="18" fill="none" stroke="#fff" strokeWidth="1" opacity="0.1" />
          </>
        )}
        {config.dishType === 'pan' && (
          <>
            <rect x="24" y="90" width="192" height="48" rx="6" fill="#3a3a3a" stroke="#0d0b1f" strokeWidth="2.5" />
            <rect x="24" y="92" width="192" height="44" fill="none" stroke="#555" strokeWidth="1" opacity="0.4" />
            <rect x="30" y="94" width="180" height="40" rx="3" fill={config.baseColor} opacity="0.85" />
            <rect x="200" y="98" width="28" height="10" rx="3" fill="#5a4a3a" stroke="#0d0b1f" strokeWidth="2" />
          </>
        )}
        {config.dishType === 'soup' && (
          <>
            <path d="M40 108 Q40 178 98 186 L142 186 Q200 178 200 108" fill="#e8cfa0" stroke="#0d0b1f" strokeWidth="2.5" />
            <rect x="38" y="102" width="164" height="10" rx="3" fill="#f0d8a8" stroke="#0d0b1f" strokeWidth="2" />
            <ellipse cx="120" cy="108" rx="78" ry="14" fill={config.baseColor} stroke="#0d0b1f" strokeWidth="1.5" />
          </>
        )}

        {/* Placed ingredients (scaled up for hero view) */}
        {config.placedIngredients.map((ing, i) => (
          <rect
            key={i}
            x={ing.x * 0.7 + 20}
            y={ing.y * 0.7 + 15}
            width={ing.w * 0.55}
            height={ing.h * 0.55}
            rx="2"
            fill={ing.visual.color}
            opacity="0.9"
            stroke="#0d0b1f"
            strokeWidth="1.2"
          />
        ))}

        {/* Steam animation */}
        {config.steam && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.rect
                key={`steam-${i}`}
                x={95 + i * 14}
                y={60}
                width="5"
                height="3"
                rx="1.5"
                fill="#fff"
                opacity="0"
                animate={{
                  y: [60, 20, -5],
                  x: [95 + i * 14, 92 + i * 14 + 3, 88 + i * 14 + 8],
                  opacity: [0, 0.5, 0],
                  width: [5, 7, 10],
                  height: [3, 4, 5],
                }}
                transition={{
                  duration: 2.2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </svg>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Flavor profile radar                                               */
/* ------------------------------------------------------------------ */

const flavorLabels = [
  { key: 'taste', label: 'Flavor', color: '#ff6b6b' },
  { key: 'creativity', label: 'Creative', color: '#a78bfa' },
  { key: 'nutrition', label: 'Nutrition', color: '#34d399' },
] as const

/* ------------------------------------------------------------------ */
/*  Typing text effect                                                 */
/* ------------------------------------------------------------------ */

function TypingReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const [shown, setShown] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [started, text])

  return (
    <span>
      {shown}
      {shown.length < text.length && (
        <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-grape align-middle" />
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Container variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.5 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface ResultPreviewProps {
  dishName: string
  ingredients: Ingredient[]
  score: TasteScore
  aiStory: string
  onContinue?: () => void
}

export default function ResultPreview({
  dishName,
  ingredients,
  score,
  aiStory,
  onContinue,
}: ResultPreviewProps) {
  const { t } = useLanguage()
  const avg = Math.round((score.taste + score.creativity + score.nutrition) / 3)

  const visualConfig = useMemo(
    () => generateDishVisual(ingredients, avg),
    [ingredients, avg],
  )

  // Determine star rating 1-5 based on average
  const stars = Math.max(1, Math.min(5, Math.round(avg / 20)))

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-8"
    >
      {/* Celebration particles */}
      {CELEBRATION_PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className={`pointer-events-none absolute ${p.color}`}
          style={{ left: p.x, bottom: '-10px', width: p.size, height: p.size }}
          animate={{
            y: [0, -300 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 120],
            opacity: [0, 1, 0],
            rotate: [0, 180 + Math.random() * 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Sparkle stars */}
      {SPARKLE_STARS.map((s) => (
        <motion.span
          key={`sparkle-${s.id}`}
          className="pointer-events-none absolute block bg-cheese"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 45, 90],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
            repeatDelay: 2.5,
          }}
        />
      ))}

      {/* Warm kitchen ambiance */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grape/5 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-tomato/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-cheese/5 blur-3xl" />
      </div>

      {/* ---- Hero Dish Area (40%+ of screen) ---- */}
      <motion.div variants={itemVariants} className="w-full max-w-lg">
        {/* AI verification badge */}
        <motion.div
          className="mx-auto mb-4 flex w-fit items-center gap-2 border border-grape/30 bg-grape/10 px-4 py-2 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-0.5">
            {[0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1].map((v, i) => (
              <div key={i} className={`h-2 w-0.5 ${v ? 'bg-grape' : 'bg-grape/20'}`} />
            ))}
          </div>
          <span className="font-mono text-[10px] text-grape/80 tracking-widest uppercase">
            AI Generated
          </span>
        </motion.div>

        {/* The dish artwork */}
        <HeroDishArtwork config={visualConfig} />
      </motion.div>

      {/* ---- Dish Name ---- */}
      <motion.h1
        variants={itemVariants}
        className="mt-6 font-pixel text-2xl sm:text-3xl text-cream text-center"
      >
        {dishName}
      </motion.h1>

      {/* ---- Taste Score with stars ---- */}
      <motion.div variants={itemVariants} className="mt-4 flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <motion.span
              key={s}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8 + s * 0.12, type: 'spring', stiffness: 300 }}
              className="font-pixel text-xl"
              style={{ color: s <= stars ? '#ffcb3b' : '#3d3570' }}
            >
              ★
            </motion.span>
          ))}
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 400 }}
          className="border-2 border-cheese bg-cheese/10 px-3 py-1 font-pixel text-lg text-cheese"
        >
          {avg} pts
        </motion.span>
      </motion.div>

      {/* ---- Flavor Profile ---- */}
      <motion.div variants={itemVariants} className="mt-5 w-full max-w-md">
        <p className="text-center font-mono text-[9px] text-cream/40 uppercase tracking-widest mb-3">
          Flavor Profile
        </p>
        <div className="flex flex-col gap-2">
          {flavorLabels.map((dim) => (
            <div key={dim.key} className="flex items-center gap-3">
              <span
                className="w-16 text-right font-mono text-[10px]"
                style={{ color: dim.color }}
              >
                {dim.label}
              </span>
              <div className="flex-1 h-3 border-2 border-ink bg-ink-panel overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: dim.color, width: `${score[dim.key]}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score[dim.key]}%` }}
                  transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                >
                  {/* Pixel bar texture */}
                  <div
                    className="h-full w-full opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
                    }}
                  />
                </motion.div>
              </div>
              <span className="w-8 font-mono text-xs text-cream/60">{score[dim.key]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ---- AI Chef Story ---- */}
      <motion.div
        variants={itemVariants}
        className="mt-6 w-full max-w-lg border border-grape/20 bg-grape/5 px-5 py-4 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-px">
            {[1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1].map((v, i) => (
              <div key={i} className={`h-2 w-1 ${v ? 'bg-grape' : 'bg-transparent'}`} />
            ))}
          </div>
          <span className="font-mono text-[9px] text-grape/70 uppercase tracking-widest">
            AI Chef Story
          </span>
        </div>
        <p className="font-sans text-sm leading-relaxed text-cream/80 italic">
          <TypingReveal text={aiStory} delay={1.2} />
        </p>
      </motion.div>

      {/* ---- Ingredients Used ---- */}
      <motion.div variants={itemVariants} className="mt-4 flex flex-wrap justify-center gap-1.5">
        {ingredients.map((ing, i) => (
          <motion.span
            key={ing.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 + i * 0.08, type: 'spring', stiffness: 300 }}
            className="inline-block border-2 border-ink bg-ink-panel px-2 py-1 font-pixel text-[9px] text-cream"
          >
            {ing.emoji} {ing.name}
          </motion.span>
        ))}
      </motion.div>

      {/* ---- Memory Saved badge ---- */}
      <motion.div
        variants={itemVariants}
        className="mt-6 mb-4 inline-flex items-center gap-2 border border-mint/30 bg-mint/5 px-4 py-2 rounded-lg"
      >
        <span className="font-mono text-[9px] text-mint/70 uppercase tracking-widest">Memory Saved</span>
        <motion.span
          className="font-pixel text-lg text-mint"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ delay: 2.0, duration: 0.6 }}
        >
          ✓
        </motion.span>
      </motion.div>

      {/* ---- Continue button ---- */}
      {onContinue && (
        <motion.div variants={itemVariants} className="mt-2">
          <button
            onClick={onContinue}
            className="border-4 border-ink bg-tomato px-8 py-3 font-pixel text-sm text-ink shadow-pixel hover:shadow-pixel-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75"
          >
            {t('result.continue') ?? 'View Memory'}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
