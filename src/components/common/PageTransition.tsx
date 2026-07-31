import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  /** Unique key per route — triggers AnimatePresence. */
  routeKey: string
}

/**
 * Fade + slight scale-up page transition for a seamless
 * pixel-to-pixel navigation feel across the entire demo.
 */
export default function PageTransition({ children, routeKey }: PageTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -6 }}
      transition={{
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
