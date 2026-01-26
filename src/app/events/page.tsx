'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Calendar, Users, Clock, MapPin, X } from 'lucide-react'

interface Event {
  id: string
  name: string
  description: string
  date: any
  maxParticipants: number | null
  registrationOpen: boolean
  registrationCloseDate: any
  participants: number
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserRegistrations()
    }
  }, [user])

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const querySnapshot = await getDocs(collection(db, 'events'))
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      
      // Filter for registration open and upcoming events
      const upcomingEvents = eventsData
        .filter(event => {
          const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
          return event.registrationOpen && eventDate > new Date()
        })
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
          return dateA.getTime() - dateB.getTime()
        })
      
      setEvents(upcomingEvents)
    } catch (err: any) {
      console.error('Error fetching events:', err)
      const errorMessage = err.code === 'unavailable'
        ? 'Unable to connect to the server. Please check your internet connection.'
        : 'Failed to load events. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async () => {
    if (!user) return
    
    try {
      const registrationsQuery = query(
        collection(db, 'registrations'),
        where('studentId', '==', user.uid)
      )
      const querySnapshot = await getDocs(registrationsQuery)
      const eventIds = new Set<string>(querySnapshot.docs.map(doc => doc.data().eventId))
      setRegisteredEventIds(eventIds)
    } catch (err) {
      console.error('Error fetching user registrations:', err)
      // Don't show error to user for this, it's not critical
      // User will just not see which events they're registered for
    }
  }

  const handleRegisterClick = (event: Event) => {
    if (!user) {
      router.push('/login')
      return
    }
    setSelectedEvent(event)
    setShowRegistrationForm(true)
  }

  const closeRegistrationForm = () => {
    setShowRegistrationForm(false)
    setSelectedEvent(null)
  }

  const isEventFull = (event: Event) => {
    return event.maxParticipants && event.participants >= event.maxParticipants
  }

  const isRegistrationClosed = (event: Event) => {
    if (!event.registrationCloseDate) return false
    const closeDate = event.registrationCloseDate?.toDate 
      ? event.registrationCloseDate.toDate() 
      : new Date(event.registrationCloseDate)
    return closeDate < new Date()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-tech-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Events</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="bg-tech-accent text-tech-dark px-6 py-3 rounded-lg hover:bg-tech-accent/90 transition font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tech-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming <span className="text-tech-accent">Events</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Register for exciting events and workshops organized by Technovate
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Events</h3>
            <p className="text-gray-400">Check back later for new events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
              const isFull = isEventFull(event)
              const isClosed = isRegistrationClosed(event)
              const isRegistered = registeredEventIds.has(event.id)
              const canRegister = !isFull && !isClosed && !isRegistered

              return (
                <div
                  key={event.id}
                  className="bg-tech-light border border-tech-accent/20 rounded-lg overflow-hidden hover:border-tech-accent/50 transition-all"
                >
                  {/* Event Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{event.name}</h3>
                      {isRegistered && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          Registered
                        </span>
                      )}
                      {isFull && !isRegistered && (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                          Full
                        </span>
                      )}
                      {isClosed && !isFull && !isRegistered && (
                        <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded">
                          Closed
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-tech-accent" />
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-tech-accent" />
                        {eventDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>

                      <div className="flex items-center text-sm text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-tech-accent" />
                        {event.participants || 0}
                        {event.maxParticipants && ` / ${event.maxParticipants}`} participants
                      </div>
                    </div>

                    {/* Register Button */}
                    <button
                      onClick={() => handleRegisterClick(event)}
                      disabled={!canRegister}
                      className="w-full bg-tech-accent text-tech-dark font-semibold py-3 rounded-lg hover:bg-tech-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRegistered ? 'Already Registered' : isFull ? 'Event Full' : isClosed ? 'Registration Closed' : 'Register Now'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationForm && selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={closeRegistrationForm}
          onSuccess={() => {
            fetchEvents()
            fetchUserRegistrations()
            closeRegistrationForm()
          }}
        />
      )}
    </div>
  )
}

function RegistrationModal({
  event,
  onClose,
  onSuccess,
}: {
  event: Event
  onClose: () => void
  onSuccess: () => void
}) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    phone: '',
    college: '',
    department: '',
    year: '',
    studentId: '',
    whyJoin: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.phone || !formData.college || !formData.department || !formData.year) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.name,
          userId: user?.uid,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err: any) {
      console.error('Error registering for event:', err)
      let errorMessage = 'Failed to register for event. Please try again.'
      
      if (err.message?.includes('already registered')) {
        errorMessage = 'You are already registered for this event.'
      } else if (err.message?.includes('permission')) {
        errorMessage = 'Registration is currently unavailable. Please try again later.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
            <p className="text-gray-400">You've been registered for {event.name}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white mb-2">Register for Event</h3>
            <p className="text-gray-400 mb-6">{event.name}</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ''}
                  disabled
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-tech-accent">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-2">
                  College/University <span className="text-tech-accent">*</span>
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Rayat Bahra University"
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
                  Department/Branch <span className="text-tech-accent">*</span>
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Computer Science & Engineering"
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                  Current Year <span className="text-tech-accent">*</span>
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">
                  Student ID/Roll Number (Optional)
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., CS2023001"
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="whyJoin" className="block text-sm font-medium text-gray-300 mb-2">
                  Why do you want to join? (Optional)
                </label>
                <textarea
                  id="whyJoin"
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us what excites you about this event..."
                  className="w-full px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition resize-none placeholder-gray-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-tech-accent text-tech-dark font-semibold py-3 rounded-lg hover:bg-tech-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
