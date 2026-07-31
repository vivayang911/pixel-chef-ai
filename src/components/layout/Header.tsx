import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelChef from '@/components/ui/PixelChef'

const NAV_LINKS = [
  { label: 'Cookbook', href: '#cookbook' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
]

interface HeaderProps {
  onStart?: () => void
}

export default function Header({ onStart }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b-4 border-ink bg-ink/90 backdrop-blur"
    >
      <Container className="flex items-center justify-between py-3">
        <a href="#top" className="flex items-center gap-3">
          <PixelChef className="h-10 w-10 animate-float-y" />
          <span className="font-pixel text-[12px] leading-tight text-cream sm:text-sm">
            PIXEL
            <br />
            <span className="text-tomato">CHEF</span>
            <span className="text-cheese"> AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-terminal text-xl text-cream/80 transition-colors hover:text-cheese"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <PixelButton variant="tomato" className="hidden sm:inline-flex" onClick={onStart}>
          Start Cooking
        </PixelButton>
      </Container>
    </motion.header>
  )
}
