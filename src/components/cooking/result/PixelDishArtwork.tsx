import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { DishVisualConfig, IngVisualShape, PlacedIngredient, GarnishElement } from '@/engine/dishImageEngine'

/* ------------------------------------------------------------------ */
/*  Pixel helpers                                                      */
/* ------------------------------------------------------------------ */

/** Build a blocky pixel shape from a list of rect-data. */
function PixelCluster({
  rects,
  fill,
  secondary,
  stroke,
  animate,
}: {
  rects: { x: number; y: number; w: number; h: number }[]
  fill: string
  secondary?: string
  stroke?: string
  animate?: boolean
}) {
  return (
    <g>
      {rects.map((r, i) => (
        <motion.rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill={i % 3 === 1 && secondary ? secondary : fill}
          stroke={stroke}
          strokeWidth={stroke ? 1 : 0}
          {...(animate
            ? {
                initial: { scale: 0, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { delay: 0.3 + i * 0.12, type: 'spring', stiffness: 400 },
              }
            : {})}
        />
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Ingredient shapes                                                  */
/* ------------------------------------------------------------------ */

const ING_SHAPE_RECTS: Record<IngVisualShape, { x: number; y: number; w: number; h: number }[]> = {
  chunk: [
    { x: 0, y: 2, w: 12, h: 6 },
    { x: 4, y: 0, w: 8, h: 4 },
    { x: 2, y: 4, w: 10, h: 6 },
    { x: -2, y: 6, w: 8, h: 4 },
  ],
  slice: [
    { x: 0, y: 0, w: 16, h: 4 },
    { x: 2, y: 3, w: 12, h: 4 },
    { x: -1, y: 1, w: 6, h: 3 },
  ],
  dot: [
    { x: 0, y: 0, w: 4, h: 4 },
    { x: 3, y: 1, w: 3, h: 3 },
    { x: -2, y: -1, w: 3, h: 3 },
  ],
  leaf: [
    { x: 0, y: 0, w: 4, h: 6 },
    { x: 3, y: 1, w: 4, h: 5 },
    { x: -2, y: 2, w: 3, h: 4 },
  ],
  floret: [
    { x: 4, y: 0, w: 4, h: 4 },
    { x: 0, y: 0, w: 4, h: 4 },
    { x: 8, y: 0, w: 4, h: 4 },
    { x: 2, y: -4, w: 4, h: 4 },
    { x: 6, y: -4, w: 4, h: 4 },
    { x: 4, y: 4, w: 4, h: 6 },
  ],
  cap: [
    { x: 0, y: 0, w: 14, h: 4 },
    { x: 2, y: 3, w: 10, h: 6 },
    { x: 4, y: 8, w: 6, h: 4 },
  ],
  coin: [
    { x: 0, y: 0, w: 16, h: 6 },
    { x: 2, y: 1, w: 12, h: 4 },
  ],
  strip: [
    { x: 0, y: 0, w: 4, h: 14 },
    { x: 2, y: -2, w: 3, h: 8 },
  ],
}

function IngredientShape({
  visual,
  x,
  y,
  w,
  h,
  rotate,
  index,
}: PlacedIngredient & { index: number }) {
  const rects = ING_SHAPE_RECTS[visual.shape] ?? ING_SHAPE_RECTS.chunk
  const scaleX = w / 20
  const scaleY = h / 20

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate ?? 0})`}>
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.15, type: 'spring', stiffness: 300 }}
        style={{ transformOrigin: 'center' }}
      >
        <g transform={`scale(${scaleX}, ${scaleY})`}>
          {rects.map((r, i) => (
            <rect
              key={i}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              fill={i % 3 === 1 && visual.secondary ? visual.secondary : visual.color}
              stroke="#0d0b1f"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          ))}
        </g>
      </motion.g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Container: Bowl                                                    */
/* ------------------------------------------------------------------ */

function PixelBowl({ config }: { config: DishVisualConfig }) {
  return (
    <motion.g
      initial={{ scaleY: 0, originY: 1 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      style={{ transformOrigin: 'center 120px' }}
    >
      {/* Bowl body */}
      <path
        d="M40 80 Q40 130 78 130 L122 130 Q160 130 160 80"
        fill="#f0e6d3"
        stroke="#0d0b1f"
        strokeWidth="2"
      />
      {/* Bowl rim highlight */}
      <path
        d="M42 80 Q80 92 158 80"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeOpacity="0.6"
      />
      {/* Bowl inner */}
      <ellipse cx="100" cy="82" rx="58" ry="12" fill="#e8dcc8" stroke="#0d0b1f" strokeWidth="1.5" />
      {/* Rice/base fill */}
      <ellipse cx="100" cy="80" rx="52" ry="10" fill={config.baseColor} stroke="none" />
    </motion.g>
  )
}

/* ------------------------------------------------------------------ */
/*  Container: Plate                                                   */
/* ------------------------------------------------------------------ */

function PixelPlate({ config }: { config: DishVisualConfig }) {
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      style={{ transformOrigin: '100px 90px' }}
    >
      {/* Plate shadow */}
      <ellipse cx="102" cy="96" rx="62" ry="28" fill="rgba(0,0,0,0.3)" />
      {/* Plate body */}
      <ellipse cx="100" cy="90" rx="64" ry="28" fill="#f5f0e8" stroke="#0d0b1f" strokeWidth="2" />
      {/* Plate inner rim */}
      <ellipse cx="100" cy="88" rx="48" ry="20" fill="#faf6ef" stroke="#ccc" strokeWidth="1" />
      {/* Plate center */}
      <ellipse cx="100" cy="86" rx="34" ry="14" fill={config.baseColor} />
    </motion.g>
  )
}

/* ------------------------------------------------------------------ */
/*  Container: Pan                                                     */
/* ------------------------------------------------------------------ */

function PixelPan({ config }: { config: DishVisualConfig }) {
  return (
    <motion.g
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
    >
      {/* Pan body */}
      <rect x="30" y="70" width="140" height="36" rx="6" fill="#3a3a3a" stroke="#0d0b1f" strokeWidth="2" />
      {/* Pan interior */}
      <rect x="34" y="72" width="132" height="32" rx="4" fill="#2a2a2a" />
      {/* Pan surface */}
      <rect x="36" y="74" width="128" height="28" rx="3" fill={config.baseColor} opacity="0.85" />
      {/* Pan handle */}
      <rect x="150" y="78" width="30" height="8" rx="3" fill="#5a4a3a" stroke="#0d0b1f" strokeWidth="1.5" />
      {/* Pan side highlight */}
      <rect x="32" y="72" width="136" height="2" fill="#555" opacity="0.5" />
    </motion.g>
  )
}

/* ------------------------------------------------------------------ */
/*  Container: Soup                                                    */
/* ------------------------------------------------------------------ */

function PixelSoup({ config }: { config: DishVisualConfig }) {
  return (
    <motion.g
      initial={{ scaleY: 0, originY: 1 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      style={{ transformOrigin: 'center 130px' }}
    >
      {/* Pot body */}
      <path
        d="M42 85 Q42 135 78 138 L122 138 Q158 135 158 85"
        fill="#e8cfa0"
        stroke="#0d0b1f"
        strokeWidth="2"
      />
      {/* Pot rim */}
      <rect x="40" y="78" width="120" height="10" rx="3" fill="#f0d8a8" stroke="#0d0b1f" strokeWidth="1.5" />
      {/* Liquid surface */}
      <ellipse cx="100" cy="82" rx="56" ry="10" fill={config.baseColor} stroke="#0d0b1f" strokeWidth="1" />
      {/* Liquid gradient line */}
      <line x1="48" y1="79" x2="152" y2="79" stroke="#fff" strokeWidth="1" strokeOpacity="0.3" />
    </motion.g>
  )
}

/* ------------------------------------------------------------------ */
/*  Effects: Steam                                                     */
/* ------------------------------------------------------------------ */

function SteamEffect({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <g>
      {[60, 90, 120, 140].map((x, i) => (
        <g key={i}>
          <motion.rect
            x={x}
            y={60}
            width="6"
            height="4"
            rx="2"
            fill="#fff"
            opacity="0"
            animate={{
              y: [60, 30, 10],
              opacity: [0, 0.35, 0],
              x: [x, x + (i % 2 === 0 ? 8 : -8), x + (i % 2 === 0 ? 16 : -16)],
              scaleX: [1, 1.5, 2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut',
            }}
          />
          <motion.rect
            x={x + 3}
            y={50}
            width="4"
            height="3"
            rx="2"
            fill="#fff"
            opacity="0"
            animate={{
              y: [50, 20, -5],
              opacity: [0, 0.25, 0],
              x: [x + 3, x + 3 + (i % 2 === 0 ? -4 : 4), x + 3 + (i % 2 === 0 ? -8 : 8)],
              scaleX: [1, 1.3, 1.8],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: i * 0.8 + 0.5,
              ease: 'easeOut',
            }}
          />
        </g>
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Effects: Sparkle                                                   */
/* ------------------------------------------------------------------ */

function SparkleEffect({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <g>
      {[
        { x: 60, y: 50, d: 1.5 },
        { x: 130, y: 55, d: 1.2 },
        { x: 90, y: 40, d: 2 },
        { x: 110, y: 60, d: 1 },
        { x: 70, y: 65, d: 1.5 },
        { x: 140, y: 45, d: 1.8 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.d}
          fill="#ffd700"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.5 + i * 0.35,
            ease: 'easeInOut',
          }}
        />
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Garnish renderer                                                   */
/* ------------------------------------------------------------------ */

function GarnishLayer({ garnish }: { garnish: GarnishElement[] }) {
  return (
    <g>
      {garnish.map((g, i) => {
        if (g.type === 'herb') {
          return (
            <motion.g
              key={i}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
            >
              {/* Leaf pair */}
              <rect x={g.x - 2} y={g.y - 4} width="2" height="6" fill={g.color} />
              <rect x={g.x + 1} y={g.y - 3} width="2" height="5" fill={g.color} />
              <rect x={g.x - 1} y={g.y - 6} width="1" height="3" fill="#5aaa58" />
            </motion.g>
          )
        }
        if (g.type === 'sesame') {
          return (
            <motion.rect
              key={i}
              x={g.x}
              y={g.y}
              width="2"
              height="2"
              rx="1"
              fill={g.color}
              stroke="#ccc"
              strokeWidth="0.4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4 + i * 0.08, type: 'spring' }}
            />
          )
        }
        if (g.type === 'chili-flake') {
          return (
            <motion.rect
              key={i}
              x={g.x}
              y={g.y}
              width="2"
              height="4"
              rx="0.5"
              fill={g.color}
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: (i % 2 === 0 ? 15 : -15) }}
              transition={{ delay: 1.4 + i * 0.1, type: 'spring' }}
              style={{ transformOrigin: 'center' }}
            />
          )
        }
        // sauce-drip
        return (
          <motion.path
            key={i}
            d={`M${g.x} ${g.y} Q${g.x + 3} ${g.y + 6} ${g.x + 1} ${g.y + 10}`}
            stroke={g.color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          />
        )
      })}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Quality badge                                                      */
/* ------------------------------------------------------------------ */

function QualityBadge({ quality }: { quality: DishVisualConfig['quality'] }) {
  const labels: Record<string, string> = {
    normal: '★ NORMAL ★',
    excellent: '★★ EXCELLENT ★★',
    masterpiece: '★★★ MASTERPIECE ★★★',
  }
  const colors: Record<string, string> = {
    normal: '#94a3b8',
    excellent: '#f59e0b',
    masterpiece: '#ffd700',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4 }}
      className="mx-auto mt-3 w-fit rounded-full border border-cream/30 bg-surface/80 px-4 py-1 backdrop-blur"
    >
      <span
        className="font-mono text-xs tracking-widest"
        style={{ color: colors[quality] }}
      >
        {labels[quality]}
      </span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface PixelDishArtworkProps {
  config: DishVisualConfig
}

export default function PixelDishArtwork({ config }: PixelDishArtworkProps) {
  const [showSteam, setShowSteam] = useState(false)
  const [showSparkle, setShowSparkle] = useState(false)

  useEffect(() => {
    if (config.steam) {
      const t = setTimeout(() => setShowSteam(true), 1800)
      return () => clearTimeout(t)
    }
  }, [config.steam])

  useEffect(() => {
    if (config.sparkle) {
      const t = setTimeout(() => setShowSparkle(true), 2400)
      return () => clearTimeout(t)
    }
  }, [config.sparkle])

  const containerMap: Record<string, React.ComponentType<{ config: DishVisualConfig }>> = {
    bowl: PixelBowl,
    plate: PixelPlate,
    pan: PixelPan,
    soup: PixelSoup,
  }

  const ContainerComp = containerMap[config.dishType] ?? PixelPlate

  return (
    <div className="flex flex-col items-center">
      {/* Artwork container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-[240px] h-[200px] rounded-xl border-2 border-cream/20 bg-[#1a1725] shadow-inner overflow-hidden"
      >
        {/* Warm light glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{ backgroundColor: config.mainColor, opacity: 0.12 }}
          animate={{ opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg
          viewBox="0 0 200 160"
          width="220"
          height="176"
          shapeRendering="crispEdges"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Container (bowl / plate / pan / soup) */}
          <ContainerComp config={config} />

          {/* Placed ingredients */}
          {config.placedIngredients.map((ing, i) => (
            <IngredientShape key={i} {...ing} index={i} />
          ))}

          {/* Garnish */}
          <GarnishLayer garnish={config.garnish} />

          {/* Steam (animated overlay) */}
          <SteamEffect active={showSteam} />

          {/* Sparkle (animated overlay) */}
          <SparkleEffect active={showSparkle} />
        </svg>

        {/* Container label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-surface/60 px-3 py-0.5 backdrop-blur"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] text-cream/60 uppercase">
            {config.containerLabel}
          </span>
        </motion.div>
      </motion.div>

      {/* Quality badge */}
      <QualityBadge quality={config.quality} />
    </div>
  )
}
