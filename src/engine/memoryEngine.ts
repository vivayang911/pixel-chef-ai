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
  '我是 PIXEL，你的 AI 厨房伙伴。从冰箱里选几样食材，我会根据你的口味记忆和健康目标给出建议 🍳'

/** Long-term taste memory: what PIXEL "remembers" per ingredient. */
const MEMORY_LINES: Record<string, string> = {
  'pork-belly': '我记得你喜欢焦香口感🔥 每次五花肉你都要煎到边缘微焦',
  chicken: '鸡胸肉很符合你最近的健康目标💪 上次你还加了双份大蒜',
  fish: '鱼肉是你的清爽之选🐟 配一点香草会更鲜',
  broccoli: '好选择！你最近的餐盘里绿色越来越多了🥦',
  mushroom: '蘑菇的鲜味能替代一部分油脂，很聪明的搭配🍄',
  carrot: '胡萝卜的天然甜味可以平衡辣味🥕 你上次就这么做过',
  garlic: '蒜香是你的老朋友了🧄 几乎每道菜都有它',
  chili: '你的辣度偏好正在增强🌶 我记下了',
  herb: '一点香草，层次感立刻提升🌿 这是你跟星级厨师学的',
}

/** Combo memories take priority over single-ingredient lines. */
const COMBO_RULES: { has: string[]; message: string }[] = [
  {
    has: ['pork-belly', 'broccoli', 'mushroom'],
    message: '完美！西兰花和蘑菇平衡了五花肉的油脂✨ 这正是你的健康目标',
  },
  {
    has: ['pork-belly', 'broccoli'],
    message: '西兰花上场！五花肉的油腻被拉回平衡🥦 我记得你说过要吃得清爽些',
  },
  {
    has: ['chili', 'garlic'],
    message: '蒜+辣椒，是你最爱的爆香开局🌶 记得开抽油烟机',
  },
  {
    has: ['fish', 'herb'],
    message: '鱼肉配香草，清淡又高级🐟🌿 你的味蕾正在升级',
  },
  {
    has: ['chicken', 'broccoli'],
    message: '鸡胸肉+西兰花，标准的健身餐💪 加点蘑菇会更鲜',
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
    return `当前热量约 ${totalCal} kcal ⚠️ 但是最近你的目标是健康饮食，建议加入西兰花和蘑菇来平衡`
  }
  if (hasProtein && hasVeg && hasFlavor) {
    return `约 ${totalCal} kcal ✅ 蛋白质/蔬菜/风味俱全，这是一道完整又均衡的料理`
  }
  if (hasProtein && !hasVeg) {
    return `约 ${totalCal} kcal · 但是最近你的目标是健康饮食，建议加入西兰花和蘑菇`
  }
  if (!hasProtein) {
    return `约 ${totalCal} kcal · 还差一份蛋白质，这道菜才算完整`
  }
  return `约 ${totalCal} kcal · 搭配得不错，继续吧`
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
      nutritionAdvice: '选满 3 样食材（含 1 份蛋白质）就可以开火啦',
    }
  }

  const ids = ingredients.map((i) => i.id)
  const combo = COMBO_RULES.find((rule) => rule.has.every((id) => ids.includes(id)))
  const last = ingredients[ingredients.length - 1]
  const message = combo?.message ?? MEMORY_LINES[last.id] ?? '不错的选择！我记下了。'

  return {
    message,
    tasteProfile: deriveProfile(ingredients),
    nutritionAdvice: deriveNutritionAdvice(ingredients),
  }
}
