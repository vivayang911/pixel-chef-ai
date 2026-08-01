import type { Ingredient } from '@/types/food'
import type { CookingResult } from './cookingEngine'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DishVisualConfig {
  dishName: string
  baseColor: string
  accentColor: string
  garnishColor: string
  plateColor: string
  effect: 'steam' | 'sizzle' | 'glow' | 'frost' | 'sparkle'
  layers: DishLayer[]
  scoreModifier: number
}

export interface DishLayer {
  type: 'base' | 'protein' | 'veg' | 'sauce' | 'garnish' | 'side'
  color: string
  shape: 'rect' | 'circle' | 'ellipse' | 'triangle' | 'ribbon'
  width: number
  height: number
  x: number
  y: number
  opacity?: number
  pattern?: 'striped' | 'dotted' | 'solid'
}

export interface FlavorDecision {
  icon: string
  title: string
  description: string
  timing: string
}

export interface AIStory {
  title: string
  narrative: string
  signature: string
}

/* ------------------------------------------------------------------ */
/*  Color Palettes                                                     */
/* ------------------------------------------------------------------ */

const METHOD_PALETTES: Record<string, { base: string; accent: string; garnish: string; plate: string; effect: DishVisualConfig['effect'] }> = {
  stirFry: { base: '#D4782F', accent: '#FF6B35', garnish: '#7EC850', plate: '#2A1A0A', effect: 'sizzle' },
  deepFry: { base: '#C8943E', accent: '#E8B84B', garnish: '#8BC34A', plate: '#1A1208', effect: 'sizzle' },
  steam: { base: '#A8D8B9', accent: '#5BA87E', garnish: '#F4A460', plate: '#1A2A1A', effect: 'steam' },
  boil: { base: '#E8C9A0', accent: '#D4956A', garnish: '#6BAF5A', plate: '#1A1510', effect: 'steam' },
  grill: { base: '#8B4513', accent: '#D2691E', garnish: '#228B22', plate: '#0D0D0D', effect: 'glow' },
  raw: { base: '#E87461', accent: '#F5A093', garnish: '#4CAF50', plate: '#1A1A2E', effect: 'frost' },
  simmer: { base: '#B8860B', accent: '#DAA520', garnish: '#3CB371', plate: '#1A1005', effect: 'steam' },
  bake: { base: '#CD853F', accent: '#DEB887', garnish: '#556B2F', plate: '#1A1208', effect: 'glow' },
}

const FLAVOR_PALETTES: Record<string, { tint: string; sparkle: string }> = {
  spicy: { tint: '#FF4444', sparkle: '#FF8888' },
  rich: { tint: '#DAA520', sparkle: '#FFD700' },
  fresh: { tint: '#4CAF50', sparkle: '#88FF88' },
  sweet: { tint: '#FF69B4', sparkle: '#FFB6C1' },
  savory: { tint: '#8B7355', sparkle: '#A0522D' },
}

/* ------------------------------------------------------------------ */
/*  Dish Generation                                                    */
/* ------------------------------------------------------------------ */

export function generateDishVisual(
  ingredients: Ingredient[],
  method: string,
  flavorProfile: string,
  score: number,
): DishVisualConfig {
  const ingIds = ingredients.map((i) => i.id)
  const palette = METHOD_PALETTES[method] ?? METHOD_PALETTES.stirFry

  // Score modifier affects visual richness
  const scoreModifier = Math.min(1, score / 100)

  const layers: DishLayer[] = buildLayers(ingIds, palette, scoreModifier)

  return {
    dishName: generateDishName(ingIds, method),
    baseColor: palette.base,
    accentColor: palette.accent,
    garnishColor: palette.garnish,
    plateColor: palette.plate,
    effect: palette.effect,
    layers,
    scoreModifier,
  }
}

function generateDishName(ingredientIds: string[], method: string): string {
  const mainIng = ingredientIds[0]?.replace(/-/g, ' ') ?? 'Mystery'
  const methodNames: Record<string, string> = {
    stirFry: 'Stir-Fried',
    deepFry: 'Crispy',
    steam: 'Steamed',
    boil: 'Simmered',
    grill: 'Grilled',
    raw: 'Fresh',
    simmer: 'Slow-Cooked',
    bake: 'Roasted',
  }
  const methodName = methodNames[method] ?? 'Prepared'
  if (ingredientIds.length >= 3) {
    return `${methodName} ${mainIng} Medley`
  }
  return `${methodName} ${mainIng}`
}

