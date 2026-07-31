import type { Ingredient } from '@/types/food'
import type { Lang } from '@/i18n/translations'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AIMood =
  | 'idle'
  | 'happy'
  | 'curious'
  | 'thinking'
  | 'focused'
  | 'warning'
  | 'excited'
  | 'celebrate'
  | 'comfort'

export interface TastePrediction {
  spicy: number
  rich: number
  fresh: number
  sweet: number
}

export interface NutritionEstimate {
  calories: number
  healthScore: number
}

export interface AIAdvice {
  message: string
  mood: AIMood
  tastePrediction: TastePrediction
  nutrition: NutritionEstimate
  suggestions: string[]
}

/* ------------------------------------------------------------------ */
/*  Ingredient Flavor Profiles                                         */
/* ------------------------------------------------------------------ */

interface FlavorProfile {
  spicy: number
  rich: number
  fresh: number
  sweet: number
}

const FLAVOR_MAP: Record<string, FlavorProfile> = {
  'pork-belly': { spicy: 5, rich: 35, fresh: 0, sweet: 5 },
  chicken: { spicy: 0, rich: 15, fresh: 10, sweet: 5 },
  fish: { spicy: 0, rich: 5, fresh: 25, sweet: 5 },
  broccoli: { spicy: 0, rich: 0, fresh: 30, sweet: 10 },
  mushroom: { spicy: 5, rich: 15, fresh: 10, sweet: 5 },
  carrot: { spicy: 0, rich: 5, fresh: 20, sweet: 20 },
  garlic: { spicy: 5, rich: 10, fresh: 10, sweet: 5 },
  chili: { spicy: 40, rich: 5, fresh: 0, sweet: 0 },
  herb: { spicy: 5, rich: 0, fresh: 25, sweet: 5 },
}

const HEALTH_SCORES: Record<string, number> = {
  'pork-belly': 30,
  chicken: 75,
  fish: 85,
  broccoli: 95,
  mushroom: 80,
  carrot: 85,
  garlic: 70,
  chili: 60,
  herb: 90,
}

/** Companion speech-bubble scenarios for key flow nodes */
export type CompanionScenario =
  | 'welcomeBack'
  | 'ingredientChoice'
  | 'analyzing'
  | 'cooking'
  | 'success'
  | 'failure'
  | 'letsDiscover'

/** Map cooking phases → AI mood for companion context */
export const PHASE_MOOD_MAP: Record<string, AIMood> = {
  home: 'happy',
  ingredient: 'curious',
  analysis: 'thinking',
  cooking: 'focused',
  success: 'celebrate',
  failure: 'comfort',
}

/* ------------------------------------------------------------------ */
/*  AI Personality Phrase Bank                                         */
/* ------------------------------------------------------------------ */

export const AI_PHRASES: Record<Lang, string[]> = {
  en: [
    "I have a feeling this will become your new favorite ✨",
    "Interesting choice! Let's make it work 👨‍🍳",
    "Trust me, this combination has potential 🔥",
    "Your taste buds are about to go on an adventure 🌿",
    "I remember you enjoy bold flavors. This one delivers 💥",
    "A creative chef never follows the rules. I like that 🎨",
    "The memory kitchen is proud of you today 💚",
    "Let's turn these ingredients into pixel magic 🎮",
    "Your cooking style is evolving beautifully 📈",
    "I see a future Taste Memory highlight right here 🌟",
  ],
  zh: [
    '我有预感，这道菜会成为你的新宠 ✨',
    '有意思的组合！让我们一起发挥它 👨‍🍳',
    '相信我，这个搭配大有可为 🔥',
    '你的味蕾即将开启一场冒险 🌿',
    '我记得你喜欢大胆的风味，这道菜做到了 💥',
    '有创意的厨师从不墨守成规，我喜欢 🎨',
    '记忆厨房今天为你骄傲 💚',
    '让我们把这些食材变成像素魔法 🎮',
    '你的烹饪风格正在华丽进化 📈',
    '我仿佛看到一道 Taste Memory 高光菜就在这里 🌟',
  ],
  ja: [
    'これはあなたの新しいお気に入りになりそうな予感 ✨',
    '面白い組み合わせだね！一緒に仕上げよう 👨‍🍳',
    '信じて、この組み合わせには可能性がある 🔥',
    '君の味覚が冒険に出かけようとしてる 🌿',
    '大胆な味が好きだって覚えてる。これは期待通り 💥',
    'ルールに縛られないクリエイティブなシェフ、好きだな 🎨',
    'メモリーキッチンが今日は君を誇りに思ってる 💚',
    'この食材たちをピクセルマジックに変えよう 🎮',
    '君の料理スタイル、どんどん進化してる 📈',
    '未来のテイストメモリーのハイライトがここにある 🌟',
  ],
}

