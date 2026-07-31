/** A snapshot of PIXEL's understanding of the chef's taste identity. */
export interface TasteMemory {
  personality: string
  traits: string[]
  favoriteIngredients: string[]
  healthScore: number
  history: string[]
  suggestion: string
}

/** Output payload from the personality engine. */
export interface PersonalityReport {
  personality: string
  traits: string[]
  memory: string
  suggestion: {
    dish: string
    reason: string
  }
  favoriteIngredients: string[]
  healthScore: number
}
