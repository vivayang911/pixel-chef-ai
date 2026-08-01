import { motion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  AI Assistant Badge — identity panel for homepage                  */
/* ------------------------------------------------------------------ */

interface AIAssistantBadgeProps {
  className?: string
}

export default function AIAssistantBadge({ className = '' }: AIAssistantBadgeProps) {
  return (
    <motion.div
      className={`inline-flex items-center gap-3 px-4 py-2.5 border border-grape/20 bg-grape/5 rounded-lg ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ borderColor: 'rgba(168,85,247,0.4)', scale: 1.02 }}
    >
      {/* Avatar */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-px">
          {[
            [0, 1, 1, 0],
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [1, 1, 1, 1],
          ].flatMap((row, ri) =>
            row.map((val, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={`rounded-sm ${val ? 'bg-grape' : 'bg-transparent'}`}
              />
            )),
          )}
        </div>
        {/* Floating ring */}
        <motion.div
          className="absolute -inset-1 rounded-full border border-grape/20"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="text-cream/90 text-xs font-mono tracking-wider">Pixel AI</p>
        <div className="flex gap-3 mt-0.5">
          <div>
            <p className="text-cream/30 text-[9px] uppercase tracking-wider">Memory</p>
            <p className="text-cream/60 text-[10px]">Learning your taste</p>
          </div>
          <div>
            <p className="text-cream/30 text-[9px] uppercase tracking-wider">Cooking Style</p>
            <p className="text-cream/60 text-[10px]">Comfort Food</p>
          </div>
          <div>
            <p className="text-cream/30 text-[9px] uppercase tracking-wider">Health Goal</p>
            <p className="text-cream/60 text-[10px]">Balanced</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
