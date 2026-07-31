export type IngredientCategory = 'protein' | 'vegetable' | 'flavor'

export interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
  emoji: string
  calories: number
  tasteTags: string[]
}

/** Everything stocked in the pixel fridge. */
export const INGREDIENTS: Ingredient[] = [
  // Protein
  { id: 'pork-belly', name: 'Pork Belly', category: 'protein', emoji: '🥓', calories: 520, tasteTags: ['crispy', 'rich', 'fire'] },
  { id: 'chicken', name: 'Chicken', category: 'protein', emoji: '🍗', calories: 240, tasteTags: ['savory', 'tender', 'light'] },
  { id: 'fish', name: 'Fish', category: 'protein', emoji: '🐟', calories: 200, tasteTags: ['fresh', 'delicate', 'light'] },
  // Vegetable
  { id: 'broccoli', name: 'Broccoli', category: 'vegetable', emoji: '🥦', calories: 55, tasteTags: ['green', 'crunchy', 'healthy'] },
  { id: 'mushroom', name: 'Mushroom', category: 'vegetable', emoji: '🍄', calories: 30, tasteTags: ['umami', 'earthy', 'soft'] },
  { id: 'carrot', name: 'Carrot', category: 'vegetable', emoji: '🥕', calories: 40, tasteTags: ['sweet', 'crunchy', 'healthy'] },
  // Flavor
  { id: 'garlic', name: 'Garlic', category: 'flavor', emoji: '🧄', calories: 10, tasteTags: ['aromatic', 'bold', 'warm'] },
  { id: 'chili', name: 'Chili', category: 'flavor', emoji: '🌶️', calories: 5, tasteTags: ['spicy', 'fire', 'bold'] },
  { id: 'herb', name: 'Herb', category: 'flavor', emoji: '🌿', calories: 2, tasteTags: ['fresh', 'aromatic', 'light'] },
]

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  protein: 'PROTEIN',
  vegetable: 'VEGETABLE',
  flavor: 'FLAVOR',
}
