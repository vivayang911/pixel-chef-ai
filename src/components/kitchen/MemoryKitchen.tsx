import { motion, type Variants } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelFridge from './PixelFridge'
import SpeechBubble from './SpeechBubble'

const WELCOME =
  "Hi Chef! I'm PIXEL, your AI sous-chef. Crack open the fridge, toss me what you've got, and I'll remix it into a 16-bit masterpiece. Ready to cook?"

const titleContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
}
const letter: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 22 } },
}

/** Renders text as individually staggered, spring-animated pixel letters. */
function StaggerText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.span
      variants={titleContainer}
      initial="hidden"
      animate="show"
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {text.split('').map((c, i) => (
        <motion.span key={i} variants={letter} className="inline-block" aria-hidden>
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </motion.span>
  )
}

const PARTICLES = [
  { c: 'bg-tomato', x: '10%', y: '20%', s: 10 },
  { c: 'bg-cheese', x: '82%', y: '14%', s: 8 },
  { c: 'bg-mint', x: '72%', y: '72%', s: 12 },
  { c: 'bg-sky', x: '18%', y: '76%', s: 9 },
  { c: 'bg-grape', x: '52%', y: '8%', s: 7 },
  { c: 'bg-cream', x: '90%', y: '54%', s: 6 },
]

export default function MemoryKitchen() {
  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-10 sm:pt-16">
      {/* Ambient floating pixel particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute ${p.c}`}
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          animate={{ y: [0, -14, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left: copy + AI welcome */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block border-4 border-ink bg-mint px-3 py-1 font-pixel text-[9px] text-ink shadow-pixel-sm"
          >
            ★ DEV FRONTEND CHALLENGE
          </motion.span>

          <h1 className="mt-5 font-pixel text-3xl leading-relaxed text-cream sm:text-5xl">
            <StaggerText text="MEMORY" className="text-tomato" />
            <br />
            <StaggerText text="KITCHEN" className="text-cheese" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-5 max-w-md font-sans text-base text-cream/70 sm:text-lg"
          >
            Your 16-bit AI cooking companion. Open the fridge and let PIXEL remix
            your leftovers into legendary pixel recipes.
          </motion.p>

          <div className="mt-6">
            <SpeechBubble text={WELCOME} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <PixelButton variant="tomato">▶ Start Cooking</PixelButton>
            <PixelButton variant="ghost">Watch Demo</PixelButton>
          </motion.div>
        </div>

        {/* Right: interactive kitchen scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center py-10"
        >
          <PixelFridge />
        </motion.div>
      </Container>
    </section>
  )
}
