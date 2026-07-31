# 🍳 Pixel Chef AI

**A Memory Kitchen That Learns Your Taste.**

> Built for the [DEV Frontend Challenge: Comfort Food Edition](https://dev.to/challenges) — fully client-side, zero backend, pure vibes.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square)](https://your-demo-url.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## Overview

Pixel Chef AI is an interactive AI cooking companion that lives inside a pixel-art kitchen.  
You pick ingredients from the fridge, toss them into the pot, and watch a real-time cooking simulation unfold — complete with random fire events, AI chatter, and a personality engine that builds your unique **Taste DNA**.  

Every cook generates a diary entry, a timeline memory, and future recipe suggestions. It's a small love letter to the food that makes us feel at home.

---

## ✨ Features

- 🤖 **AI Cooking Companion** — Your pixel sous-chef guides you through every step
- 🧊 **Interactive Pixel Kitchen** — Open the fridge, pick ingredients, toss into the pot
- 🔥 **Real-time Cooking Simulation** — Countdown timer, random fire / seasoning / flavor events, AI chat
- 🧬 **Taste Personality System** — AI analyzes your cooking style and builds your Taste DNA
- 📝 **AI Diary & Memory Timeline** — Typewriter journal entries, cooking memories, future suggestions
- 🎮 **Pixel Game Feel** — 8-bit interface with Framer Motion animations, blinking chef, steam, sparkles
- 📱 **Fully Responsive** — Polished from 375px to ultrawide, mobile-first

---

## 📸 Screenshots

| Home (Memory Kitchen) | AI Cooking Studio | Cooking Simulation | Taste Memory |
|:---------------------:|:-----------------:|:------------------:|:------------:|
| ![Home](docs/screenshots/home.png) | ![Studio](docs/screenshots/studio.png) | ![Cooking](docs/screenshots/cooking.png) | ![Memory](docs/screenshots/memory.png) |

> Replace the four images in `docs/screenshots/` with real captures (recommended size ≈ 1280×720 or 16:9).

---

## 🚀 Demo Flow

```
Home (Memory Kitchen)
  ↓ Start Cooking
AI Cooking Studio
  ↓ Pick ingredients → toss into pot
  ↓ Start Cooking
Cooking Story Simulation
  ↓ Timer + fire events + AI chat
  ↓ Finish Cooking
Result Preview (scores)
  ↓ Save To My Taste Memory
Taste Memory Diary
  ↓ AI Reflection → Taste DNA → Timeline → Future Suggestion
```

---

## 🏗️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 18 + TypeScript               |
| Build       | Vite 5                              |
| Animation   | Framer Motion 11                    |
| Styling     | Tailwind CSS v3 + Custom Theme      |
| Fonts       | Press Start 2P · VT323 · Inter      |
| State       | React useState / useMemo / useRef   |
| Persistence | localStorage (tutorial flag only)   |

---

## 📐 Architecture

```
src/
├── components/
│   ├── ai/               # AI Chef Companion, FlavorDNA, AIAnalysisPanel, TypingText
│   ├── common/           # ErrorBoundary, PageTransition, PixelLoader
│   ├── cooking/          # AIAdvisor, IngredientShelf, TasteMemoryCard, Story
│   │   └── story/        # ResultPreview, CookingEvent, PixelChefAnimation
│   ├── kitchen/          # MemoryKitchen (homepage)
│   ├── memory/           # AIReflection, TasteDNA, MemoryTimeline...
│   └── ui/               # PixelButton, PixelChef, PixelCard, Header
├── engine/               # Pure logic (no side effects)
│   ├── aiChefEngine.ts   # AI analysis, flavor prediction, companion phrases
│   ├── aiCompanionContext.tsx  # Global AI mood & speech bubble state
│   ├── memoryEngine.ts
│   ├── cookingEngine.ts
│   └── personalityEngine.ts
├── i18n/                 # EN / 中文 / 日本語 translations
├── pages/
├── types/
└── App.tsx               # SPA router + AICompanionProvider
```

---

## 🧠 AI Companion Architecture

```
                    ┌─────────────────────────┐
                    │   User Makes a Choice    │
                    └───────────┬─────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │   AI Companion Floating Avatar   │
              │   (persistent across all pages)  │
              │   ┌─────┐   ┌───────────────┐   │
              │   │ Mood│──▶│ Speech Bubble │   │
              │   │ 😊  │   │ w/ TypingAnim │   │
              │   └─────┘   └───────────────┘   │
              └─────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │     Ingredient Analysis Engine   │
              │  • analyzeIngredients()          │
              │  • 15‑element flavor profiles    │
              │  • Pairing compatibility matrix  │
              └─────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │        Flavor Prediction         │
              │  • predictFlavor()               │
              │  • FlavorDNA SVG radar chart     │
              │  • Taste balance scoring         │
              └─────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │        Nutrition Advice          │
              │  • Calorie estimates             │
              │  • Health score                  │
              │  • Dietary balance tips          │
              └─────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │       Cooking Assistance         │
              │  • Real‑time event guidance      │
              │  • Auto‑cook optimization        │
              │  • AI chat with TypingText       │
              └─────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │          Taste Memory            │
              │  • Persistent cooking history    │
              │  • Taste personality profile     │
              │  • AI reflection diary           │
              │  • Future recipe suggestions     │
              └─────────────────────────────────┘
```

### AI Mood State Machine

```
   home page ──────▶ happy
                       │
   ingredient ─────▶ curious
   selection           │
                       │
   AI analysis ─────▶ thinking
   panel               │
                       │
   cooking ─────────▶ focused
   story               │
                       │
   ┌───────────────────┤
   │                   │
   ▼                   ▼
success             failure
 (celebrate)        (comfort)
```

### Companion Messages by Phase

| Phase | Mood | Speech Bubble |
|-------|------|---------------|
| Home (returning) | `happy` | "Welcome back, Chef. I saved your flavor memory." |
| Home (fridge) | `happy` | "Let's discover today's flavor." |
| Pick ingredient | `curious` | "Interesting choice! Let's see what we can create." |
| AI Analysis | `thinking` | "Give me a second… I'm balancing your flavors." |
| Cooking | `focused` | "The heat is rising. I would lower the flame now." |
| Success | `celebrate` | "Beautiful! This feels like your style." |
| Failure | `comfort` | "Not perfect… but every chef learns." |

---

## 💻 Local Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint         # TypeScript check
npm run build
npm run preview
```

## 🚢 Deployment

### Vercel (recommended)

```bash
npx vercel
```

SPA routing is already handled by `vercel.json`.

### Any static host

```bash
npm run build
# Upload the dist/ folder
```

## 🔮 Future Ideas

- 🎵 Web Audio sizzle & chiptune effects
- 🗃️ IndexedDB recipe history
- 🤖 Real AI (OpenAI / Gemini) suggestions
- 🏆 Cooking achievements & unlockable cosmetics
- 🌐 Social sharing of pixel recipe cards
- 📲 PWA support

---

## 📄 License

MIT — cook freely!
