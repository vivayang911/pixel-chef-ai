import { motion, type Variants } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelChef from '@/components/ui/PixelChef'
import PixelFridge from './PixelFridge'
import SpeechBubble from './SpeechBubble'
import { useLanguage } from '@/i18n/LanguageContext'

const titleContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
}
const letter: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 22 } },
}

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
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </motion.span>
  )
}

const PARTICLES = [
  { c: 'bg-tomato', x: '8%', y: '18%', s: 10, duration: 4.2 },
  { c: 'bg-cheese', x: '82%', y: '10%', s: 8, duration: 5.1 },
  { c: 'bg-mint', x: '72%', y: '68%', s: 12, duration: 4.8 },
  { c: 'bg-sky', x: '16%', y: '72%', s: 9, duration: 5.5 },
  { c: 'bg-grape', x: '48%', y: '6%', s: 7, duration: 3.8 },
  { c: 'bg-cream', x: '90%', y: '50%', s: 6, duration: 4.5 },
  { c: 'bg-tomato/50', x: '34%', y: '82%', s: 5, duration: 5.9 },
  { c: 'bg-cheese/50', x: '56%', y: '76%', s: 8, duration: 4.1 },
]

const STARS = [
  { x: '12%', y: '22%', delay: 0 },
  { x: '62%', y: '14%', delay: 0.7 },
  { x: '78%', y: '60%', delay: 1.3 },
  { x: '28%', y: '74%', delay: 1.9 },
  { x: '44%', y: '30%', delay: 0.4 },
]

interface MemoryKitchenProps {
  onStart?: () => void
}

export default function MemoryKitchen({ onStart }: MemoryKitchenProps) {
  const { t } = useLanguage()

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-10 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-kitchen" />

      {[0, 1, 2].map((i) => (
        <motion.span
          key={`steam-${i}`}
          className="pointer-events-none absolute top-1/2 block h-10 w-1 rounded-none bg-cream/10 blur-sm"
          style={{ left: `${52 + i * 6}%` }}
          animate={{
            y: [0, -40, -80],
            opacity: [0, 0.3, 0],
            scaleX: [1, 1.8, 2.5],
          }}
          transition={{
            duration: 3.2 + i * 0.6,
            repeat: Infinity,
            delay: i * 1.1,
            ease: 'easeOut',
          }}
        />
      ))}

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute ${p.c}`}
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {STARS.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          className="pointer-events-none absolute block h-2.5 w-2.5 bg-cheese"
          style={{ left: star.x, top: star.y }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 45, 90],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
        />
      ))}

      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block border-4 border-ink bg-mint px-3 py-1 font-pixel text-[9px] text-ink shadow-pixel-sm"
          >
            {t('home.devChallenge')}
          </motion.span>

          <h1 className="mt-5 font-pixel text-3xl leading-relaxed text-cream sm:text-5xl">
            <StaggerText text={t('home.memory')} className="text-tomato" />
            <br />
            <StaggerText text={t('home.kitchen')} className="text-cheese" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-5 max-w-md font-sans text-base text-cream/70 sm:text-lg"
          >
            {t('home.tagline')}
          </motion.p>

          <div className="mt-6">
            <SpeechBubble text={t('home.chefGreeting')} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="mt-4 font-terminal text-lg text-cream/50"
          >
            {t('home.statusReady')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <PixelButton variant="tomato" onClick={onStart}>
              {t('home.startCooking')}
            </PixelButton>
            <PixelButton variant="ghost">{t('home.watchDemo')}</PixelButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center py-10"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-kitchen-cream/5 blur-3xl" />
          <PixelFridge />
          <motion.div
            className="absolute -bottom-12 -right-8 sm:-bottom-14 sm:-right-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { delay: 0.5, type: 'spring', stiffness: 200, damping: 16 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            }}
          >
            <div className="relative">
              <PixelChef className="h-20 w-20 sm:h-24 sm:w-24" />
              <motion.div
                className="absolute -right-2 top-2"
                style={{ transformOrigin: 'bottom center' }}
                animate={{ rotate: [-12, 16, -12] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  viewBox="0 0 10 10"
                  className="h-5 w-5"
                  shapeRendering="crispEdges"
                  aria-hidden="true"
                >
                  <rect x="3" y="2" width="4" height="5" fill="#ffcb3b" />
                  <rect x="2" y="6" width="6" height="3" fill="#ffcb3b" />
                  <rect x="2" y="8" width="1" height="1" fill="#0d0b1f" />
                  <rect x="4" y="8" width="1" height="1" fill="#0d0b1f" />
                  <rect x="6" y="8" width="1" height="1" fill="#0d0b1f" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
