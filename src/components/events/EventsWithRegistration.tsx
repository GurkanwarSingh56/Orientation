'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import EventRegistrationForm from '@/components/events/EventRegistrationForm'

interface Event {
  id: string
  title: string
  date: string
  type: string
  description: string
  status: string
  image: string
}

export default function EventsWithRegistration() {
  const { user } = useAuth()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const events: Event[] = [
    {
      id: 'tech-hack-2026',
      title: 'TechHack 2026',
      date: 'March 15-17, 2026',
      type: 'Hackathon',
      description: 'A 48-hour hackathon focused on building innovative solutions for real-world problems. Win prizes worth $10,000!',
      status: 'upcoming',
      image: '🚀',
    },
    {
      id: 'ai-ml-workshop',
      title: 'AI/ML Workshop Series',
      date: 'February 10-28, 2026',
      type: 'Workshop',
      description: 'Learn Machine Learning from basics to advanced topics. Hands-on projects and certification included.',
      status: 'upcoming',
      image: '🤖',
    },
    {
      id: 'web3-bootcamp',
      title: 'Web3 Bootcamp',
      date: 'April 5-12, 2026',
      type: 'Bootcamp',
      description: 'Deep dive into blockchain technology, smart contracts, and decentralized applications development.',
      status: 'upcoming',
      image: '⛓️',
    },
  ]

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const closeModal = () => {
    setSelectedEvent(null)
  }

  return (
    <>
      <section id="events" className="section-container bg-tech-light">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Our <span className="gradient-text">Events</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join us for exciting events, workshops, and hackathons throughout the year
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <span className="w-2 h-8 bg-tech-accent mr-3"></span>
            Upcoming Events
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={index} className="card group">
                <div className="text-6xl mb-4">{event.image}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-tech-accent/20 text-tech-accent rounded-full text-sm font-semibold">
                    {event.type}
                  </span>
                  <span className="text-sm text-gray-400">{event.date}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{event.title}</h4>
                <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>
                <button
                  onClick={() => handleRegisterClick(event)}
                  className="w-full py-2 px-4 bg-tech-accent text-tech-dark rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
                >
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-tech-light rounded-2xl border border-tech-accent/20 max-w-md w-full p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <EventRegistrationForm
              eventId={selectedEvent.id}
              eventName={selectedEvent.title}
              onSuccess={closeModal}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </>
  )
}