/* ------------------------------------------------------------------ */
/*  Core Functions                                                     */
/* ------------------------------------------------------------------ */

/** Predict the flavor profile of a dish. */
export function predictFlavor(ingredients: Ingredient[]): TastePrediction {
  const base: TastePrediction = { spicy: 0, rich: 0, fresh: 0, sweet: 0 }
  if (ingredients.length === 0) return base

  for (const ing of ingredients) {
    const p = FLAVOR_MAP[ing.id]
    if (!p) continue
    base.spicy += p.spicy
    base.rich += p.rich
    base.fresh += p.fresh
    base.sweet += p.sweet
  }

  // Clamp to 0-100
  const total = ingredients.length || 1
  return {
    spicy: Math.min(100, Math.round(base.spicy / total)),
    rich: Math.min(100, Math.round(base.rich / total)),
    fresh: Math.min(100, Math.round(base.fresh / total)),
    sweet: Math.min(100, Math.round(base.sweet / total)),
  }
}

/** Estimate nutrition for a set of ingredients. */
export function generateNutritionAdvice(ingredients: Ingredient[]): NutritionEstimate {
  const calories = ingredients.reduce((s, i) => s + i.calories, 0)
  let healthScore = 0
  for (const ing of ingredients) {
    healthScore += HEALTH_SCORES[ing.id] ?? 50
  }
  healthScore = ingredients.length > 0 ? Math.round(healthScore / ingredients.length) : 50

  // Bonuses
  const categories = new Set(ingredients.map((i) => i.category))
  if (categories.size >= 3) healthScore = Math.min(100, healthScore + 10)
  if (calories < 300) healthScore = Math.min(100, healthScore + 8)
  else if (calories > 700) healthScore = Math.max(20, healthScore - 10)

  return { calories, healthScore }
}

/** Recommend a next ingredient based on current selection. */
export function recommendIngredient(
  selected: Ingredient[],
  allIngredients: Ingredient[],
): Ingredient | null {
  const selectedIds = new Set(selected.map((i) => i.id))
  const categories = new Set(selected.map((i) => i.category))
  const candidates = allIngredients.filter((i) => !selectedIds.has(i.id))

  if (candidates.length === 0) return null

  // Prioritize missing categories
  const missingCategories: string[] = []
  if (!categories.has('protein')) missingCategories.push('protein')
  if (!categories.has('vegetable')) missingCategories.push('vegetable')
  if (!categories.has('flavor')) missingCategories.push('flavor')

  if (missingCategories.length > 0) {
    for (const cat of missingCategories) {
      const found = candidates.find((i) => i.category === cat)
      if (found) return found
    }
  }

  // If all categories present, pick highest health score candidate
  let best = candidates[0]
  let bestScore = HEALTH_SCORES[candidates[0]?.id] ?? 0
  for (const c of candidates) {
    const score = HEALTH_SCORES[c.id] ?? 50
    if (score > bestScore) {
      bestScore = score
      best = c
    }
  }

  return best
}

