interface PixelChefProps {
  className?: string
}

/** Hand-built pixel-art chef mascot as crisp-edges SVG (scales sharply). */
export default function PixelChef({ className = '' }: PixelChefProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" fill="none" />
      {/* Hat */}
      <rect x="20" y="6" width="24" height="6" fill="#fdf6e3" />
      <rect x="16" y="12" width="6" height="6" fill="#fdf6e3" />
      <rect x="42" y="12" width="6" height="6" fill="#fdf6e3" />
      <rect x="22" y="12" width="20" height="8" fill="#fdf6e3" />
      <rect x="18" y="20" width="28" height="6" fill="#fdf6e3" />
      {/* Face */}
      <rect x="18" y="26" width="28" height="20" fill="#ffcb3b" />
      <rect x="18" y="26" width="28" height="3" fill="#0d0b1f" />
      {/* Eyes */}
      <rect x="24" y="32" width="4" height="4" fill="#0d0b1f" />
      <rect x="36" y="32" width="4" height="4" fill="#0d0b1f" />
      {/* Cheeks */}
      <rect x="22" y="38" width="4" height="3" fill="#ff5277" />
      <rect x="38" y="38" width="4" height="3" fill="#ff5277" />
      {/* Smile */}
      <rect x="26" y="41" width="12" height="2" fill="#0d0b1f" />
      <rect x="24" y="41" width="2" height="2" fill="#0d0b1f" />
      <rect x="38" y="41" width="2" height="2" fill="#0d0b1f" />
      {/* Body / apron */}
      <rect x="16" y="46" width="32" height="14" fill="#4cc9f0" />
      <rect x="28" y="46" width="8" height="14" fill="#fdf6e3" />
      <rect x="28" y="52" width="8" height="3" fill="#ff5277" />
    </svg>
  )
}
