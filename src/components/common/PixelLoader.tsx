import { motion } from 'framer-motion'

interface PixelLoaderProps {
  message?: string
}

/** Full-page pixel loading spinner with cooking pot and flame. */
export default function PixelLoader({ message = 'Loading...' }: PixelLoaderProps) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-8">
      {/* Pixel Pot */}
      <motion.div
        className="relative"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 40 40" className="h-20 w-20" shapeRendering="crispEdges" aria-hidden>
          <rect x="6" y="10" width="28" height="4" fill="#5a4fa0" />
          <rect x="4" y="16" width="32" height="18" fill="#2c2550" />
          <rect x="4" y="14" width="4" height="20" fill="#3d3570" />
          <rect x="32" y="14" width="4" height="20" fill="#3d3570" />
        </svg>

        {/* Bubble */}
        <motion.span
          className="absolute -top-3 left-1/2 block h-3 w-3 -translate-x-1/2 bg-cream/30"
          animate={{ y: [-10, -30], opacity: [0, 0.6, 0], scale: [1, 1.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Flame */}
        <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-3 bg-tomato"
              animate={{
                height: [4, 12 + i * 4, 4],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 0.6 + i * 0.15,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{ bottom: 0 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-terminal text-base text-cream/60"
      >
        {message}
      </motion.p>
    </div>
  )
}
