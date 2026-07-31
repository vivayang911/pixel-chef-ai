import { motion } from 'framer-motion'
import type { TastePrediction } from '@/engine/aiChefEngine'

interface FlavorDNAProps {
  prediction: TastePrediction
  className?: string
}

const DIMENSIONS = [
  { key: 'spicy' as const, label: 'Spicy', emoji: '🌶', color: '#ff6b6b' },
  { key: 'rich' as const, label: 'Rich', emoji: '🔥', color: '#ffa94d' },
  { key: 'fresh' as const, label: 'Fresh', emoji: '🌱', color: '#51cf66' },
  { key: 'sweet' as const, label: 'Sweet', emoji: '🍬', color: '#da77f2' },
]

const CENTER = 60
const RADIUS = 45

function toCartesian(angle: number, radius: number): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  }
}

export default function FlavorDNA({ prediction, className = '' }: FlavorDNAProps) {
  const angleStep = 360 / DIMENSIONS.length

  const axes = DIMENSIONS.map((d, i) => {
    const angle = i * angleStep
    const end = toCartesian(angle, RADIUS)
    return { ...d, angle, end }
  })

  // Polygon points for the filled area
  const points = DIMENSIONS.map((d, i) => {
    const value = prediction[d.key] / 100
    const r = RADIUS * value
    const pt = toCartesian(i * angleStep, r)
    return `${pt.x},${pt.y}`
  }).join(' ')

  // Grid rings
  const gridRings = [0.2, 0.4, 0.6, 0.8, 1].map((fraction) =>
    DIMENSIONS.map((_, i) => {
      const pt = toCartesian(i * angleStep, RADIUS * fraction)
      return `${pt.x},${pt.y}`
    }).join(' '),
  )

  return (
    <div className={className}>
      <svg viewBox="0 0 120 120" className="h-full w-full" shapeRendering="geometricPrecision">
        {/* Background rings */}
        {gridRings.map((ring, i) => (
          <polygon
            key={i}
            points={ring}
            fill="none"
            stroke="rgba(248,236,210,0.08)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={axis.end.x}
            y2={axis.end.y}
            stroke="rgba(248,236,210,0.12)"
            strokeWidth="0.5"
          />
        ))}

        {/* Filled radar area */}
        <motion.polygon
          points={points}
          fill="rgba(255,203,59,0.15)"
          stroke="#ffcb3b"
          strokeWidth="1.2"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.3 }}
        />

        {/* Data points on each axis */}
        {DIMENSIONS.map((d, i) => {
          const value = prediction[d.key] / 100
          const r = RADIUS * value
          const pt = toCartesian(i * angleStep, r)

          return (
            <motion.circle
              key={d.key}
              cx={pt.x}
              cy={pt.y}
              r="2.5"
              fill={d.color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 12,
                delay: 0.5 + i * 0.15,
              }}
            />
          )
        })}
      </svg>

      {/* Labels */}
      <div className="mt-2 flex justify-between px-1">
        {DIMENSIONS.map((d) => (
          <div key={d.key} className="text-center">
            <span className="font-terminal text-[9px] text-cream/50">{d.emoji}</span>
            <p className="text-center font-pixel text-[7px] text-cream/70">{d.key}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
