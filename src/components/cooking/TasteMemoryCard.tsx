import { motion } from 'framer-motion'
import PixelPanel from '@/components/ui/PixelPanel'
import type { TasteProfile } from '@/engine/memoryEngine'

interface TasteMemoryCardProps {
  profile: TasteProfile
}

/** A small card showing what PIXEL currently understands about the chef's taste. */
export default function TasteMemoryCard({ profile }: TasteMemoryCardProps) {
  return (
    <PixelPanel glow="cheese" className="p-4">
      <h3 className="font-pixel text-[8px] text-grape">YOUR TASTE PROFILE</h3>

      <motion.p
        key={profile.title}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mt-3 font-pixel text-[11px] leading-relaxed text-cream"
      >
        {profile.title}
      </motion.p>

      <div className="mt-4">
        <span className="font-terminal text-base text-cream/50">Likes：</span>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {profile.likes.map((like) => (
            <motion.span
              key={like}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              className="border-2 border-ink bg-tomato px-2 py-0.5 font-terminal text-sm text-ink shadow-pixel-sm"
            >
              {like}
            </motion.span>
          ))}
        </div>
      </div>

      <p className="mt-4 border-t-2 border-ink-line pt-3 font-terminal text-base text-cream/50">
        Health Goal：<span className="text-mint">{profile.healthGoal}</span>
      </p>
    </PixelPanel>
  )
}
