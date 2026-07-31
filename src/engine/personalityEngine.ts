import type { Ingredient } from '@/types/food'
import type { TasteScore } from '@/engine/cookingEngine'
import type { PersonalityReport } from '@/types/memory'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'

/* ================================================================ */
/*  Archetype definitions                                            */
/* ================================================================ */

interface Archetype {
  emoji: string
  id: 'fireChef' | 'healthyCreator' | 'flavorExplorer' | 'comfortCook' | 'kitchenScientist'
  traits: string[]
}

const ARCHETYPES: Archetype[] = [
  { emoji: '🔥', id: 'fireChef', traits: ['Crispy Lover', 'Fast Cooker', 'Bold Flavor', 'High Heat'] },
  { emoji: '🌿', id: 'healthyCreator', traits: ['Balanced', 'Fresh', 'Light Taste', 'Veggie Fan'] },
  { emoji: '✨', id: 'flavorExplorer', traits: ['Curious', 'Diverse', 'Creative', 'Aroma Hunter'] },
  { emoji: '🍖', id: 'comfortCook', traits: ['Rich', 'Hearty', 'Warm', 'Traditional'] },
  { emoji: '🧪', id: 'kitchenScientist', traits: ['Precise', 'Methodical', 'Balanced', 'Technique'] },
]

function getArchetypeLabel(id: Archetype['id'], _lang: Lang): string {
  const P = translations.en.personality as Record<string, string>
  const label = P[id] ?? `${ARCHETYPES.find((a) => a.id === id)?.emoji} ${id}`
  return label
}

/* ================================================================ */
/*  Memory lines (AI reflection logs)                                */
/* ================================================================ */

function buildReflection(
  ingredients: Ingredient[],
  score: TasteScore,
  events: string[],
  dishName: string,
): string {
  const hasProtein = ingredients.some((i) => i.category === 'protein')
  const hasVeg = ingredients.some((i) => i.category === 'vegetable')
  const hasFlavor = ingredients.some((i) => i.category === 'flavor')
  const spicy = ingredients.some((i) => i.id === 'chili')
  const crispy = ingredients.some((i) => i.tasteTags.includes('crispy'))
  const fireEvent = events.includes('fireTooHigh')
  const perfectEvent = events.includes('perfectFlavor')
  const avg = Math.round((score.taste + score.creativity + score.nutrition) / 3)

  const lines: string[] = []
  lines.push(`Tonight you created: ${dishName}.`)

  const obs: string[] = []
  if (spicy && crispy) obs.push('strong fire and crispy texture')
  else if (spicy) obs.push('bold spicy flavors')
  else if (crispy) obs.push('a love for crispy mouthfeel')

  if (hasVeg && hasProtein && hasFlavor) obs.push('a natural instinct for balancing richness, freshness, and aroma')
  else if (hasVeg && hasProtein) obs.push('a natural instinct for balancing richness with freshness')
  else if (hasVeg) obs.push('a preference for clean, vegetable-forward plates')
  else if (hasProtein) obs.push('a protein-heavy, hearty cooking style')

  if (obs.length > 0) {
    lines.push(`I noticed something: you love ${obs.join(', and ')}.`)
  }

  if (fireEvent) {
    lines.push('The fire ran a little hot today, but that only proves how passionate you are in the kitchen 🔥')
  }
  if (perfectEvent) {
    lines.push('That perfect-flavor moment was real — your seasoning instincts are sharp ✨')
  }

  if (avg >= 75) {
    lines.push('This dish scored beautifully across the board. Your cooking is evolving fast!')
  } else if (avg >= 55) {
    lines.push('A solid creation. Every cook adds a new page to your taste story.')
  } else {
    lines.push("Not every experiment goes as planned. But today taught us something new — and that matters more.")
  }

  return lines.join(' ')
}

/* ================================================================ */
/*  Archetype selector                                               */
/* ================================================================ */

