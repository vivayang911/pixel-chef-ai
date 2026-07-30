import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        {/* Further sections (Cookbook, Features, How it works) land here in the next phase. */}
      </main>
      <Footer />
    </div>
  )
}
