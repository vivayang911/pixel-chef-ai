import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelPanel from '@/components/ui/PixelPanel'
import PixelChef from '@/components/ui/PixelChef'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-block border-4 border-ink bg-mint px-3 py-1 font-pixel text-[9px] text-ink shadow-pixel-sm"
          >
            ★ DEV FRONTEND CHALLENGE
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-pixel text-3xl leading-relaxed text-cream sm:text-4xl lg:text-5xl"
          >
            COOK LIKE A
            <br />
            <span className="text-tomato">16-BIT</span>{' '}
            <span className="text-cheese">MASTER</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md font-sans text-base text-cream/70 sm:text-lg"
          >
            Pixel Chef AI turns your fridge leftovers into pixel-perfect recipes.
            Remix dishes, plate them in retro style, and beat the
            ingredient-level boss fights.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <PixelButton variant="tomato">▶ Start Cooking</PixelButton>
            <PixelButton variant="ghost">Watch Demo</PixelButton>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex items-center gap-6 font-terminal text-xl text-cream/50"
          >
            <span>
              <span className="text-cheese">120+</span> Recipes
            </span>
            <span>
              <span className="text-mint">∞</span> Remixes
            </span>
            <span>
              <span className="text-sky">0</span> Backend
            </span>
          </motion.div>
        </motion.div>

        {/* Visual: floating AI "dish" preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative flex justify-center"
        >
          <div className="relative animate-float-y">
            <PixelPanel glow="tomato" className="w-72 p-5 sm:w-80">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <span className="font-pixel text-[9px] text-cheese">
                  AI KITCHEN
                </span>
                <span className="h-3 w-3 animate-blink rounded-none bg-mint" />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <PixelChef className="h-20 w-20 animate-hue-shift" />
                <div className="font-terminal text-xl leading-tight text-cream">
                  Generating
                  <br />
                  <span className="text-tomato">Pixel Paella</span>…
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {[88, 64, 42].map((w, i) => (
                  <div key={i} className="h-3 bg-ink-line">
                    <motion.div
                      className="h-full bg-cheese"
                      initial={{ width: 0 }}
                      animate={{ width: `${w}%` }}
                      transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                    />
                  </div>
                ))}
              </div>
            </PixelPanel>
          </div>

          {/* Decorative pulse ring behind the panel */}
          <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full border-4 border-grape" />
        </motion.div>
      </Container>
    </section>
  )
}
