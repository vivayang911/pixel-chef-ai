import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelPanel from '@/components/ui/PixelPanel'
import PixelButton from '@/components/ui/PixelButton'
import PixelChefAnimation from './PixelChefAnimation'
import type { CookingResult } from '@/engine/cookingEngine'

interface ResultPreviewProps {
  result: CookingResult
  onBack: () => void
  onRetry: () => void
  onMemory: () => void
}

function AnimatedNumber({ value }: { value: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / 30)
    const id = setInterval(() => {
      start = Math.min(start + step, value)
      setN(start)
      if (start >= value) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [value])
  return <span className="font-pixel text-2xl text-cream">{n}</span>
}

const SCORE_BARS: { key: keyof CookingResult['score']; label: string; color: string; emoji: string }[] = [
  { key: 'taste', label: 'TASTE', color: 'bg-tomato', emoji: '👅' },
  { key: 'creativity', label: 'CREATIVITY', color: 'bg-grape', emoji: '🎨' },
  { key: 'nutrition', label: 'NUTRITION', color: 'bg-mint', emoji: '💪' },
]

/** Final result screen: animated scores, dish celebration, memory update message. */
export default function ResultPreview({ result, onBack, onRetry, onMemory }: ResultPreviewProps) {
  const avg = Math.round(
    (result.score.taste + result.score.creativity + result.score.nutrition) / 3,
  )

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <Container className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="w-full max-w-xl"
        >
          <PixelPanel
            glow={result.success ? 'tomato' : 'cheese'}
            className="relative px-6 py-8 text-center"
          >
            {/* Steam */}
            <div className="pointer-events-none absolute -top-5 left-1/2 flex -translate-x-1/2 gap-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-1.5 w-1.5 bg-cream/50"
                  animate={{ y: [4, -22], opacity: [0, 0.9, 0], scale: [1, 1.5] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                />
              ))}
            </div>

            <span
              className={`inline-block border-4 border-ink px-3 py-1 font-pixel text-[8px] shadow-pixel-sm ${
                result.success ? 'bg-tomato text-ink' : 'bg-cheese text-ink'
              }`}
            >
              {result.success ? '★ COOKING COMPLETE' : '★ FLAVOR DISCOVERY'}
            </span>

            <h1 className="mt-5 font-pixel text-lg leading-relaxed text-cream sm:text-2xl">
              {result.dishName}
            </h1>

            <div className="mt-4 flex justify-center">
              <PixelChefAnimation state={result.success ? 'success' : 'fail'} />
            </div>

            {/* Animated score bars */}
            <div className="mt-6 space-y-3">
              {SCORE_BARS.map((bar, i) => (
                <div key={bar.key} className="flex items-center gap-3">
                  <span className="w-14 text-left font-pixel text-[7px] text-cream/70">
                    {bar.label}
                  </span>
                  <span className="w-6 font-terminal text-base text-cream/50">{bar.emoji}</span>
                  <div className="flex-1 h-4 overflow-hidden border-2 border-ink bg-ink">
                    <motion.div
                      className={`h-full ${bar.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score[bar.key]}%` }}
                      transition={{ delay: 0.3 + i * 0.2, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="w-10 text-right font-pixel text-sm text-cream">
                    <AnimatedNumber value={result.score[bar.key]} />
                  </span>
                </div>
              ))}
            </div>

            {/* Overall score */}
            <div className="mt-5">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', stiffness: 260, damping: 16 }}
                className="inline-block border-4 border-ink bg-cheese px-4 py-1 font-pixel text-base text-ink shadow-pixel"
              >
                {avg} pts
              </motion.span>
            </div>

            {/* AI message */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mx-auto mt-5 max-w-sm border-t-4 border-ink-line pt-4 font-sans text-sm leading-relaxed text-cream/80"
            >
              {result.message}
            </motion.p>

            {/* Memory update note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-3 font-terminal text-base text-grape"
            >
              PIXEL 已将这次烹饪记录加入你的口味记忆 📝
            </motion.p>
          </PixelPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <PixelButton variant="ghost" onClick={onBack}>
            ◀ 回厨房
          </PixelButton>
          <PixelButton variant="tomato" onClick={onRetry}>
            🔄 再试一次
          </PixelButton>
          <PixelButton variant="grape" onClick={onMemory}>
            📝 Save To My Taste Memory
          </PixelButton>
        </motion.div>
      </Container>
    </section>
  )
}
