# Pixel Chef AI — AI Development Context Handoff

> **Last Updated:** 2026-08-01  
> **GitHub:** https://github.com/vivayang911/pixel-chef-ai  
> **Live Demo:** https://pixel-chef-ai.vercel.app  

---

## 0. Quick Start for Next AI Session

```
你现在接手 Pixel Chef AI 项目。
1. 请先完整阅读本文件 (docs/AI_CONTEXT.md)
2. 检查 git status 了解是否有未提交修改
3. 运行 npm run build 确认项目可正常构建
4. 阅读 README.md 了解项目对外展示定位
5. 如有需要，运行 npm run dev 启动开发服务器预览
```

---

## 1. 项目概况

| 属性 | 值 |
|---|---|
| **项目名称** | Pixel Chef AI |
| **项目定位** | AI 记忆厨房 — 会记住你口味的烹饪伙伴 |
| **核心口号** | "A Memory Kitchen That Learns Your Taste" |
| **比赛** | DEV Frontend Challenge: Comfort Food Edition |
| **版本** | v1.0.0 |
| **许可证** | MIT |
| **仓库** | `git@github.com:vivayang911/pixel-chef-ai.git` (SSH) |
| **在线演示** | https://pixel-chef-ai.vercel.app |
| **当前完成度** | 核心功能 100%，截图 100%，待 DEV 文章发布 |

### 产品理念

- **不是菜谱生成器** — 是"记忆驱动的厨房伙伴"
- AI 记住你的食材选择、口味偏好、营养目标、烹饪行为
- 每次交互都是学习经验
- 面向未来智能冰箱的 Demo 原型

### 当前阶段

所有 5 个页面功能完整、截图已准备好、README 为比赛展示风格。等待发布 DEV 文章。

---

## 2. 技术架构

### 2.1 核心依赖

| 包 | 版本 | 用途 |
|---|---|---|
| `react` | 18.3.1 | UI 框架 |
| `react-dom` | 18.3.1 | DOM 渲染 |
| `framer-motion` | 11.11.17 | 全部动画：页面过渡、组件进出、粒子、发光 |
| `react/jsx-runtime` | - | JSX 转换 |

### 2.2 构建与工具链

| 工具 | 版本 | 说明 |
|---|---|---|
| `vite` | 5.4.11 | 构建工具 |
| `@vitejs/plugin-react` | 4.3.4 | React Fast Refresh |
| `typescript` | 5.6.3 | 严格模式全开 |
| `tailwindcss` | 3.4.15 | CSS 框架 |
| `postcss` | 8.4.49 | CSS 处理 |
| `autoprefixer` | 10.4.20 | 浏览器前缀 |
| `playwright` | 1.62.1 | E2E 测试 + 截图脚本 |

### 2.3 TypeScript 配置

