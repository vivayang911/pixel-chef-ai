import type { Ingredient } from '@/types/food'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DishType = 'bowl' | 'plate' | 'pan' | 'soup'
export type IngVisualShape = 'chunk' | 'slice' | 'dot' | 'leaf' | 'floret' | 'cap' | 'coin' | 'strip'
export type DishQuality = 'normal' | 'excellent' | 'masterpiece'
export type GarnishType = 'herb' | 'sesame' | 'chili-flake' | 'sauce-drip'

export interface IngVisual {
  shape: IngVisualShape
  color: string
  secondary?: string
}

export interface PlacedIngredient {
  x: number
  y: number
  w: number
  h: number
  visual: IngVisual
  rotate?: number
}

export interface GarnishElement {
  type: GarnishType
  x: number
  y: number
  color: string
}

export interface DishVisualConfig {
  dishType: DishType
  mainColor: string
  accentColor: string
  baseColor: string
  placedIngredients: PlacedIngredient[]
  garnish: GarnishElement[]
  steam: boolean
  sparkle: boolean
  quality: DishQuality
  containerLabel: string
}

/* ------------------------------------------------------------------ */
/*  Ingredient → Visual map                                            */
/* ------------------------------------------------------------------ */

const ING_VISUAL_MAP: Record<string, IngVisual> = {
  'pork-belly': { shape: 'chunk', color: '#c0843e', secondary: '#e0a85c' },
  'chicken': { shape: 'chunk', color: '#d4a574', secondary: '#e8c9a0' },
  'fish': { shape: 'slice', color: '#f4845f', secondary: '#ffa683' },
  'broccoli': { shape: 'floret', color: '#4d8c36', secondary: '#6db347' },
  'mushroom': { shape: 'cap', color: '#8b7355', secondary: '#a08b6b' },
  'carrot': { shape: 'coin', color: '#f48400', secondary: '#ffa040' },
  'garlic': { shape: 'dot', color: '#f5f0e8', secondary: '#e8dcc8' },
  'chili': { shape: 'strip', color: '#cc2222', secondary: '#ee4444' },
  'herb': { shape: 'leaf', color: '#3d8c40', secondary: '#5aaa58' },
}

/* ------------------------------------------------------------------ */
/*  Dish type → container                                              */
/* ------------------------------------------------------------------ */

function determineDishType(ingredients: Ingredient[]): DishType {
  const cats = ingredients.map((i) => i.category)
  const hasProtein = cats.includes('protein')
  const hasVeg = cats.includes('vegetable')
  const hasFlavor = cats.includes('flavor')
  const allThree = hasProtein && hasVeg && hasFlavor

  if (allThree && ingredients.length >= 3) return 'pan'   // stir-fry
  if (hasProtein && !hasVeg) return 'plate'               // meat dish
  if (!hasProtein && hasVeg) return 'soup'                // veg soup
  if (hasProtein && hasVeg) return 'bowl'                 // rice bowl
  return 'plate'
}

/* ------------------------------------------------------------------ */
/*  Main / accent colour                                               */
/* ------------------------------------------------------------------ */

function deriveColors(ingredients: Ingredient[]): { main: string; accent: string; base: string } {
  const first = ING_VISUAL_MAP[ingredients[0]?.id]
  const main = first?.color ?? '#c0843e'
  const accent = first?.secondary ?? '#e0a85c'

  // Base colour depends on dish "theme"
  const greenCount = ingredients.filter((i) => i.tasteTags.includes('green') || i.tasteTags.includes('healthy')).length
  const boldCount = ingredients.filter((i) => i.tasteTags.includes('fire') || i.tasteTags.includes('spicy')).length

  const base =
    greenCount >= 2 ? '#e8f0e4'
    : boldCount >= 2 ? '#f5e6d3'
    : '#faf3e8'

  return { main, accent, base }
}

/* ------------------------------------------------------------------ */
/*  Position planner                                                   */
/* ------------------------------------------------------------------ */

interface LayoutSlot { x: number; y: number; w: number; h: number }

function placeIngredients(ingredients: Ingredient[], dishType: DishType): PlacedIngredient[] {
  const placed: PlacedIngredient[] = []

  // Layout slots depend on dish type
  let slots: LayoutSlot[] = []

  if (dishType === 'pan') {
    // Stir-fry: scattered arrangement in center area
    slots = [
      { x: 55, y: 44, w: 36, h: 24 },
      { x: 50, y: 54, w: 30, h: 18 },
      { x: 70, y: 42, w: 28, h: 20 },
      { x: 45, y: 50, w: 24, h: 16 },
      { x: 65, y: 56, w: 20, h: 14 },
    ]
  } else if (dishType === 'bowl') {
    // Bowl: layered from bottom up
    slots = [
      { x: 45, y: 56, w: 40, h: 14 },
      { x: 42, y: 46, w: 36, h: 16 },
      { x: 48, y: 38, w: 30, h: 14 },
      { x: 44, y: 50, w: 32, h: 12 },
      { x: 50, y: 42, w: 28, h: 12 },
    ]
  } else if (dishType === 'plate') {
    // Plate: arranged around center
    slots = [
      { x: 56, y: 48, w: 30, h: 20 },
      { x: 46, y: 46, w: 22, h: 14 },
      { x: 64, y: 44, w: 20, h: 14 },
      { x: 50, y: 54, w: 18, h: 12 },
      { x: 62, y: 56, w: 16, h: 12 },
    ]
  } else {
    // Soup: floating in liquid
    slots = [
      { x: 48, y: 46, w: 28, h: 18 },
      { x: 58, y: 48, w: 22, h: 14 },
      { x: 42, y: 52, w: 20, h: 12 },
      { x: 62, y: 54, w: 18, h: 10 },
      { x: 52, y: 56, w: 16, h: 10 },
    ]
  }

  // Proteins first (larger), then vegetables, then flavor (small accents)
  const sorted = [...ingredients].sort((a, b) => {
    const order: Record<string, number> = { protein: 0, vegetable: 1, flavor: 2 }
    return (order[a.category] ?? 1) - (order[b.category] ?? 1)
  })

  for (let i = 0; i < sorted.length && i < slots.length; i++) {
    const ing = sorted[i]
    const visual = ING_VISUAL_MAP[ing.id] ?? { shape: 'chunk' as const, color: '#999' }
    const slot = slots[i]

    placed.push({
      x: slot.x,
      y: slot.y,
      w: slot.w,
      h: slot.h,
      visual,
      rotate: dishType === 'pan' ? (i % 2 === 0 ? -8 : 8) : undefined,
    })
  }

  return placed
}

