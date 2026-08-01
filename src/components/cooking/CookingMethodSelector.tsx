import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'

/* ------------------------------------------------------------------ */
/*  Cooking Method type                                                */
/* ------------------------------------------------------------------ */

export type CookingMethod = 'stir-fry' | 'steam' | 'boil' | 'deep-fry' | 'roast' | 'simmer'

export interface MethodOption {
  id: CookingMethod
  emoji: string
  labelEn: string
  labelZh: string
  descEn: string
  descZh: string
}

export const COOKING_METHODS: MethodOption[] = [
  {
    id: 'stir-fry',
    emoji: '🔥',
    labelEn: 'Stir-fry',
    labelZh: '炒',
    descEn: 'High heat, quick, crispy',
    descZh: '大火快炒，焦香脆嫩',
  },
  {
    id: 'steam',
    emoji: '♨️',
    labelEn: 'Steam',
    labelZh: '蒸',
    descEn: 'Light, healthy, preserves nutrients',
    descZh: '清淡健康，锁住营养',
  },
  {
    id: 'boil',
    emoji: '💧',
    labelEn: 'Boil',
    labelZh: '煮',
    descEn: 'Simple, comforting, soupy',
    descZh: '简单温暖，汤水滋润',
  },
  {
    id: 'deep-fry',
    emoji: '🍤',
    labelEn: 'Deep-fry',
    labelZh: '炸',
    descEn: 'Crispy, indulgent, golden',
    descZh: '酥脆金黄，极致享受',
  },
  {
    id: 'roast',
    emoji: '🍖',
    labelEn: 'Roast',
    labelZh: '烤',
    descEn: 'Charred, smoky, intense',
    descZh: '焦香熏烤，浓郁深沉',
  },
  {
    id: 'simmer',
    emoji: '🍲',
    labelEn: 'Simmer',
    labelZh: '炖',
    descEn: 'Slow, tender, rich',
    descZh: '慢火细炖，浓郁入味',
  },
]

/* ------------------------------------------------------------------ */
/*  Method Card                                                        */
/* ------------------------------------------------------------------ */

const MethodCard = memo(function MethodCard({
  method,
  isSelected,
  onSelect,
}: {
  method: MethodOption
  isSelected: boolean
  onSelect: (id: CookingMethod) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(method.id)}
      className={`
        relative flex flex-col items-center gap-2 p-4 rounded-lg
        border-2 transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'border-grape bg-grape/10 shadow-[0_0_16px_rgba(147,112,219,0.3)] scale-105'
          : 'border-cream/15 bg-ink hover:border-cream/40 hover:bg-ink/80'
        }
      `}
      whileHover={{ scale: isSelected ? 1.05 : 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      {/* Emoji */}
      <span className="text-3xl leading-none">{method.emoji}</span>

      {/* Labels */}
      <div className="flex items-center gap-1.5">
        <span className="text-cream/90 text-sm font-mono font-bold tracking-wider">
          {method.labelEn}
        </span>
        <span className="text-cream/40 text-xs">|</span>
        <span className="text-cream/70 text-sm">{method.labelZh}</span>
      </div>

      {/* Description */}
      <span className="text-cream/50 text-[10px] leading-tight text-center">
        {method.descEn}
      </span>

      {/* Pixel-art corner decorations */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-grape/20" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-grape/20" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-grape/20" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-grape/20" />
    </motion.button>
  )
})

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface CookingMethodSelectorProps {
  visible: boolean
  onSubmit: (method: CookingMethod) => void
  onBack: () => void
}

export default memo(function CookingMethodSelector({
  visible,
  onSubmit,
  onBack,
}: CookingMethodSelectorProps) {
  const { language } = useLanguage()
  const [selected, setSelected] = useState<CookingMethod | null>(null)

  const title = language === 'zh'
    ? '选择烹饪方式'
    : language === 'ja'
      ? '調理法を選択'
      : 'Choose Your Cooking Method'

  const subtitle = language === 'zh'
    ? '挑选一种方式，让 AI 为你掌控火候'
    : language === 'ja'
      ? '調理法を選んで、AIに火加減を任せよう'
      : 'Pick a method, and let AI handle the heat'

  const confirmLabel = language === 'zh'
    ? '▶ 开始烹饪'
    : language === 'ja'
      ? '▶ 調理開始'
      : '▶ START COOKING'

  const backLabel = language === 'zh'
    ? '◀ 返回'
    : language === 'ja'
      ? '◀ 戻る'
      : '◀ BACK'

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-ink/90 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back button */}
          <motion.button
            type="button"
            onClick={onBack}
            className="absolute top-4 left-4 text-cream/60 hover:text-cream font-mono text-xs tracking-wider px-3 py-2 border border-cream/15 rounded hover:border-cream/30 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {backLabel}
          </motion.button>

          {/* Title section */}
          <motion.div
            className="mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-cream/90 text-lg font-mono font-bold tracking-[0.15em] mb-1">
              {title}
            </h2>
            <p className="text-cream/40 text-xs tracking-wider">{subtitle}</p>
          </motion.div>

          {/* Method grid */}
          <motion.div
            className="grid grid-cols-3 gap-3 w-full max-w-[340px] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {COOKING_METHODS.map((method, i) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <MethodCard
                  method={method}
                  isSelected={selected === method.id}
                  onSelect={setSelected}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Confirm button */}
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className={`
              font-mono text-sm tracking-[0.1em] px-8 py-3 rounded-lg
              border-2 transition-all duration-300
              ${selected
                ? 'border-grape bg-grape/20 text-cream cursor-pointer hover:bg-grape/30 hover:shadow-[0_0_20px_rgba(147,112,219,0.4)]'
                : 'border-cream/10 bg-cream/5 text-cream/25 cursor-not-allowed'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {confirmLabel}
          </motion.button>

          {/* Pixel-art decorative dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${i === COOKING_METHODS.findIndex(m => m.id === selected) % 6 ? 'bg-grape/60' : 'bg-cream/30'}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
