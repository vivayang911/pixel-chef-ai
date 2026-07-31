import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from '@/i18n/LanguageContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MemoryKitchen from '@/components/kitchen/MemoryKitchen'
import CreateDish from '@/pages/CreateDish'
import CookingStory from '@/pages/CookingStory'
import ResultPreview from '@/components/cooking/story/ResultPreview'
import TasteMemoryPage from '@/pages/TasteMemory'
import PageTransition from '@/components/common/PageTransition'
import OnboardingTutorial from '@/components/common/OnboardingTutorial'
import type { CookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'

type Route = 'home' | 'studio' | 'story' | 'result' | 'memory'

export default function App() {
  const [route, setRoute] = useState<Route>('home')
  const [dish, setDish] = useState<Ingredient[]>([])
  const [cookingResult, setCookingResult] = useState<CookingResult | null>(null)

  return (
    <LanguageProvider>
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* First-visit tutorial (localStorage gated) */}
      <OnboardingTutorial />

      <Header onStart={() => setRoute('studio')} />

      <main>
        <AnimatePresence mode="wait">
          {route === 'home' && (
            <PageTransition routeKey="home">
              <MemoryKitchen onStart={() => setRoute('studio')} />
            </PageTransition>
          )}

          {route === 'studio' && (
            <PageTransition routeKey="studio">
              <CreateDish
                onBack={() => setRoute('home')}
                onStartCooking={(ingredients) => {
                  setDish(ingredients)
                  setRoute('story')
                }}
              />
            </PageTransition>
          )}

          {route === 'story' && (
            <PageTransition routeKey="story">
              <CookingStory
                dish={dish}
                onFinish={(result) => {
                  setCookingResult(result)
                  setRoute('result')
                }}
              />
            </PageTransition>
          )}

          {route === 'result' && cookingResult && (
            <PageTransition routeKey="result">
              <ResultPreview
                result={cookingResult}
                onBack={() => setRoute('home')}
                onRetry={() => setRoute('studio')}
                onMemory={() => setRoute('memory')}
              />
            </PageTransition>
          )}

          {route === 'memory' && cookingResult && (
            <PageTransition routeKey="memory">
              <TasteMemoryPage
                result={cookingResult}
                dish={dish}
                onBack={() => setRoute('home')}
                onCookAgain={() => setRoute('studio')}
              />
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
    </LanguageProvider>
  )
}
