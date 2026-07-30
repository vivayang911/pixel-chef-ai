import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'tomato' | 'cheese' | 'mint' | 'ghost'

interface PixelButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  className?: string
  type?: 'button' | 'submit'
}

const variantClasses: Record<Variant, string> = {
  tomato: 'bg-tomato text-ink shadow-pixel hover:bg-[#ff6b88]',
  cheese: 'bg-cheese text-ink shadow-pixel hover:bg-[#ffd95e]',
  mint: 'bg-mint text-ink shadow-pixel hover:bg-[#79ecbb]',
  ghost: 'bg-transparent text-cream shadow-pixel-sm hover:bg-ink-line',
}

/** Tactile, hard-shadowed pixel button with a subtle press animation. */
export default function PixelButton({
  children,
  onClick,
  variant = 'tomato',
  className = '',
  type = 'button',
}: PixelButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ x: 3, y: 3 }}
      className={`pixel-btn px-5 py-3 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
