import type { ReactNode } from 'react'

interface PixelPanelProps {
  children: ReactNode
  className?: string
  /** Adds a glowing accent ring instead of the default shadow. */
  glow?: 'tomato' | 'cheese' | 'none'
}

/** A chunky 8-bit card with a hard offset shadow and thick border. */
export default function PixelPanel({
  children,
  className = '',
  glow = 'none',
}: PixelPanelProps) {
  const glowClass =
    glow === 'tomato'
      ? 'shadow-glow-tomato'
      : glow === 'cheese'
        ? 'shadow-glow-cheese'
        : 'shadow-pixel'

  return (
    <div className={`pixel-panel ${glowClass} ${className}`}>{children}</div>
  )
}