- `target: ES2020`, `module: ESNext`
- `jsx: react-jsx`, `strict: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- 路径别名: `@/*` → `./src/*`

### 2.4 Vite 配置

- 插件: `@vitejs/plugin-react`
- 路径别名: `@` → `./src`
- 输出目录: `dist/`
- `vercel.json` 处理 SPA 路由

### 2.5 Tailwind 自定义主题

**颜色系统** (像素风格调色板):
- `ink`: `#0d0b1f` (default) / `#15122b` (soft) / `#1d1838` (panel) / `#2c2550` (line)
- `tomato`: `#ff5277` (红色 — 警告、热量)
- `cheese`: `#ffcb3b` (黄色 — 评分、高亮)
- `mint`: `#5be7a9` (绿色 — 健康、成功)
- `sky`: `#4cc9f0` (蓝色 — AI、信息)
- `grape`: `#b388ff` (紫色 — 记忆、创意)
- `cream`: `#fdf6e3` (文字主色)

**字体**:
- `font-pixel`: "Press Start 2P" — 标题、按钮、Logo
- `font-terminal`: "VT323" — 数据、标签、时间
- `font-sans`: "Inter" — 正文

**自定义 CSS 效果**:
- `bg-grid-pixel`: 紫色像素网格背景
- `bg-scanlines`: CRT 扫描线覆盖
- `shadow-pixel-sm/lg`: 8-bit 硬偏移阴影
- `shadow-glow-tomato/cheese`: 发光效果

### 2.6 状态管理

- **纯 React 状态**: `App.tsx` 中 `useState` 管理全局状态 (route, dish, cookingResult, cookingMethod, demoMode 等)
- **Context**: `AICompanionContext` 管理 PIXEL AI 伙伴的 mood、message、messageVisible
- **localStorage**: 仅存储教程完成标志 (`tutorial_dismissed`)
- **无外部状态库**: 无 Redux、Zustand 等

### 2.7 路由方案

- **自研 SPA 路由**: `App.tsx` 中 `route` 状态驱动 5 个页面条件渲染
- **Hash 路由支持**: `window.location.hash` 监听 (`#home`, `#studio`, `#story`, `#result`, `#memory`) — 用于 Playwright 截图和深度链接
- **Route 类型**: `type Route = 'home' | 'studio' | 'story' | 'result' | 'memory'`

---

## 3. 项目目录结构

```
pixel-chef-ai/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── index.html
├── docs/
│   ├── screenshots/
│   │   ├── hero.png          (1280×720, 669KB)
│   │   ├── home.png          (1280×720, 823KB)
│   │   ├── studio.png        (1280×720, 648KB)
│   │   ├── cooking.png       (1280×720, 688KB)
│   │   ├── result.png        (1280×720, 754KB)
│   │   └── memory.png        (1280×720, 702KB)
│   └── architecture.md
├── scripts/
│   └── snap_final.mjs        # Playwright 自动截图脚本
├── dist/                     # 构建产物
└── src/
    ├── main.tsx              # 入口 (StrictMode + ErrorBoundary)
    ├── App.tsx               # 主组件 (路由 + 全局状态)
    ├── index.css             # Tailwind + 像素主题
    ├── vite-env.d.ts
    ├── engine/
    │   ├── aiChefEngine.ts           # AI 风味分析 (15KB)
    │   ├── aiCompanionContext.tsx     # AI 伙伴全局上下文
    │   ├── cookingEngine.ts           # 烹饪模拟引擎 (6KB)
    │   ├── memoryEngine.ts            # 记忆/口味学习 (4KB)
    │   ├── personalityEngine.ts       # 性格分析 (7.5KB)
    │   ├── dishImageEngine.ts         # 菜品像素可视化 (15KB)
    │   └── audioEngine.ts             # 音频占位符
    ├── types/
    │   ├── food.ts                    # 食材类型 + 9种食材数据
    │   └── memory.ts                  # 记忆/性格报告类型
    ├── i18n/
    │   ├── translations.ts            # en/zh/ja 翻译 (30.5KB)
    │   └── LanguageContext.tsx        # 语言上下文 + useLanguage() hook
    ├── pages/
    │   ├── CreateDish.tsx             # 食材选择页 (11KB)
    │   ├── CookingStory.tsx           # 烹饪过程页 (21KB)
    │   └── TasteMemory.tsx            # 口味记忆页 (5.5KB)
    ├── components/
    │   ├── ai/
    │   │   ├── AIAnalysisPanel.tsx    # AI 分析面板 (10.5KB)
    │   │   ├── AIAssistantBadge.tsx
    │   │   ├── AIChefCompanion.tsx    # AI 伙伴浮动组件 (13KB)
    │   │   ├── FlavorDNA.tsx          # 15维风味雷达图
    │   │   └── TypingText.tsx         # 打字机效果
    │   ├── common/
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── OnboardingTutorial.tsx
    │   │   ├── PageTransition.tsx
    │   │   └── PixelLoader.tsx
    │   ├── cooking/
    │   │   ├── AIAdvisor.tsx
    │   │   ├── CookingMethodSelector.tsx  # 6种烹饪方式选择器
    │   │   ├── CookingPot.tsx
    │   │   ├── IngredientShelf.tsx
    │   │   ├── PixelIngredient.tsx
    │   │   ├── TasteMemoryCard.tsx
    │   │   ├── result/
    │   │   │   └── PixelDishArtwork.tsx    # 像素菜品画布 (17KB)
    │   │   └── story/
    │   │       ├── CookingEvent.tsx
    │   │       ├── CookingTimeline.tsx
    │   │       ├── CookingTimer.tsx
    │   │       ├── FireEffect.tsx
    │   │       ├── PixelChefAnimation.tsx
    │   │       └── ResultPreview.tsx       # 最大组件 (30KB)
    │   ├── demo/
    │   │   └── DemoMode.tsx               # 6步演示控制器 (19KB)
    │   ├── kitchen/
    │   │   ├── MemoryKitchen.tsx           # 首页厨房 (9KB)
    │   │   ├── PixelFood.tsx
    │   │   ├── PixelFridge.tsx            # 像素冰箱 (5KB)
    │   │   └── SpeechBubble.tsx
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   ├── memory/
    │   │   ├── AIReflection.tsx
    │   │   ├── DishMemoryCard.tsx         # (9KB)
    │   │   ├── FutureSuggestion.tsx
    │   │   ├── MemoryTimeline.tsx         # (6KB)
    │   │   └── TasteDNA.tsx
    │   └── ui/
    │       ├── Container.tsx
    │       ├── PixelButton.tsx
    │       ├── PixelChef.tsx
    │       └── PixelPanel.tsx
    └── styles/
        └── theme.css                      # CSS 动画 + 设计令牌 (3.8KB)
```

---

## 4. 当前功能完成情况（按页面）

### 4.1 Memory Kitchen 首页 (`MemoryKitchen.tsx`)

**路由**: `home`

**已完成组件**:
- `MemoryKitchen` — 主页面容器，带 AI 伙伴欢迎语
- `PixelFridge` — 像素冰箱 SVG，开/关门动画，食材预览气泡
- `SpeechBubble` — AI 对话气泡，带打字机效果
- `PixelChef` — 像素 AI 厨师角色（眨眼动画）
- `DemoMode` — 6 步自动演示模式（通过浮动按钮触发）

**动画**: fridge 打开/关闭、食材气泡浮出、厨师眨眼、欢迎语打字机效果

**AI 逻辑**: `aiCompanionContext` 设置初始 mood + 欢迎消息

**当前状态**: ✅ 完成

### 4.2 CreateDish 食材选择 (`CreateDish.tsx`)

**路由**: `studio`

**食材系统**: 9 种食材 (protein × 3, vegetable × 3, flavor × 3)，每种有 emoji、卡路里、tasteTags

**AI 分析**:
- `AIAnalysisPanel` — 食材组合分析弹窗
- `FlavorDNA` — 15 维 SVG 雷达图
- `CookingPot` — 像素锅动画（食材飞入）
- `TasteMemoryCard` — 历史记忆卡片

**推荐机制**: `recommendIngredient()` 智能推荐下一食材

**Cooking Method Selector**: 食材选定后 → 弹出 `CookingMethodSelector` → 6 种方式（stir-fry, steam, boil, deep-fry, roast, simmer） → 选择后进入烹饪

**数据流**: `CreateDish` → `App.onStartCooking(dish, method)` → 设置 `dish` + `cookingMethod` → 导航到 `story`

**当前状态**: ✅ 完成

### 4.3 CookingStory 烹饪模拟 (`CookingStory.tsx`)

**路由**: `story`

**烹饪流程**:
1. 食材入锅动画 → 开始烹饪
2. `CookingTimer` 倒计时（推荐时间由食材计算）
3. 随机 3 个烹饪事件在时间轴上触发
4. `AUTO COOK WITH AI` 按钮 — AI 自动调控火候和时间
5. 烹饪结束 → `computeCookingResult()` → `onFinish(result)`

**组件**: `PixelChefAnimation` (厨师动画), `CookingTimeline` (事件时间轴), `CookingEvent` (事件卡片), `FireEffect` (火焰粒子), `TypingText` (AI 实时建议)

**AI Chef 模式**: `autoCook` prop 时自动触发 AI 烹饪，模拟完美的烹饪时机

**Score 计算**: 时间精准度 + 食材多样性 + 三大类别齐全 + 事件响应 = 最终评分 (0-100)

**当前状态**: ✅ 完成

### 4.4 ResultPreview 成品展示 (`ResultPreview.tsx`)

**路由**: `result`

**已完成功能**:
- `PixelDishArtwork` — 像素菜品画布（根据食材/方法/分数生成多层像素图层）
- 评分动画 (taste/creativity/nutrition 三个维度展开)
- AI Chef Story — AI 叙事（每种烹饪方法有独特故事线）
- Flavor Decision Panel — AI 决策日志（方法选择 → 食材协同 → 执行评估）
- 烟雾粒子 + 像素粒子特效
- 保存到 Memory / Retry / 返回 Home

**关键组件**: `AIStorySection`, `FlavorDecisionCard`

**已知不足**: 没有实际的 AI API 调用，所有叙事和决策是确定性的伪随机生成

**当前状态**: ✅ 完成

### 4.5 TasteMemory 口味记忆 (`TasteMemory.tsx`)

**路由**: `memory`

**已有区域**:
- `TasteDNA` — 口味 DNA 可视化
- `AIReflection` — AI 反思日志（基于 `personalityEngine.buildReflection()`）
- `MemoryTimeline` — 烹饪历史时间轴
- `DishMemoryCard` — 菜品记忆卡
- `FutureSuggestion` — 未来推荐（基于当前口味画像）
- `PersonalityReport` — 5 种厨师原型（Fire Chef, Healthy Creator, Flavor Explorer, Comfort Cook, Kitchen Scientist）

**当前状态**: ✅ 完成

---

## 5. AI 系统设计（6 个引擎）

### 5.1 `aiChefEngine.ts` — AI 风味分析引擎

**大小**: 15KB  
**职责**: 实时分析食材组合，预测风味、估算营养、推荐食材

**核心功能**:
- `predictFlavor(ingredients)` — 基于 `FLAVOR_MAP`（9 种食材的风味档案）计算平均风味剖面
- `generateNutritionAdvice(ingredients)` — 基于 `HEALTH_SCORES` 估算卡路里和健康分
- `recommendIngredient(selected, all)` — 智能推荐（优先缺失类别 → 最高健康分）
- `analyzeIngredients(...)` — 综合分析入口，返回 `AIAdvice`
- `generateCookingAdvice(...)` — 烹饪中的实时建议
- `getRandomPhrase(lang)` — 10 条 AI 个性短语库

**AI 情绪系统**: 9 种 mood (`idle`, `happy`, `curious`, `thinking`, `focused`, `warning`, `excited`, `celebrate`, `comfort`)，烹饪阶段 → 情绪映射

**扩展方向**: 可接入真实 LLM API 替换确定性逻辑

### 5.2 `cookingEngine.ts` — 烹饪模拟引擎

**大小**: 6KB  
**职责**: 模拟烹饪过程，计算结果分数

**核心函数**:
- `scheduleEvents(recommended)` — 在推荐时间内随机安排 3 个事件
- `getRecommendedTime(ingredients)` — 基础 12s + 蛋白质加成
- `nameDish(ingredients)` — 自动菜名生成（如 "Stir-fried Pork Belly with Broccoli"）
- `computeCookingResult(ingredients, userTime, recommended, eventIds, lang)` — 评分计算

**评分算法**: 时间比率 (0.85-1.15 区间 +15) + 多样性 + 类别齐全 (+28 营养) + 事件影响 → 三围 22-100

**3 种事件类型**: `fireTooHigh`, `tooFast`, `perfectFlavor`

### 5.3 `memoryEngine.ts` — 记忆引擎

**大小**: 4KB  
**职责**: 生成口味反馈和画像

**核心逻辑**:
- 19 种 `tasteTag` → 可读标签
- `deriveProfile(ingredients)` → 4 种画像（Fire Lover / Green Guardian / Umami Seeker）
- 5 组预定义 combo 消息（如 pork-belly-broccoli-mushroom → "完美平衡"）
- `generateFeedback(ingredients, lang)` → 入口函数

**扩展方向**: 可接入真实用户历史数据做持久化学习

### 5.4 `personalityEngine.ts` — 性格分析引擎

**大小**: 7.5KB  
**职责**: 生成性格报告、AI 反思日记、未来菜品推荐

**5 种厨师原型**: Fire Chef / Healthy Creator / Flavor Explorer / Comfort Cook / Kitchen Scientist

- `pickArchetype(ingredients, events, score)` — 基于标签 + 事件 + 分数选择
- `buildReflection(...)` — AI 反思英文叙事
- `generatePersonalityReport(...)` — 入口函数
- 5 条未来推荐规则（如五花肉 → Korean Spicy Chicken）

### 5.5 `dishImageEngine.ts` — 菜品可视化引擎

**大小**: 15KB  
**职责**: 生成像素菜品视觉配置

**8 种烹饪方法色板**: stirFry, deepFry, steam, boil, grill, raw, simmer, bake

**核心函数**:
- `generateDishVisual(ingredients, method, flavorProfile, score)` → `DishVisualConfig`
- `generateAIStory(...)` → `AIStory`（每种方法独特的叙事）
- `generateFlavorDecisions(...)` → 3-5 条 AI 决策日志
- `generateSmokeParticles(count)` / `generatePixelParticles(count, colors)` → 粒子系统

**图层系统**: `DishLayer` (base → protein → veg → sauce → garnish → side)

### 5.6 `aiCompanionContext.tsx` — AI 伙伴上下文

**类型**: React Context  
**职责**: 全局管理 PIXEL 的情绪和消息气泡

**接口**: `{ mood: AIMood, message: string | null, messageVisible: boolean }`  
**方法**: `setMood()`, `showMessage(msg, durationMs)`, `hideMessage()`

---

## 6. 数据类型系统

### 6.1 食材 (`src/types/food.ts`)

**9 种食材，3 个类别**:

| ID | Emoji | 名称 | 类别 | 卡路里 | Tags |
|---|---|---|---|---|---|
| `pork-belly` | 🥩 | Pork Belly | protein | 520 | rich, crispy, savory, fatty |
| `chicken` | 🍗 | Chicken | protein | 240 | lean, mild, versatile, grilled |
| `fish` | 🐟 | Fish | protein | 200 | fresh, light, delicate, steamed |
| `broccoli` | 🥦 | Broccoli | vegetable | 55 | fresh, crunchy, green, healthy |
| `mushroom` | 🍄 | Mushroom | vegetable | 30 | umami, earthy, soft, savory |
| `carrot` | 🥕 | Carrot | vegetable | 40 | sweet, crunchy, fresh, colorful |
| `garlic` | 🧄 | Garlic | flavor | 10 | aromatic, pungent, savory, bold |
| `chili` | 🌶️ | Chili | flavor | 5 | spicy, hot, bold, fire |
| `herb` | 🌿 | Herb | flavor | 2 | fresh, aromatic, green, light |

### 6.2 记忆类型 (`src/types/memory.ts`)

- `TasteMemory`: 用户口味记忆快照
- `PersonalityReport`: 性格引擎完整输出（原型 + 反思 + 推荐）

### 6.3 i18n 命名空间 (`src/i18n/translations.ts`)

14 个 UI 命名空间 + 3 个引擎命名空间: `home`, `studio`, `cooking`, `result`, `memory`, `timeline`, `dna`, `diary`, `common`, `tutorial`, `error`, `onboarding`, `personality`, `companion`, `engineMemory`, `engineCooking`, `enginePersonality`

支持 3 种语言: `en`, `zh`, `ja`  
语言检测: `localStorage` → `navigator.language` → 默认 `en`

---

## 7. 当前 Git 状态

| 属性 | 值 |
|---|---|
| **Branch** | `main` |
| **Remote** | `git@github.com:vivayang911/pixel-chef-ai.git` (SSH) |
| **Latest Commit** | `025fb8e` |
| **Latest Message** | `docs: replace placeholder screenshots with split showcase images (1280x720, 16:9)` |
| **Clean Status** | ✅ 无未提交修改 |
| **Push Status** | ✅ 已推送到 origin |

### 最近 20 个提交

```
025fb8e docs: replace placeholder screenshots with split showcase images (1280x720, 16:9)
39d4016 feat: add 6 hero screenshots + Playwright auto-screenshot tooling
1dab00c docs: rewrite README as product showcase for DEV Frontend Challenge
1c21cee fix: replace yellow shine dots on cooking pot with matching purple highlights
da1cb58 fix: t is not defined bug + add cooking method selection step between ingredients and AI cooking
f77b5fa feat: add AI showcase demo experience - Phase 8
68b251d Phase 7: AI Dish Reveal Experience
8f2daab Fix: TDZ error in CookingStory + ingredient positioning in PixelDishArtwork
e4918fa Phase 6.6 & 6.7: AI Companion Presence + Pixel Dish Generation
141583f feat: add EN/ZH/JA language switching with i18n context
ac6efa2 docs: polish README with badges, demo flow, and refined structure
106d857 docs: add demo screenshots for README
f06588e chore: prepare production release
5af7a68 chore: convert Pixel Chef AI interface to English
722933c chore: prepare pixel chef ai for submission
9278f84 feat: polish pixel chef ai for competition
bc1d766 feat: build taste memory system
31594d7 feat: build cooking story simulation
77c1972 feat: build AI cooking studio
1a5131f feat: build Memory Kitchen hero with animated fridge, AI chef & welcome
```

---

## 8. 已解决问题清单

| # | 问题 | 解决方案 | 涉及文件 |
|---|---|---|---|
| 1 | `t is not defined` 运行时错误 | `AIStorySection` 组件缺少 `useLanguage()` 调用 | `ResultPreview.tsx` |
| 2 | 炒锅上出现两个黄色像素点 | 高光颜色 `#ffcb3b` 改为锅色系 `#5a4fa0` + 降低透明度 | `CookingPot.tsx` |
| 3 | 缺少烹饪方式选择步骤 | 新增 `CookingMethodSelector` 组件 + 修改 CreateDish/App/CookingStory 流程 | 4 个文件 |
| 4 | 截图脚本 hash 路由不触发 React 渲染 | 添加 `hashchange` 事件监听 + 自动生成 demo 数据 | `App.tsx` |
| 5 | `computeCookingResult` 参数数量错误 | 修正为 5 个参数：`(ingredients, userTime, recommended, eventIds, lang)` | `App.tsx` |
| 6 | README 像开发文档 | 重写为产品展示风格（Why AI、Features、Screenshots、Future Vision） | `README.md` |
| 7 | 合成图需要拆分为 6 张独立截图 | PIL 切割脚本按 3×2 网格分割 + 裁掉 caption + resize 1280×720 | `docs/screenshots/` |
| 8 | SPA 路由需要 hash 支持截图 | 监听 `hashchange` 事件设置 `route` 状态 | `App.tsx` |

---

## 9. 当前待办事项

### P0 — DEV 比赛提交前必须完成

- [ ] **发布 DEV 文章** — 按用户给出的结构：What I Built → Demo → Why AI → Journey → Future Vision → GitHub（不写太多技术细节）
- [ ] **确认 Vercel 部署** — 确保 `npm run build` 产物正确部署，在线链接可访问
- [ ] **确认 GitHub README 图片正常显示** — 打开 https://github.com/vivayang911/pixel-chef-ai 检查 6 张截图

### P1 — 提升展示效果

- [ ] 可选：在 README 顶部添加 Demo Badge（已有 Vercel badge）
- [ ] 可选：添加项目的 Open Graph 图片用于社交分享
- [ ] 可选：录制短视频/GIF 展示交互流程

### P2 — Future Vision（比赛后）

- [ ] 接入真实 AI API (OpenAI/Gemini 通过 Vercel Edge Functions)
- [ ] 添加 PWA 支持
- [ ] 烹饪历史持久化 (IndexedDB / localStorage)
- [ ] 多模态食材识别（摄像头拍照）
- [ ] 智能冰箱 API 集成

---

## 10. 下一步开发建议

### 如果继续开发功能，建议顺序：

1. **接入 LLM API** — 将 `aiChefEngine` 中的确定性逻辑替换为真实 API 调用（需创建 Vercel Edge Function 作为代理）
2. **历史持久化** — 将烹饪结果存入 localStorage，实现真正的"记忆厨房"
3. **移动端优化** — 测试 375px 宽度下的交互（部分像素组件可能需要调整）
4. **音效系统** — 实现 `audioEngine.ts`（当前只是 console.log 占位符），用 Web Audio API 生成 8-bit 音效

---

## 11. 文件修改记录（最近关键修改）

| 日期 | 文件 | 修改 | 原因 |
|---|---|---|---|
| 08-01 | `docs/screenshots/*.png` | 用合成图分割的真实截图替换占位图 | 比赛展示需要视觉效果 |
| 08-01 | `README.md` | 删除截图占位提示文字 | 已有真实截图 |
| 08-01 | `README.md` | 重写为产品展示风格 | DEV 比赛评委导向 |
| 08-01 | `CookingPot.tsx` | 黄色高光点 → 紫色协调色 | 视觉 bug 修复 |
| 08-01 | `ResultPreview.tsx` | `AIStorySection` 补充 `useLanguage()` | `t is not defined` 崩溃 |
| 08-01 | `CookingMethodSelector.tsx` | 新建：6 种烹饪方式模态选择器 | 用户要求流程改进 |
| 08-01 | `CreateDish.tsx` | 添加烹饪方式选择流程 | 同上 |
| 08-01 | `App.tsx` | 新增 `cookingMethod` 状态 + hash 路由 + `computeCookingResult` 导入 | 截图支持 + 方法传递 |
| 08-01 | `CookingStory.tsx` | 添加 `cookingMethod` prop + 方法标签显示 | 烹饪方式显示 |
| 08-01 | `scripts/snap_final.mjs` | Playwright 截图脚本 | 自动化截图 |

---

## 12. 开发环境说明

### 本地运行

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # 构建到 dist/
npm run preview      # 预览构建产物 (http://localhost:4173)
npm run lint         # TypeScript 类型检查
```

### 截图工具

```bash
# 启动预览服务器
npx vite preview --port 4173 --host 0.0.0.0

# 另一终端运行截图脚本
node scripts/snap_final.mjs
```

### 部署 (Vercel)

```bash
npx vercel
# 或直接推送 main 分支触发自动部署（如果配置了 Vercel Git 集成）
```

---

## 13. 关键设计决策

1. **无后端/无数据库**: 纯前端 SPA，所有 AI 逻辑在客户端确定性模拟，便于比赛展示和免费部署
2. **像素艺术风格**: 使用 CSS 硬偏移阴影 + SVG 像素画 + Press Start 2P 字体，营造复古游戏感
3. **Framer Motion 动画**: 所有过渡和交互均使用 Framer Motion（非 CSS 动画），以保证流畅的进出场动画
4. **i18n 优先**: 所有文本通过 `t()` 函数翻译，无硬编码字符串
5. **引擎与 UI 分离**: `src/engine/` 中的纯逻辑不依赖 React，可独立测试和替换

---

## 14. 给下一次 AI 的启动指令

```
=== SESSION START ===

你现在接手 Pixel Chef AI 项目。

关键信息：
- 项目仓库：git@github.com:vivayang911/pixel-chef-ai.git (branch: main)
- 最新 commit：025fb8e（已 push）
- 这是一个 DEV Frontend Challenge 参赛项目
- 当前状态：功能完整，截图齐全，等待发布 DEV 文章
- 项目位于：c:/Users/P15v/CodeBuddy/pixel-chef-ai

请按以下步骤开始：
1. 读取 docs/AI_CONTEXT.md（本文件）获取完整上下文
2. 运行 git status 确认无未提交修改
3. 运行 npm run build 确认构建通过
4. 阅读 README.md 了解产品定位和展示风格
5. 根据用户需求继续开发

所有关键信息已在本文档中，无需额外搜索。
```
