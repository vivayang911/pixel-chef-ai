import type { Ingredient } from '@/types/food'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'

const T = translations.engineMemory

export interface TasteProfile {
  /** Current archetype PIXEL believes the chef is, e.g. "🔥 Fire Lover". */
  title: string
  likes: string[]
  healthGoal: string
}

export interface MemoryFeedback {
  message: string
  tasteProfile: TasteProfile
  nutritionAdvice: string
}

const BASE_PROFILE: TasteProfile = {
  title: '🔥 Fire Lover',
  likes: ['Crispy', 'Spicy'],
  healthGoal: 'Balanced',
}

const TAG_LABELS: Record<string, string> = {
  crispy: 'Crispy', spicy: 'Spicy', fire: 'Fire', rich: 'Rich',
  fresh: 'Fresh', healthy: 'Healthy', umami: 'Umami', sweet: 'Sweet',
  aromatic: 'Aromatic', bold: 'Bold', light: 'Light', savory: 'Savory',
  tender: 'Tender', green: 'Green', crunchy: 'Crunchy', earthy: 'Earthy',
  soft: 'Soft', warm: 'Warm', delicate: 'Delicate',
}

function countTags(ingredients: Ingredient[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const ing of ingredients) {
    for (const tag of ing.tasteTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return counts
}

function deriveProfile(ingredients: Ingredient[]): TasteProfile {
  const counts = countTags(ingredients)
  const score = (...tags: string[]) => tags.reduce((s, t) => s + (counts.get(t) ?? 0), 0)
  const fire = score('fire', 'spicy')
  const green = score('healthy', 'green', 'fresh')
  const umami = score('umami', 'savory', 'rich')

  const title =
    fire >= 2 ? '🔥 Fire Lover'
    : green >= 3 ? '🌿 Green Guardian'
    : umami >= 2 ? '✨ Umami Seeker'
    : BASE_PROFILE.title

  const likes = [...BASE_PROFILE.likes]
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
  for (const [tag] of sorted) {
    const label = TAG_LABELS[tag]
    if (label && !likes.includes(label)) likes.push(label)
    if (likes.length >= 4) break
  }

  const totalCal = ingredients.reduce((s, i) => s + i.calories, 0)
  const healthGoal = totalCal > 600 ? 'Lighten Up' : BASE_PROFILE.healthGoal

  return { title, likes, healthGoal }
}

function deriveNutritionAdvice(ingredients: Ingredient[], lang: Lang): string {
  const totalCal = ingredients.reduce((s, i) => s + i.calories, 0)
  const hasProtein = ingredients.some((i) => i.category === 'protein')
  const hasVeg = ingredients.some((i) => i.category === 'vegetable')
  const hasFlavor = ingredients.some((i) => i.category === 'flavor')

  const NA = T.nutritionAdvice
  if (totalCal >= 700) return NA.heavy[lang]({ cal: totalCal })
  if (hasProtein && hasVeg && hasFlavor) return NA.perfect[lang]({ cal: totalCal })
  if (hasProtein && !hasVeg) return NA.needVeg[lang]({ cal: totalCal })
  if (!hasProtein) return NA.needProtein[lang]({ cal: totalCal })
  return NA.default[lang]({ cal: totalCal })
}

/** PIXEL's memory engine: reads the current pot and answers with memory-flavored text. */
export function generateFeedback(ingredients: Ingredient[], lang: Lang = 'en'): MemoryFeedback {
  if (ingredients.length === 0) {
    return {
      message: T.welcome[lang],
      tasteProfile: BASE_PROFILE,
      nutritionAdvice: T.emptyHint[lang],
    }
  }

  const ids = ingredients.map((i) => i.id)
  const last = ingredients[ingredients.length - 1]

  // Combo matching: sort ids to match key format
  const comboKeys = Object.keys(T.comboMessages) as Array<keyof typeof T.comboMessages>
  const comboKey = comboKeys.find((key) => {
    const parts = key.split('-')
    return parts.every((id) => ids.includes(id)) && parts.length === ids.length
  })

  const message = comboKey
    ? T.comboMessages[comboKey][lang]
    : (T.memoryLines as Record<string, Record<Lang, string>>)[last.id]?.[lang]
      ?? T.fallback[lang]

  return {
    message,
    tasteProfile: deriveProfile(ingredients),
    nutritionAdvice: deriveNutritionAdvice(ingredients, lang),
  }
}