/* ------------------------------------------------------------------ */
/*  Garnish planner                                                    */
/* ------------------------------------------------------------------ */

function planGarnish(ingredients: Ingredient[], dishType: DishType): GarnishElement[] {
  const garnish: GarnishElement[] = []

  for (const ing of ingredients) {
    if (ing.id === 'herb') {
      garnish.push(
        { type: 'herb', x: 42, y: 38, color: '#3d8c40' },
        { type: 'herb', x: 72, y: 40, color: '#5aaa58' },
        { type: 'herb', x: 80, y: 50, color: '#3d8c40' },
      )
    }
    if (ing.id === 'garlic') {
      for (let i = 0; i < 4; i++) {
        garnish.push({
          type: 'sesame',
          x: 46 + Math.random() * 28,
          y: 38 + Math.random() * 22,
          color: '#f5f0e8',
        })
      }
    }
    if (ing.id === 'chili') {
      for (let i = 0; i < 3; i++) {
        garnish.push({
          type: 'chili-flake',
          x: 50 + Math.random() * 24,
          y: 40 + Math.random() * 20,
          color: '#cc2222',
        })
      }
    }
  }

  // Limit garnish for non-pan dishes
  if (dishType !== 'pan' && garnish.length > 4) {
    return garnish.slice(0, 4)
  }

  return garnish
}

/* ------------------------------------------------------------------ */
/*  Quality from score                                                 */
/* ------------------------------------------------------------------ */

function scoreToQuality(score: number): DishQuality {
  if (score >= 80) return 'masterpiece'
  if (score >= 50) return 'excellent'
  return 'normal'
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function generateDishVisual(
  ingredients: Ingredient[],
  score: number,
): DishVisualConfig {
  const dishType = determineDishType(ingredients)
  const { main, accent, base } = deriveColors(ingredients)
  const placedIngredients = placeIngredients(ingredients, dishType)
  const garnish = planGarnish(ingredients, dishType)
  const quality = scoreToQuality(score)

  const steam = ingredients.some(
    (i) => i.tasteTags.includes('fire') || i.tasteTags.includes('warm') || i.category === 'protein',
  )
  const sparkle = quality === 'masterpiece'

  const containerLabel =
    dishType === 'pan' ? 'STIR-FRY PAN'
    : dishType === 'bowl' ? 'RICE BOWL'
    : dishType === 'soup' ? 'SOUP POT'
    : 'CHEF\'S PLATE'

  return {
    dishType,
    mainColor: main,
    accentColor: accent,
    baseColor: base,
    placedIngredients,
    garnish,
    steam,
    sparkle,
    quality,
    containerLabel,
  }
}

/**
 * Generate an AI-style dish review based on score and ingredients.
 */
export function generateDishReview(
  dishName: string,
  score: number,
  ingredients: Ingredient[],
): string {
  const quality = scoreToQuality(score)
  const tags = ingredients.flatMap((i) => i.tasteTags)
  const hasSpicy = tags.includes('spicy') || tags.includes('fire')
  const hasFresh = tags.includes('fresh') || tags.includes('green') || tags.includes('healthy')
  const hasCrispy = tags.includes('crispy')
  const hasUmami = tags.includes('umami') || tags.includes('savory')
  const hasAromatic = tags.includes('aromatic') || tags.includes('warm')

  if (quality === 'masterpiece') {
    if (hasCrispy) return `Your ${dishName} is a textural triumph — every bite sings with crisp perfection.`
    if (hasUmami) return `The depth of umami in your ${dishName} is remarkable. This is museum-quality cooking.`
    return `"${dishName}" is your signature masterpiece. Every element is in perfect harmony.`
  }

  if (quality === 'excellent') {
    if (hasSpicy) return `The heat in your ${dishName} warms the soul. Bold and well-balanced!`
    if (hasAromatic) return `Your ${dishName} fills the kitchen with beautiful aromas. A wonderful creation.`
    if (hasFresh) return `Fresh, vibrant, and clean — your ${dishName} is a celebration of ingredients.`
    return `Your ${dishName} shows real skill. The flavors are well-balanced and satisfying.`
  }

  // normal
  const hints: string[] = []
  if (!hasSpicy && ingredients.some((i) => i.category === 'flavor'))
    hints.push('Next time, try adding a bolder flavor element.')
  if (!hasFresh)
    hints.push('I would add a touch of freshness to brighten the dish.')
  if (hints.length > 0) return `${hints.join(' ')} Every chef learns with each dish!`
  return `Your ${dishName} has a solid foundation. Keep experimenting — great things are coming!`
}
