import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import PixelButton from '@/components/ui/PixelButton'
import PixelChef from '@/components/ui/PixelChef'
import { useLanguage } from '@/i18n/LanguageContext'
import { type Lang } from '@/i18n/translations'

const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  zh: '中',
  ja: '日',
}

interface HeaderProps {
  onStart?: () => void
}

export default function Header({ onStart }: HeaderProps) {
  const { t, lang, cycleLang } = useLanguage()

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

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={cycleLang}
            className="rounded border-2 border-cream/30 px-2 py-1 font-pixel text-[10px] text-cream/70 transition-colors hover:border-cheese hover:text-cheese sm:text-xs"
            title={lang === 'en' ? 'Switch to 中文' : lang === 'zh' ? '日本語に切替' : 'Switch to English'}
          >
            {LANG_LABELS[lang]}
          </motion.button>

          <PixelButton variant="tomato" className="hidden sm:inline-flex" onClick={onStart}>
            {t('home.startCooking')}
          </PixelButton>
        </div>
      </Container>
    </motion.header>
  )
}
