import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelPanel from '@/components/ui/PixelPanel'
import PixelChef from '@/components/ui/PixelChef'
import type { Ingredient } from '@/types/food'

interface CookingStoryProps {
  dish: Ingredient[]
  onBack: () => void
}

function nameDish(dish: Ingredient[]): string {
  const ids = dish.map((d) => d.id)
  const spicy = ids.includes('chili')
  const base = ids.includes('pork-belly')
    ? '焦香五花肉'
    : ids.includes('chicken')
      ? '嫩煎鸡胸肉'
      : ids.includes('fish')
        ? '清蒸鲜鱼'
        : '田园时蔬'
  return `${spicy ? '香辣' : ''}${base}`
}

/** Placeholder for Phase 3: PIXEL begins telling the story of the dish. */
export default function CookingStory({ dish, onBack }: CookingStoryProps) {
  const name = nameDish(dish)
  const totalCal = dish.reduce((s, i) => s + i.calories, 0)

  const lines = [
    'PIXEL 接过了你的食材，火苗升起来了……',
    `锅里的香气正在凝聚成「${name}」`,
    '这道料理的完整故事，将在 Phase 3 为你讲述 📖',
  ]

  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <Container className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="w-full max-w-2xl"
        >
          <PixelPanel glow="tomato" className="relative p-8 text-center">
            {/* Steam */}
            <div className="pointer-events-none absolute -top-6 left-1/2 flex -translate-x-1/2 gap-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-2 w-2 bg-cream/50"
                  animate={{ y: [6, -24], opacity: [0, 0.9, 0], scale: [1, 1.6] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                />
              ))}
            </div>

            <span className="inline-block border-4 border-ink bg-mint px-3 py-1 font-pixel text-[8px] text-ink shadow-pixel-sm">
              ★ COOKING STORY
            </span>

            <h1 className="mt-5 font-pixel text-xl leading-relaxed text-cream sm:text-3xl">
              <span className="text-tomato">{name}</span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-3xl">
              {dish.map((ing, i) => (
                <motion.span
                  key={ing.id}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 300, damping: 14 }}
                >
                  {ing.emoji}
                </motion.span>
              ))}
            </div>

            <p className="mt-3 font-terminal text-lg text-cheese">约 {totalCal} kcal</p>

            <div className="mx-auto mt-6 max-w-md space-y-3 border-t-4 border-ink-line pt-6 text-left">
              {lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.6 }}
                  className="font-sans text-sm leading-relaxed text-cream/80"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute -bottom-8 -left-4 sm:-left-10"
            >
              <PixelChef className="h-20 w-20 animate-float-y sm:h-24 sm:w-24" />
            </motion.div>
          </PixelPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12"
        >
          <PixelButton variant="ghost" onClick={onBack}>
            ◀ 回厨房调整
          </PixelButton>
        </motion.div>
      </Container>
    </section>
  )
}
