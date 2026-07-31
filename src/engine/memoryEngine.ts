import type { Ingredient } from '@/types/food'

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

/** What PIXEL already knows about the chef before anything is picked. */
const BASE_PROFILE: TasteProfile = {
  title: '🔥 Fire Lover',
  likes: ['Crispy', 'Spicy'],
  healthGoal: 'Balanced',
}

const WELCOME_MESSAGE =
  "I'm PIXEL, your AI kitchen companion. Pick a few ingredients from the fridge — I'll guide you based on your taste memory and health goals 🍳"

/** Long-term taste memory: what PIXEL "remembers" per ingredient. */
const MEMORY_LINES: Record<string, string> = {
  'pork-belly': "I remember you love crispy textures 🔥 You always sear it until the edges are golden brown",
  chicken: "Chicken breast fits your recent health goals 💪 Last time you went double garlic!",
  fish: "Fish is your light-and-fresh go-to 🐟 A touch of herb makes it even brighter",
  broccoli: "Great choice! Your plate has been getting greener lately 🥦",
  mushroom: "Mushroom umami replaces some of the oil — clever move 🍄",
  carrot: "Carrot's natural sweetness can balance the heat 🥕 You've done this before",
  garlic: "Garlic is your old friend 🧄 It's in almost every dish you make",
  chili: "Your spice tolerance is climbing 🌶 I'm taking notes",
  herb: "A little herb, and the layers pop instantly 🌿 That's a pro-chef move",
}

/** Combo memories take priority over single-ingredient lines. */
const COMBO_RULES: { has: string[]; message: string }[] = [
  {
    has: ['pork-belly', 'broccoli', 'mushroom'],
    message: "Perfect! Broccoli and mushroom balance out the pork belly's richness ✨ That's your health goal right there",
  },
  {
    has: ['pork-belly', 'broccoli'],
    message: "Broccoli came to save the day! Pork belly's richness reined back in 🥦 I remember you wanted lighter plates",
  },
  {
    has: ['chili', 'garlic'],
    message: "Garlic + Chili — your signature flavor bomb 🌶 Don't forget the range hood!",
  },
  {
    has: ['fish', 'herb'],
    message: "Fish with herbs — delicate and elegant 🐟🌿 Your palate is leveling up",
  },
  {
    has: ['chicken', 'broccoli'],
    message: "Chicken breast + broccoli — classic fitness plate 💪 Add mushroom for extra umami",
  },
]

/** Display labels for raw taste tags. */
const TAG_LABELS: Record<string, string> = {
  crispy: 'Crispy',
  spicy: 'Spicy',
  fire: 'Fire',
  rich: 'Rich',
  fresh: 'Fresh',
  healthy: 'Healthy',
  umami: 'Umami',
  sweet: 'Sweet',
  aromatic: 'Aromatic',
  bold: 'Bold',
  light: 'Light',
  savory: 'Savory',
  tender: 'Tender',
  green: 'Green',
  crunchy: 'Crunchy',
  earthy: 'Earthy',
  soft: 'Soft',
  warm: 'Warm',
  delicate: 'Delicate',
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
    fire >= 2
      ? '🔥 Fire Lover'
      : green >= 3
        ? '🌿 Green Guardian'
        : umami >= 2
          ? '✨ Umami Seeker'
          : BASE_PROFILE.title

  // Start from remembered likes, then fold in the strongest tags from the pot.
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

function deriveNutritionAdvice(ingredients: Ingredient[]): string {
  const totalCal = ingredients.reduce((s, i) => s + i.calories, 0)
  const hasProtein = ingredients.some((i) => i.category === 'protein')
  const hasVeg = ingredients.some((i) => i.category === 'vegetable')
  const hasFlavor = ingredients.some((i) => i.category === 'flavor')

  if (totalCal >= 700) {
    return `~${totalCal} kcal ⚠️ That's a bit heavy — your recent goal is lighter eating. Try adding broccoli and mushroom for balance`
  }
  if (hasProtein && hasVeg && hasFlavor) {
    return `~${totalCal} kcal ✅ Protein, veggies, and flavor — this is a complete, well-rounded dish`
  }
  if (hasProtein && !hasVeg) {
    return `~${totalCal} kcal · Your recent goal is healthier eating — consider adding broccoli or mushroom`
  }
  if (!hasProtein) {
    return `~${totalCal} kcal · Missing a protein source — this dish needs one to feel complete`
  }
  return `~${totalCal} kcal · Solid combo — keep going!`
}

/**
 * PIXEL's memory engine: reads the current pot and answers with
 * a memory-flavored message, an evolving taste profile and nutrition advice.
 */
export function generateFeedback(ingredients: Ingredient[]): MemoryFeedback {
  if (ingredients.length === 0) {
    return {
      message: WELCOME_MESSAGE,
      tasteProfile: BASE_PROFILE,
      nutritionAdvice: 'Pick 3 ingredients (including 1 protein) and we can fire up the stove!',
    }
  }

  const ids = ingredients.map((i) => i.id)
  const combo = COMBO_RULES.find((rule) => rule.has.every((id) => ids.includes(id)))
  const last = ingredients[ingredients.length - 1]
  const message = combo?.message ?? MEMORY_LINES[last.id] ?? "Nice choice! I'll remember that."

  return {
    message,
    tasteProfile: deriveProfile(ingredients),
    nutritionAdvice: deriveNutritionAdvice(ingredients),
  }
}
