import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Features from '@/components/Features'
import Events from '@/components/Events'
import Team from '@/components/Team'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-tech-dark min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Events />
      <Team />
      <Footer />
    </main>
  )
}
