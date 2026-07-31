import { motion } from 'framer-motion'

interface PixelLoaderProps {
  /** Optional message below the loader. */
  message?: string
}

/**
 * 8-bit loading spinner: a tiny pixel pot bubbling with steam dots.
 * Used during AI generation / cooking calculation moments.
 */
export default function PixelLoader({ message = 'PIXEL is cooking…' }: PixelLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Pixel pot */}
        <div className="relative">
          {/* Steam */}
          <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-2 w-2 bg-cream/50"
                animate={{
                  y: [0, -18, -36],
                  opacity: [0, 0.7, 0],
                  scale: [1, 1.8, 2.2],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Pot body */}
          <svg
            viewBox="0 0 48 32"
            className="h-16 w-24"
            shapeRendering="crispEdges"
            aria-hidden
          >
            <rect x="8" y="0" width="32" height="4" fill="#5a4fa0" />
            <rect x="4" y="4" width="40" height="20" fill="#2c2550" />
            <rect x="4" y="4" width="6" height="20" fill="#3d3570" />
            <rect x="4" y="20" width="40" height="8" fill="#15122b" />
            {/* Bubbling contents */}
            <motion.rect
              x="16" y="12" width="3" height="3" fill="#ffcb3b"
              animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.rect
              x="30" y="14" width="2" height="2" fill="#ffcb3b"
              animate={{ y: [0, -2, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
            />
          </svg>

          {/* Fire */}
          <div className="mt-1 flex justify-center gap-1">
            {['bg-tomato', 'bg-cheese', 'bg-tomato'].map((c, i) => (
              <motion.span
                key={i}
                className={`block h-3 w-2 ${c}`}
                animate={{ scaleY: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-cream/80">{message}</span>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5 bg-cheese"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
