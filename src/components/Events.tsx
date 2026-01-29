'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Event {
  id: string
  name: string
  description: string
  date: any
  maxParticipants: number | null
  registrationOpen: boolean
}

const eventEmojis = ['🚀', '🤖', '⛓️', '💼', '☁️', '⚡', '🎯', '💻', '🌟', '🔥']

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'events'))
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      
      // Split into upcoming and past events
      const now = new Date()
      const upcoming: Event[] = []
      const past: Event[] = []
      
      eventsData.forEach(event => {
        const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
        if (eventDate > now) {
          upcoming.push(event)
        } else {
          past.push(event)
        }
      })
      
      // Sort by date
      upcoming.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      
      past.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })
      
      setUpcomingEvents(upcoming.slice(0, 3)) // Show only 3 upcoming events
      setPastEvents(past.slice(0, 3)) // Show only 3 past events
    } catch (err: any) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="events" className="section-container bg-tech-light">
      <div className="text-center mb-16">
        <h2 className="heading-secondary">
          Our <span className="gradient-text">Events</span>
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Join us for exciting events, workshops, and hackathons throughout the year
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-tech-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <span className="w-2 h-8 bg-tech-accent mr-3"></span>
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-tech-dark rounded-lg border border-tech-accent/20">
                <p className="text-gray-400">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => {
                  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
                  return (
                    <div key={event.id} className="card group">
                      <div className="text-6xl mb-4">{eventEmojis[index % eventEmojis.length]}</div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-tech-accent/20 text-tech-accent rounded-full text-sm font-semibold">
                          {event.registrationOpen ? 'Open' : 'Closed'}
                        </span>
                        <span className="text-sm text-gray-400">
                          {eventDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">{event.name}</h4>
                      <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">{event.description}</p>
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfs__fYZoaMAVqv-Io1bwobVGle5nC9FSXEzN6rRS4rpyer0g/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 px-4 bg-tech-accent/10 text-tech-accent rounded-lg font-semibold hover:bg-tech-accent hover:text-tech-dark transition-all duration-300 text-center"
                      >
                        Register Now
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="w-2 h-8 bg-gray-500 mr-3"></span>
                Past Events
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => {
                  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
                  return (
                    <div key={event.id} className="card opacity-75 hover:opacity-100">
                      <div className="text-6xl mb-4 grayscale">{eventEmojis[index % eventEmojis.length]}</div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-semibold">
                          Completed
                        </span>
                        <span className="text-sm text-gray-400">
                          {eventDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">{event.name}</h4>
                      <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">{event.description}</p>
                      <button className="w-full py-2 px-4 bg-gray-700 text-gray-300 rounded-lg font-semibold cursor-not-allowed">
                        Event Concluded
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
