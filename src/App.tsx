import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MemoryKitchen from '@/components/kitchen/MemoryKitchen'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MemoryKitchen />
        {/* Further sections (Cookbook, Features, How it works) land here in the next phase. */}
      </main>
      <Footer />
    </div>
  )
}
