# 🍳 Pixel Chef AI

**A Memory Kitchen That Learns Your Taste.**

> Built for the **DEV Frontend Challenge** — fully client-side, zero backend, pure vibes.

---

## ✨ Features

- 🤖 **AI Cooking Companion** — Your pixel sous-chef guides you through every step
- 🧊 **Interactive Pixel Kitchen** — Open the fridge, pick ingredients, toss into the pot
- 🔥 **Real-time Cooking Simulation** — Countdown timer, random fire/seasoning/flavor events, AI chat
- 🧬 **Taste Personality System** — AI analyzes your cooking style and builds your Taste DNA
- 📝 **AI Diary & Memory Timeline** — Typewriter journal entries, cooking memories, future suggestions
- 🎮 **Pixel Game Feel** — 8-bit interface with Framer Motion animations, blinking chef, steam, sparkles
- 📱 **Fully Responsive** — Polished at 375px through ultrawide, mobile-first

---

## 📸 Demo Screenshots

| Home | Studio | Cooking | Memory |
|------|--------|---------|--------|
| ![Home](docs/screenshots/home.png) | ![Studio](docs/screenshots/studio.png) | ![Cooking](docs/screenshots/cooking.png) | ![Memory](docs/screenshots/memory.png) |

> Screenshots coming soon — replace the placeholders in `docs/screenshots/` with your own captures.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Animation | Framer Motion |
| Styling | Tailwind CSS v3 |
| Fonts | Press Start 2P · VT323 · Inter |
| State | React useState / useMemo / useRef |
| Persistence | localStorage (tutorial flag only) |

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

## 📦 Getting Started

```bash
# Install
npm install

# Dev
npm run dev

# Build & preview
npm run build
npm run preview
```

---

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/pixel-chef-ai)

Or manually:

```bash
npm install -g vercel
vercel
```

SPA routing is handled via `vercel.json` — all routes fall back to `index.html`.

---

## 🔮 Future Ideas

- 🎵 Web Audio sizzle & chiptune sound effects
- 🗃️ IndexedDB recipe history
- 🤖 OpenAI / Gemini integration for real AI suggestions
- 🏆 Cooking achievements & unlockable pixel cosmetics
- 🌐 Social sharing: generate pixel recipe cards
- 📲 PWA for offline cooking

---

## 📄 License

MIT — cook freely!
