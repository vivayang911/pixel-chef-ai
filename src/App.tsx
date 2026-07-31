import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MemoryKitchen from '@/components/kitchen/MemoryKitchen'
import CreateDish from '@/pages/CreateDish'
import CookingStory from '@/pages/CookingStory'
import ResultPreview from '@/components/cooking/story/ResultPreview'
import type { CookingResult } from '@/engine/cookingEngine'
import type { Ingredient } from '@/types/food'

type Route = 'home' | 'studio' | 'story' | 'result'

export default function App() {
  const [route, setRoute] = useState<Route>('home')
  const [dish, setDish] = useState<Ingredient[]>([])
  const [cookingResult, setCookingResult] = useState<CookingResult | null>(null)

  return (
    <div className="min-h-screen">
      <Header onStart={() => setRoute('studio')} />
      <main>
        {route === 'home' && <MemoryKitchen onStart={() => setRoute('studio')} />}

        {route === 'studio' && (
          <CreateDish
            onBack={() => setRoute('home')}
            onStartCooking={(ingredients) => {
              setDish(ingredients)
              setRoute('story')
            }}
          />
        )}

        {route === 'story' && (
          <CookingStory
            dish={dish}
            onFinish={(result) => {
              setCookingResult(result)
              setRoute('result')
            }}
          />
        )}

        {route === 'result' && cookingResult && (
          <ResultPreview
            result={cookingResult}
            onBack={() => setRoute('home')}
            onRetry={() => setRoute('studio')}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
