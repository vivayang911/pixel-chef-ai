import Container from '@/components/ui/Container'
import PixelChef from '@/components/ui/PixelChef'

export default function Footer() {
  return (
    <footer className="mt-24 border-t-4 border-ink bg-ink-soft">
      <Container className="flex flex-col items-center gap-4 py-10 text-center">
        <PixelChef className="h-12 w-12" />
        <p className="font-pixel text-[10px] text-cream/60">
          PIXEL CHEF AI · MADE WITH ♥ & PIXELS
        </p>
        <p className="font-terminal text-lg text-cream/40">
          A frontend demo for the DEV Frontend Challenge · No backend, no login,
          just vibes.
        </p>
      </Container>
    </footer>
  )
}