function pickArchetype(ingredients: Ingredient[], events: string[], score: TasteScore): Archetype {
  const tagCounts = new Map<string, number>()
  for (const ing of ingredients) {
    for (const t of ing.tasteTags) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    }
  }

  const fire = (tagCounts.get('fire') ?? 0) + (tagCounts.get('spicy') ?? 0)
  const green = (tagCounts.get('healthy') ?? 0) + (tagCounts.get('green') ?? 0) + (tagCounts.get('fresh') ?? 0)
  const umami = (tagCounts.get('umami') ?? 0) + (tagCounts.get('savory') ?? 0) + (tagCounts.get('rich') ?? 0)

  if (fire >= 2 || events.includes('fireTooHigh')) return ARCHETYPES[0]
  if (green >= 3) return ARCHETYPES[1]
  if (tagCounts.size >= 5 || events.includes('perfectFlavor')) return ARCHETYPES[2]
  const avg = (score.taste + score.creativity + score.nutrition) / 3
  if (avg >= 70 && Math.abs(score.taste - score.creativity) <= 10) return ARCHETYPES[4]
  if (umami >= 2) return ARCHETYPES[3]
  return ARCHETYPES[1]
}

/* ================================================================ */
/*  Future suggestion                                                */
/* ================================================================ */

const SUGGESTIONS: { trigger: (ingredients: Ingredient[]) => boolean; dish: string; reason: string }[] = [
  { trigger: (ings) => ings.some((i) => i.id === 'pork-belly'), dish: 'Korean Spicy Chicken 🍗', reason: 'Similar crispy texture but lower calories — a healthier twist on your love for crunch!' },
  { trigger: (ings) => ings.some((i) => i.id === 'chicken'), dish: 'Teriyaki Salmon Bowl 🐟', reason: 'You enjoyed lean protein — try fish for a different kind of tender umami experience.' },
  { trigger: (ings) => ings.some((i) => i.id === 'fish'), dish: 'Garlic Butter Shrimp 🦐', reason: 'You like delicate seafood. Shrimp brings a satisfying snap and pairs perfectly with your garlic habit.' },
  { trigger: (ings) => ings.some((i) => i.id === 'chili'), dish: 'Sichuan Mapo Tofu 🌶', reason: 'Your spice tolerance is growing. Mapo Tofu is the next level of numbing heat.' },
  { trigger: () => true, dish: 'Mushroom Risotto 🍄', reason: 'A creamy, earthy dish that rewards patience — perfect for your evolving cooking style.' },
]

/* ================================================================ */
/*  Main engine entry point                                          */
/* ================================================================ */

export function generatePersonalityReport(
  ingredients: Ingredient[],
  score: TasteScore,
  events: string[],
  dishName: string,
  lang: Lang = 'en',
): PersonalityReport {
  const archetype = pickArchetype(ingredients, events, score)
  const reflection = buildReflection(ingredients, score, events, dishName)
  const label = getArchetypeLabel(archetype.id, lang)

  const favoriteIngredients = [...new Set(ingredients.map((i) => i.emoji))].slice(0, 3)

  const hasProtein = ingredients.some((i) => i.category === 'protein')
  const hasVeg = ingredients.some((i) => i.category === 'vegetable')
  const hasFlavor = ingredients.some((i) => i.category === 'flavor')
  let healthScore = score.nutrition * 0.6
  if (hasProtein && hasVeg && hasFlavor) healthScore += 18

  const suggestionDef = SUGGESTIONS.find((s) => s.trigger(ingredients)) ?? SUGGESTIONS[SUGGESTIONS.length - 1]

  return {
    personality: `${archetype.emoji} ${label}`,
    traits: archetype.traits,
    memory: reflection,
    suggestion: {
      dish: suggestionDef.dish,
      reason: suggestionDef.reason,
    },
    favoriteIngredients,
    healthScore: Math.round(Math.min(100, healthScore)),
  }
}