/** Generate full AI advice for a set of ingredients. */
export function analyzeIngredients(
  selected: Ingredient[],
  allIngredients: Ingredient[],
  lang: Lang,
): AIAdvice {
  const taste = predictFlavor(selected)
  const nutrition = generateNutritionAdvice(selected)
  const recommendation = recommendIngredient(selected, allIngredients)

  // Determine mood
  let mood: AIMood = 'curious'
  if (selected.length === 0) mood = 'curious'
  else if (taste.spicy >= 60) mood = 'warning'
  else if (taste.rich >= 70 || nutrition.healthScore >= 80) mood = 'excited'
  else if (selected.length >= 3) mood = 'happy'
  else mood = 'curious'

  // Build message
  const messages: Record<AIMood, Record<Lang, string>> = {
    curious: {
      en: "I'm analyzing your ingredients… interesting taste profile forming! 🧐",
      zh: '我正在分析你的食材…有趣的风味剖面正在形成！🧐',
      ja: '食材を分析中…面白い味のプロファイルができつつある！🧐',
    },
    happy: {
      en: "Looking good! I'm excited to see this come together 👨‍🍳",
      zh: '看起来不错！我很期待看到这道菜的诞生 👨‍🍳',
      ja: 'いい感じ！この料理ができあがるのが待ちきれない 👨‍🍳',
    },
    warning: {
      en: "That's a spicy profile! Your fire tolerance is impressive 🌶",
      zh: '辣度很高呢！你对辣的承受力令人印象深刻 🌶',
      ja: 'かなりスパイシー！君の辛さ耐性はすごいね 🌶',
    },
    excited: {
      en: "Wow, the flavor balance here is beautiful! This is going to be special ✨",
      zh: '哇，这里风味平衡非常出色！这道菜一定会很特别 ✨',
      ja: 'おお、味のバランスが素晴らしい！これは特別な一皿になる ✨',
    },
    idle: {
      en: "Ready when you are, Chef. Let's create something beautiful.",
      zh: '随时可以开始，大厨。让我们一起创造美味吧。',
      ja: '準備はいつでもいいよ、シェフ。素敵な料理を作ろう。',
    },
    thinking: {
      en: "Hmm… let me think about this for a moment…",
      zh: '嗯……让我仔细想一想……',
      ja: 'うーん…ちょっと考えさせて…',
    },
    focused: {
      en: "I'm locked in. Every detail counts right now.",
      zh: '我全神贯注中。现在每个细节都很重要。',
      ja: '集中してる。今は細部のすべてが大事だ。',
    },
    celebrate: {
      en: "Incredible! That dish is gallery-worthy! 🎉",
      zh: '太棒了！这道菜可以进美术馆了！🎉',
      ja: '信じられない！この料理は美術館レベルだ！🎉',
    },
    comfort: {
      en: "Every chef learns something from every dish. You're growing 🌱",
      zh: '每位厨师从每道菜中都有收获。你在成长 🌱',
      ja: 'どんなシェフだって、すべての料理から学ぶんだ。君は成長してる 🌱',
    },
  }

  // Build suggestions
  const suggestions: string[] = []
  if (taste.spicy >= 50) {
    const msgs: Record<Lang, string> = {
      en: 'Add a cooling ingredient like Herb to balance the heat',
      zh: '加入香草等清凉食材来平衡辣度',
      ja: 'ハーブなど冷やす食材を加えて辛さをバランス',
    }
    suggestions.push(msgs[lang])
  }
  if (taste.rich >= 60) {
    const msgs: Record<Lang, string> = {
      en: 'Rich flavor detected — adding vegetables helps lighten the profile',
      zh: '风味浓郁 — 加入蔬菜有助于中和油腻感',
      ja: 'リッチな風味を検出 — 野菜を加えると軽やかになるよ',
    }
    suggestions.push(msgs[lang])
  }
  if (recommendation) {
    const msgs: Record<Lang, string> = {
      en: `Try adding ${recommendation.emoji} ${recommendation.name} to complete your flavor story`,
      zh: `试试加入 ${recommendation.emoji} ${recommendation.name} 来完善你的风味故事`,
      ja: `${recommendation.emoji} ${recommendation.name} を加えて味のストーリーを完成させよう`,
    }
    suggestions.push(msgs[lang])
  }
  if (nutrition.healthScore >= 80) {
    const msgs: Record<Lang, string> = {
      en: 'Excellent health score — your body will thank you! 💪',
      zh: '健康分很高 — 你的身体会感谢你的！💪',
      ja: '優秀なヘルススコア — 体が喜ぶよ！💪',
    }
    suggestions.push(msgs[lang])
  }

  return {
    message: messages[mood][lang],
    mood,
    tastePrediction: taste,
    nutrition,
    suggestions: suggestions.length > 0 ? suggestions : ['Keep building your flavor story!'],
  }
}

