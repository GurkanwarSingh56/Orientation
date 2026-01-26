'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'Where Technology Meets Innovation'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/backgrounds/herobg.jpg)' }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-tech-dark/90 via-tech-dark/80 to-tech-light/90" />
      
      {/* Animated background accents */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-tech-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-tech-accent rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
            Tech<span className="gradient-text">novate</span>
          </h1>
          <div className="h-16 mb-8">
            <p className="text-xl md:text-2xl lg:text-3xl text-tech-accent font-semibold">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join the premier technical club where students collaborate, innovate, and build the future. 
            Learn cutting-edge technologies, work on real projects, and connect with like-minded innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#about" className="btn-primary">
              Explore More
            </a>
            <a href="#events" className="btn-secondary">
              View Events
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-tech-accent"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 text-tech-accent opacity-30 animate-float">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-20 text-tech-accent opacity-30 animate-float animation-delay-2000">
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
        </svg>
      </div>
    </section>
  )
}