function buildLayers(
  ingredientIds: string[],
  palette: ReturnType<typeof getMethodPalette>,
  scoreModifier: number,
): DishLayer[] {
  const layers: DishLayer[] = []

  // Plate base
  layers.push({
    type: 'base',
    color: palette.plate,
    shape: 'circle',
    width: 180,
    height: 180,
    x: 0,
    y: 8,
  })

  // Main base layer
  layers.push({
    type: 'base',
    color: palette.base,
    shape: 'ellipse',
    width: 140 + scoreModifier * 20,
    height: 90 + scoreModifier * 10,
    x: 0,
    y: -2,
  })

  // Protein layer
  const hasProtein = ingredientIds.some((id) =>
    ['pork-belly', 'chicken', 'fish'].includes(id),
  )
  if (hasProtein) {
    const proteinId =
      ingredientIds.find((id) => ['pork-belly', 'chicken', 'fish'].includes(id)) ?? ingredientIds[0]
    const proteinColor = getIngredientColor(proteinId)
    layers.push({
      type: 'protein',
      color: proteinColor,
      shape: 'rect',
      width: 60 + scoreModifier * 15,
      height: 28 + scoreModifier * 8,
      x: 0,
      y: -12,
      pattern: 'striped',
    })
  }

  // Veg layer(s)
  const vegCount = ingredientIds.filter((id) =>
    ['broccoli', 'mushroom', 'carrot'].includes(id),
  ).length
  if (vegCount > 0) {
    ingredientIds
      .filter((id) => ['broccoli', 'mushroom', 'carrot'].includes(id))
      .forEach((vegId, i) => {
        layers.push({
          type: 'veg',
          color: getIngredientColor(vegId),
          shape: 'circle',
          width: 18 + scoreModifier * 6,
          height: 18 + scoreModifier * 6,
          x: (i - (vegCount - 1) / 2) * 28,
          y: -20 - (i % 2) * 12,
        })
      })
  }

  // Sauce layer
  const hasSauce = ingredientIds.some((id) => ['garlic', 'chili', 'herb'].includes(id))
  if (hasSauce) {
    const sauceId =
      ingredientIds.find((id) => ['garlic', 'chili', 'herb'].includes(id)) ?? ingredientIds[ingredientIds.length - 1]
    layers.push({
      type: 'sauce',
      color: getIngredientColor(sauceId),
      shape: 'ribbon',
      width: 80 + scoreModifier * 20,
      height: 10,
      x: 0,
      y: 14,
      opacity: 0.6,
    })
  }

  // Garnish
  layers.push({
    type: 'garnish',
    color: palette.garnish,
    shape: 'triangle',
    width: 8,
    height: 12,
    x: -40,
    y: -28,
  })
  layers.push({
    type: 'garnish',
    color: palette.garnish,
    shape: 'triangle',
    width: 8,
    height: 12,
    x: 40,
    y: -28,
  })

  // Extra elements for high score
  if (scoreModifier > 0.7) {
    layers.push({
      type: 'garnish',
      color: palette.accent,
      shape: 'circle',
      width: 6,
      height: 6,
      x: 0,
      y: -32,
      opacity: 0.8,
    })
    layers.push({
      type: 'side',
      color: palette.garnish,
      shape: 'circle',
      width: 10,
      height: 10,
      x: 60,
      y: -10,
      opacity: 0.5,
    })
  }

  return layers
}

function getMethodPalette(method: string) {
  return METHOD_PALETTES[method] ?? METHOD_PALETTES.stirFry
}

function getIngredientColor(ingredientId: string): string {
  const colorMap: Record<string, string> = {
    'pork-belly': '#E8967A',
    chicken: '#F5DEB3',
    fish: '#FFA07A',
    broccoli: '#2E7D32',
    mushroom: '#8D6E63',
    carrot: '#FF8C00',
    garlic: '#FFF8DC',
    chili: '#DC143C',
    herb: '#388E3C',
  }
  return colorMap[ingredientId] ?? '#C0C0C0'
}

/* ------------------------------------------------------------------ */
/*  AI Story Generation                                                */
/* ------------------------------------------------------------------ */

export function generateAIStory(
  result: CookingResult,
  ingredients: Ingredient[],
  method: string,
  flavorProfile: string,
): AIStory {
  const methodStories: Record<string, { narrative: string }> = {
    stirFry: {
      narrative:
        'I detected the bold energy in your ingredient choices and knew this called for the wok\'s kiss — each ingredient seared at peak heat to lock in personality while letting flavors collide in the sizzle zone.',
    },
    deepFry: {
      narrative:
        'Your selection whispered "crispy dreams" to my circuits. I submerged your ingredients in a golden bath at precisely 180°C, coaxing out textures that crunch like satisfaction itself.',
    },
    steam: {
      narrative:
        'Your ingredients spoke of purity and essence. I chose gentle steam — the most honest cooking method — to elevate your chosen elements without masking a single note.',
    },
    boil: {
      narrative:
        'The harmony in your basket called for unity. I brought everything together in a simmering dance, letting flavors merge into something greater than the sum of its parts.',
    },
    grill: {
      narrative:
        'Fire called to fire — your ingredients had untamed spirit. I marked them with flame, etching smoky stories into every surface so the first bite whispers "adventure."',
    },
    raw: {
      narrative:
        'Your choices were so pristine, I dared not interfere. The highest art is knowing when to do nothing — I present your ingredients in their truest form.',
    },
    simmer: {
      narrative:
        'Patience is a flavor too. I let time work its magic, transforming your ingredients through slow alchemy into a dish that rewards every moment of waiting.',
    },
    bake: {
      narrative:
        'Your basket deserved a golden transformation. I wrapped your ingredients in warmth and let the oven work its quiet magic — the Maillard reaction painting flavors you can taste with your eyes.',
    },
  }

  const fallback = {
    narrative:
      'I analyzed every ingredient you chose and crafted a dish that honors each one — the cooking method was selected to maximize harmony and surprise in equal measure.',
  }

  const story = methodStories[method] ?? fallback

  return {
    title: `Why I Created "${result.dishName}"`,
    narrative: story.narrative,
    signature: '— PIXEL, your AI Sous Chef',
  }
}

