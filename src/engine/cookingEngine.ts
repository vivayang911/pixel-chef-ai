import type { Ingredient } from '@/types/food'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TasteScore {
  taste: number
  creativity: number
  nutrition: number
}

export interface CookingResult {
  success: boolean
  score: TasteScore
  events: string[]
  message: string
  dishName: string
}

export type CookingEventType = 'fireTooHigh' | 'tooFast' | 'perfectFlavor'

export interface CookingEventDef {
  id: CookingEventType
  emoji: string
  title: string
  aiMessage: string
  scoreEffect: TasteScore
  duration: number // ms the event card stays on screen
}

/* ------------------------------------------------------------------ */
/*  Event catalogue                                                    */
/* ------------------------------------------------------------------ */

export const COOKING_EVENTS: CookingEventDef[] = [
  {
    id: 'fireTooHigh',
    emoji: '🔥🔥🔥',
    title: 'Fire Too High',
    aiMessage: "Your fire is too strong! Let's turn it down a notch 🔥",
    scoreEffect: { taste: -8, creativity: 0, nutrition: 0 },
    duration: 2.5,
  },
  {
    id: 'tooFast',
    emoji: '⏰',
    title: 'Too Fast',
    aiMessage: 'You are cooking too quickly. Good flavors need time to bloom 🌿',
    scoreEffect: { taste: -5, creativity: -5, nutrition: 0 },
    duration: 2.5,
  },
  {
    id: 'perfectFlavor',
    emoji: '✨',
    title: 'Perfect Flavor',
    aiMessage: "The aroma is amazing! I can tell this is going to be special ✨",
    scoreEffect: { taste: 10, creativity: 5, nutrition: 0 },
    duration: 2.5,
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

/** Pick which three events fire (non-repeating types) and when. */
export function scheduleEvents(recommended: number): { type: CookingEventType; atRemaining: number }[] {
  const shuffled = [...COOKING_EVENTS].sort(() => Math.random() - 0.5)
  return shuffled.map((e, i) => {
    // Schedule roughly in thirds of the remaining time
    const base = ((i + 1) / 4) * recommended
    const jitter = (Math.random() - 0.5) * 3
    return { type: e.id, atRemaining: Math.max(2, Math.round(base + jitter)) }
  })
}

/* ------------------------------------------------------------------ */
/*  Recommended cook time from ingredients                             */
/* ------------------------------------------------------------------ */

export function getRecommendedTime(ingredients: Ingredient[]): number {
  let time = 12
  for (const ing of ingredients) {
    time += 2
    if (ing.category === 'protein') time += ing.calories > 300 ? 6 : 3
  }
  return Math.max(10, time)
}

/* ------------------------------------------------------------------ */
/*  Dish name generator                                                */
/* ------------------------------------------------------------------ */

export function nameDish(ingredients: Ingredient[]): string {
  const ids = ingredients.map((d) => d.id)
  const spicy = ids.includes('chili')
  const base = ids.includes('pork-belly')
    ? 'Seared Pork Belly'
    : ids.includes('chicken')
      ? 'Pan-Seared Chicken Breast'
      : ids.includes('fish')
        ? 'Steamed Fresh Fish'
        : 'Garden Vegetables'
  return `${spicy ? 'Spicy ' : ''}${base}`
}

/* ------------------------------------------------------------------ */
/*  Main cooking computation                                           */
/* ------------------------------------------------------------------ */

export function computeCookingResult(
  ingredients: Ingredient[],
  userTime: number,
  recommended: number,
  eventIds: string[],
  lang: Lang = 'en',
): CookingResult {
  const T = translations.engineCooking
  const ratio = userTime / recommended

  let taste = 68
  let creativity = 62
  let nutrition = 58
  let message = ''

  // --- Timing ---
  if (ratio >= 0.85 && ratio <= 1.15) {
    taste += 15
    creativity += 5
  } else if (ratio < 0.7) {
    taste -= 25
    message = T.underCooked[lang]
  } else if (ratio > 1.35) {
    taste -= 18
    creativity += 3
    message = T.overDone[lang]
  } else {
    taste += 5
  }

  // --- Ingredient diversity ---
  const uniqueTags = new Set(ingredients.flatMap((i) => i.tasteTags)).size
  creativity += Math.min(uniqueTags * 4, 22)

  const hasAllCategories =
    ingredients.some((i) => i.category === 'protein') &&
    ingredients.some((i) => i.category === 'vegetable') &&
    ingredients.some((i) => i.category === 'flavor')
  if (hasAllCategories) nutrition += 28

  const totalCal = ingredients.reduce((s, i) => s + i.calories, 0)
  if (totalCal < 300) nutrition += 12
  else if (totalCal > 700) nutrition -= 12

  // --- Event effects ---
  const defs = COOKING_EVENTS.filter((e) => eventIds.includes(e.id))
  for (const ev of defs) {
    taste += ev.scoreEffect.taste
    creativity += ev.scoreEffect.creativity
    nutrition += ev.scoreEffect.nutrition
  }

  taste = clamp(taste, 22, 100)
  creativity = clamp(creativity, 22, 100)
  nutrition = clamp(nutrition, 22, 100)

  const avg = (taste + creativity + nutrition) / 3
  const success = avg >= 55

  if (!message) {
    message = success ? T.successMsg[lang] : T.failMsg[lang]
  }

  return {
    success,
    score: { taste: Math.round(taste), creativity: Math.round(creativity), nutrition: Math.round(nutrition) },
    events: eventIds,
    message,
    dishName: nameDish(ingredients),
  }
}
