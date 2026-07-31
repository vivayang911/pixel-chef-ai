import { motion } from 'framer-motion'

interface CookingTimerProps {
  remaining: number
  total: number
  paused: boolean
}

/** Big pixel countdown timer with a shrinking ring. */
export default function CookingTimer({ remaining, total, paused }: CookingTimerProps) {
  const pct = Math.max(0, (remaining / total) * 100)
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {/* Ring background */}
        <svg viewBox="0 0 64 64" className="h-16 w-16" shapeRendering="crispEdges">
          <circle cx="32" cy="32" r="26" fill="none" stroke="#2c2550" strokeWidth="6" />
          {/* Progress arc: simple rect-based pixel ring */}
          <motion.circle
            cx="32" cy="32" r="26" fill="none" stroke="#5be7a9" strokeWidth="6"
            strokeLinecap="butt"
            strokeDasharray={`${(pct / 100) * 163} 163`}
            style={{ rotate: -90, transformOrigin: 'center' }}
            shapeRendering="crispEdges"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-terminal text-lg text-cream/90">
          {remaining <= 5 ? (
            <motion.span
              key="urgent"
              animate={paused ? { scale: 1 } : { scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-tomato"
            >
              {display}
            </motion.span>
          ) : (
            display
          )}
        </span>
      </div>

      <div>
        <h4 className="font-pixel text-[8px] text-cream/70">COOK TIME</h4>
        <div className="mt-1 flex items-center gap-1">
          <span className={`font-pixel text-[10px] ${paused ? 'text-cheese' : remaining <= 5 ? 'text-tomato' : 'text-mint'}`}>
            {display}
          </span>
          {paused && <span className="font-terminal text-xs text-cheese">⏸</span>}
        </div>
        {/* Pixel progress bar */}
        <div className="mt-1 h-2 w-24 overflow-hidden border-2 border-ink bg-ink">
          <motion.div
            className="h-full"
            style={{ width: `${pct}%`, backgroundColor: remaining <= 5 ? '#ff5277' : '#5be7a9' }}
          />
        </div>
      </div>
    </div>
  )
}
