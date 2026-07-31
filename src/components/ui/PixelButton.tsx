import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'tomato' | 'cheese' | 'mint' | 'ghost'

interface PixelButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
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
  disabled = false,
}: PixelButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { x: 3, y: 3 }}
      className={`pixel-btn px-5 py-3 ${variantClasses[variant]} ${
        disabled ? 'cursor-not-allowed opacity-40' : ''
      } ${className}`}
    >
      {children}
    </motion.button>
  )
}
