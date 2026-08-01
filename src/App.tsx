import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { AICompanionProvider } from '@/engine/aiCompanionContext'
import AIChefCompanion from '@/components/ai/AIChefCompanion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MemoryKitchen from '@/components/kitchen/MemoryKitchen'
import CreateDish from '@/pages/CreateDish'
import CookingStory from '@/pages/CookingStory'
import ResultPreview from '@/components/cooking/story/ResultPreview'
import TasteMemoryPage from '@/pages/TasteMemory'
import PageTransition from '@/components/common/PageTransition'
import OnboardingTutorial from '@/components/common/OnboardingTutorial'
import DemoMode from '@/components/demo/DemoMode'
import type { CookingResult } from '@/engine/cookingEngine'
import { computeCookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'
import { INGREDIENTS } from '@/types/food'

type Route = 'home' | 'studio' | 'story' | 'result' | 'memory'

const DEMO_INGREDIENT_IDS = ['pork-belly', 'broccoli', 'mushroom']

export default function App() {
  const [route, setRoute] = useState<Route>(() => {
    // Support URL hash routing for screenshots: #studio, #story, #result, #memory
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      const validRoutes: Route[] = ['home', 'studio', 'story', 'result', 'memory']
      if (validRoutes.includes(hash as Route)) return hash as Route
    }
    return 'home'
  })
  const [dish, setDish] = useState<Ingredient[]>([])
  const [cookingResult, setCookingResult] = useState<CookingResult | null>(null)
  const [cookingMethod, setCookingMethod] = useState('stir-fry')
  const [demoMode, setDemoMode] = useState(false)
  const [autoSelectDemo, setAutoSelectDemo] = useState(false)
  const [autoCookDemo, setAutoCookDemo] = useState(false)
  const demoDoneRef = useRef(false)

  // Sync URL hash with route state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = route === 'home' ? '' : route
    }
  }, [route])

  // Listen for hash changes (for screenshot tools)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      const validRoutes: Route[] = ['home', 'studio', 'story', 'result', 'memory']
      if (!hash || !validRoutes.includes(hash as Route)) return
      const demoList = DEMO_INGREDIENT_IDS
        .map((id) => INGREDIENTS.find((i) => i.id === id))
        .filter((i): i is Ingredient => i !== undefined)
      setDish(demoList)
      setCookingMethod('stir-fry')

      // For result/memory pages, generate a sample cooking result
      if (hash === 'result' || hash === 'memory') {
        const sampleResult = computeCookingResult(demoList, 17, 18, ['perfectFlavor'], 'en')
        setCookingResult(sampleResult)
      }

      if (hash === 'story') setAutoCookDemo(true)

      setRoute(hash as Route)
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Demo mode: start the showcase
  const handleStartDemo = useCallback(() => {
    demoDoneRef.current = false
    setDemoMode(true)
  }, [])

  // Demo mode: navigate between app routes
  const handleDemoNavigate = useCallback(
    (targetRoute: string) => {
      setDemoMode(false)

      if (targetRoute === 'studio') {
        // Auto-select demo ingredients
        setAutoSelectDemo(true)
        setRoute('studio')
      } else if (targetRoute === 'story') {
        setAutoCookDemo(true)
        setTimeout(() => setRoute('story'), 100)
      } else if (targetRoute === 'result') {
        demoDoneRef.current = true
      }
    },
    [],
  )

  // Demo mode: close/skip
  const handleDemoClose = useCallback(() => {
    setDemoMode(false)
    setAutoSelectDemo(false)
    setAutoCookDemo(false)
  }, [])

  return (
    <LanguageProvider>
    <AICompanionProvider>
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* First-visit tutorial (localStorage gated) */}
      <OnboardingTutorial />

      <Header onStart={() => setRoute('studio')} />

      <main>
        <AnimatePresence mode="wait">
          {route === 'home' && (
            <PageTransition routeKey="home">
              <MemoryKitchen
                onStart={() => setRoute('studio')}
                onWatchDemo={handleStartDemo}
              />
            </PageTransition>
          )}

          {route === 'studio' && (
            <PageTransition routeKey="studio">
              <CreateDish
                onBack={() => {
                  setAutoSelectDemo(false)
                  setRoute('home')
                }}
                onStartCooking={(ingredients, method) => {
                  setDish(ingredients)
                  setCookingMethod(method)
                  setAutoSelectDemo(false)
                  if (autoSelectDemo) {
                    // Demo mode: auto-navigate to cooking after a brief delay
                    setTimeout(() => {
                      setAutoCookDemo(true)
                      setTimeout(() => setRoute('story'), 300)
                    }, 1200)
                  } else {
                    setRoute('story')
                  }
                }}
                autoSelectIngredients={
                  autoSelectDemo
                    ? INGREDIENTS.filter((i) => DEMO_INGREDIENT_IDS.includes(i.id))
                    : undefined
                }
              />
            </PageTransition>
          )}

          {route === 'story' && (
            <PageTransition routeKey="story">
              <CookingStory
                dish={dish}
                cookingMethod={cookingMethod}
                onFinish={(result) => {
                  setCookingResult(result)
                  setAutoCookDemo(false)
                  setRoute('result')
                }}
                autoCook={autoCookDemo}
              />
            </PageTransition>
          )}

          {route === 'result' && cookingResult && (
            <PageTransition routeKey="result">
              <ResultPreview
                result={cookingResult}
                ingredients={dish}
                method={cookingMethod}
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

      {/* AI Chef Companion — persistent floating presence */}
      <AIChefCompanion />

      {/* Demo Mode overlay */}
      {demoMode && (
        <DemoMode onNavigate={handleDemoNavigate} onClose={handleDemoClose} />
      )}
    </div>
    </AICompanionProvider>
    </LanguageProvider>
  )
}
