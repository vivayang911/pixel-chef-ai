import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PixelChef from '@/components/ui/PixelChef'
import PixelPanel from '@/components/ui/PixelPanel'
import type { MemoryFeedback } from '@/engine/memoryEngine'

interface AIAdvisorProps {
  feedback: MemoryFeedback
}

/** Restarts a typewriter reveal whenever the text changes. */
function useTypewriter(text: string, speed = 26) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setShown('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { shown, done }
}

/** PIXEL's memory advisor: reacts to every pick with remembered taste + health advice. */
export default function AIAdvisor({ feedback }: AIAdvisorProps) {
  const { shown, done } = useTypewriter(feedback.message)

  return (
    <PixelPanel glow="tomato" className="p-4">
      <div className="flex items-start gap-3">
        <motion.div
          key={feedback.message}
          initial={{ scale: 0.8, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          className="shrink-0"
        >
          <PixelChef className="h-14 w-14 animate-float-y" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-blink bg-mint" />
            <span className="font-pixel text-[8px] text-mint">PIXEL AI · 记忆分析中</span>
          </div>

          <p className="min-h-12 font-sans text-sm leading-relaxed text-cream">
            {shown}
            {!done && (
              <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-tomato align-middle" />
            )}
          </p>

          <AnimatePresence mode="wait">
            {done && (
              <motion.p
                key={feedback.nutritionAdvice}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-2 border-t-2 border-ink-line pt-2 font-terminal text-base text-cheese"
              >
                {feedback.nutritionAdvice}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PixelPanel>
  )
}