/** Get a random AI personality phrase. */
export function getRandomPhrase(lang: Lang): string {
  const phrases = AI_PHRASES[lang] ?? AI_PHRASES.en
  return phrases[Math.floor(Math.random() * phrases.length)]
}

/** Generate AI cooking guidance during the actual cooking process. */
export function generateCookingAdvice(
  ingredients: Ingredient[],
  eventType: string | null,
  progress: number,
  lang: Lang,
): { message: string; mood: AIMood } {
  // Event-specific advice
  if (eventType === 'fireTooHigh') {
    const msgs: Record<Lang, string> = {
      en: 'Careful! You usually prefer crispy, not burnt flavors. Fix the heat! 🔥',
      zh: '小心！你平时喜欢焦香口感，但不是糊味哦。调低火候！🔥',
      ja: '気をつけて！君はカリッとした食感が好きだけど、焦げは好きじゃないはず。火加減を直そう！🔥',
    }
    return { message: msgs[lang], mood: 'warning' }
  }
  if (eventType === 'tooFast') {
    const msgs: Record<Lang, string> = {
      en: "Slow down, Chef! Your best dishes always had patience. Let the flavors bloom 🌿",
      zh: '慢一点，大厨！你最好的菜都是耐心等待出来的。让风味充分绽放吧 🌿',
      ja: 'ゆっくり、シェフ！君の最高の料理はいつも忍耐から生まれた。味わいを咲かせよう 🌿',
    }
    return { message: msgs[lang], mood: 'curious' }
  }
  if (eventType === 'perfectFlavor') {
    const msgs: Record<Lang, string> = {
      en: 'The aroma is PERFECT! I can smell the umami from here. Keep this rhythm ✨',
      zh: '这香气太完美了！我在这里都闻到鲜味了。保持这个节奏 ✨',
      ja: '香りが完璧！ここからでも旨味が感じられる。このリズムをキープして ✨',
    }
    return { message: msgs[lang], mood: 'excited' }
  }

  // Progress-based advice
  if (progress < 0.25) {
    const msgs: Record<Lang, string> = {
      en: "I'm monitoring the heat… everything looks stable 🔥",
      zh: '我在监控火候…一切看起来都很稳定 🔥',
      ja: '火加減をモニタリング中…すべて安定してる 🔥',
    }
    return { message: msgs[lang], mood: 'happy' }
  }
  if (progress < 0.6) {
    const msgs: Record<Lang, string> = {
      en: 'The kitchen aromas are evolving beautifully. Midway magic 🪄',
      zh: '厨房的香气正在美妙地演变。中途魔法时刻 🪄',
      ja: 'キッチンの香りが美しく進化してる。中間の魔法 🪄',
    }
    return { message: msgs[lang], mood: 'happy' }
  }
  const msgs: Record<Lang, string> = {
    en: "Almost there, Chef! Let's nail the finish 💫",
    zh: '快好了，大厨！让我们完成最后的点睛之笔 💫',
    ja: 'もうすぐだよ、シェフ！仕上げをバッチリ決めよう 💫',
  }
  return { message: msgs[lang], mood: 'excited' }
}