/* ------------------------------------------------------------------ */
/*  Flavor Decisions                                                   */
/* ------------------------------------------------------------------ */

export function generateFlavorDecisions(
  result: CookingResult,
  ingredients: Ingredient[],
  method: string,
  flavorProfile: string,
): FlavorDecision[] {
  const decisions: FlavorDecision[] = []

  // Method decision
  const methodNames: Record<string, string> = {
    stirFry: 'Stir-Fry',
    deepFry: 'Deep Fry',
    steam: 'Steam',
    boil: 'Boil',
    grill: 'Grill',
    raw: 'Raw Preparation',
    simmer: 'Simmer',
    bake: 'Bake',
  }

  const methodReasons: Record<string, string> = {
    stirFry: 'High heat unlocks bold flavors quickly',
    deepFry: 'Golden crispiness for maximum texture',
    steam: 'Preserves natural freshness and nutrients',
    boil: 'Gentle merging of flavors into harmony',
    grill: 'Smoky char adds depth and character',
    raw: 'Pure flavors need no transformation',
    simmer: 'Low and slow for rich, deep taste',
    bake: 'Even heat creates golden perfection',
  }

  decisions.push({
    icon: '🔬',
    title: `Method: ${methodNames[method] ?? method}`,
    description: methodReasons[method] ?? `Selected for optimal flavor extraction`,
    timing: 'Phase 1 — Strategy',
  })

  // Ingredient synergy
  const ingNames = ingredients.slice(0, 3).map((i) => i.name ?? i.id).join(' + ')
  const synergy: Record<string, string> = {
    spicy: 'Heat amplifies umami, creating addictive depth',
    rich: 'Fats carry flavor, coating every bite',
    fresh: 'Bright notes cleanse the palate between bites',
    sweet: 'Sweetness balances and rounds sharp edges',
    savory: 'Deep savory foundation anchors all flavors',
  }

  decisions.push({
    icon: '🧬',
    title: `Synergy: ${ingNames}`,
    description:
      synergy[flavorProfile] ??
      'Each ingredient complements the others for balanced taste',
    timing: 'Phase 2 — Analysis',
  })

  // Cooking score—based decision
  if (result.score.taste >= 80) {
    decisions.push({
      icon: '✨',
      title: 'Peak Flavor Point',
      description: 'Temperature and timing aligned perfectly — the Maillard zone was hit precisely',
      timing: 'Phase 3 — Execution',
    })
  } else if (result.score.taste >= 60) {
    decisions.push({
      icon: '👌',
      title: 'Solid Flavor Balance',
      description: 'Flavors are well-integrated with room for next-level refinement',
      timing: 'Phase 3 — Execution',
    })
  } else {
    decisions.push({
      icon: '🔧',
      title: 'Flavor Calibration',
      description: 'A learning experience — next time will be even better',
      timing: 'Phase 3 — Execution',
    })
  }

  // Creativity note
  if (result.score.creativity >= 80) {
    decisions.push({
      icon: '🎨',
      title: 'Creative Breakthrough',
      description: 'Unconventional combination that defies tradition in the best way',
      timing: 'Phase 4 — Evaluation',
    })
  } else if (result.score.creativity >= 60) {
    decisions.push({
      icon: '💡',
      title: 'Inspired Twist',
      description: 'A familiar pairing elevated with a subtle creative touch',
      timing: 'Phase 4 — Evaluation',
    })
  }

  // Nutrition note
  if (result.score.nutrition >= 80) {
    decisions.push({
      icon: '🥗',
      title: 'Nutritionally Optimized',
      description: 'Perfect balance of macros — delicious AND nourishing',
      timing: 'Phase 4 — Evaluation',
    })
  }

  return decisions
}

/* ------------------------------------------------------------------ */
/*  Smoke Animation Config                                             */
/* ------------------------------------------------------------------ */

export interface SmokeParticle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  drift: number
}

export function generateSmokeParticles(count: number): SmokeParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: -(Math.random() * 120 + 40),
    size: Math.random() * 60 + 20,
    opacity: Math.random() * 0.4 + 0.15,
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 80,
  }))
}

export interface PixelParticle {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
  distance: number
  duration: number
  delay: number
}

export function generatePixelParticles(count: number, colors: string[]): PixelParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 6 + 3,
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    distance: Math.random() * 120 + 60,
    duration: Math.random() * 1.5 + 0.8,
    delay: Math.random() * 0.5,
  }))
}
