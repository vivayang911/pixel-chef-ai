import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MemoryKitchen from '@/components/kitchen/MemoryKitchen'
import CreateDish from '@/pages/CreateDish'
import CookingStory from '@/pages/CookingStory'
import type { Ingredient } from '@/types/food'

type Route = 'home' | 'studio' | 'story'

export default function App() {
  const [route, setRoute] = useState<Route>('home')
  const [dish, setDish] = useState<Ingredient[]>([])

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
        {route === 'story' && <CookingStory dish={dish} onBack={() => setRoute('studio')} />}
      </main>
      <Footer />
    </div>
  )
}
