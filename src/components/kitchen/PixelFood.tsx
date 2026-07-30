import type { ReactNode } from 'react'

export type FoodKind =
  | 'tomato'
  | 'egg'
  | 'cheese'
  | 'mushroom'
  | 'fish'
  | 'chili'
  | 'carrot'
  | 'broccoli'

const ART: Record<FoodKind, ReactNode> = {
  tomato: (
    <>
      <rect x="3" y="5" width="10" height="8" fill="#ff5277" />
      <rect x="5" y="6" width="2" height="2" fill="#ff90a8" />
      <rect x="7" y="2" width="2" height="3" fill="#5be7a9" />
      <rect x="6" y="3" width="1" height="1" fill="#5be7a9" />
      <rect x="9" y="3" width="1" height="1" fill="#5be7a9" />
    </>
  ),
  egg: (
    <>
      <rect x="2" y="5" width="12" height="8" fill="#fdf6e3" />
      <rect x="2" y="4" width="2" height="1" fill="#fdf6e3" />
      <rect x="12" y="4" width="2" height="1" fill="#fdf6e3" />
      <rect x="6" y="7" width="4" height="4" fill="#ffcb3b" />
    </>
  ),
  cheese: (
    <>
      <rect x="2" y="5" width="12" height="8" fill="#ffcb3b" />
      <rect x="5" y="8" width="2" height="2" fill="#0d0b1f" />
      <rect x="9" y="7" width="2" height="2" fill="#0d0b1f" />
      <rect x="7" y="10" width="2" height="2" fill="#0d0b1f" />
    </>
  ),
  mushroom: (
    <>
      <rect x="5" y="3" width="6" height="1" fill="#ff5277" />
      <rect x="3" y="4" width="10" height="4" fill="#ff5277" />
      <rect x="5" y="5" width="1" height="1" fill="#ffd0db" />
      <rect x="10" y="5" width="1" height="1" fill="#ffd0db" />
      <rect x="6" y="8" width="4" height="5" fill="#fdf6e3" />
    </>
  ),
  fish: (
    <>
      <rect x="3" y="6" width="8" height="5" fill="#4cc9f0" />
      <rect x="11" y="6" width="2" height="2" fill="#4cc9f0" />
      <rect x="12" y="8" width="1" height="2" fill="#4cc9f0" />
      <rect x="5" y="7" width="1" height="1" fill="#0d0b1f" />
      <rect x="6" y="9" width="2" height="1" fill="#2a9bc0" />
    </>
  ),
  chili: (
    <>
      <rect x="7" y="2" width="2" height="1" fill="#5be7a9" />
      <rect x="6" y="4" width="2" height="6" fill="#ff5277" />
      <rect x="8" y="5" width="1" height="6" fill="#ff5277" />
      <rect x="7" y="10" width="2" height="3" fill="#ff5277" />
    </>
  ),
  carrot: (
    <>
      <rect x="7" y="2" width="1" height="3" fill="#5be7a9" />
      <rect x="6" y="3" width="1" height="2" fill="#5be7a9" />
      <rect x="8" y="3" width="1" height="2" fill="#5be7a9" />
      <rect x="6" y="6" width="4" height="8" fill="#ff8a3d" />
      <rect x="6" y="8" width="1" height="1" fill="#e06a1f" />
      <rect x="9" y="10" width="1" height="1" fill="#e06a1f" />
    </>
  ),
  broccoli: (
    <>
      <rect x="4" y="4" width="8" height="4" fill="#5be7a9" />
      <rect x="5" y="3" width="1" height="1" fill="#5be7a9" />
      <rect x="10" y="3" width="1" height="1" fill="#5be7a9" />
      <rect x="7" y="8" width="2" height="5" fill="#8fe7c0" />
    </>
  ),
}

interface PixelFoodProps {
  kind: FoodKind
  className?: string
}

/** Tiny hand-built pixel-art food icon (crisp rects, scales sharply). */
export default function PixelFood({ kind, className = '' }: PixelFoodProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {ART[kind]}
    </svg>
  )
}
