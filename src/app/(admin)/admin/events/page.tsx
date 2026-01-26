'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Calendar, Users, Clock, Edit2, Trash2 } from 'lucide-react'
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Event {
  id: string
  name: string
  description: string
  date: any
  maxParticipants: number | null
  registrationOpen: boolean
  registrationCloseDate: any
  participants: number
  createdAt: any
}

interface EventFormData {
  name: string
  description: string
  date: string
  maxParticipants: string
  registrationOpen: boolean
  registrationCloseDate: string
}

export default function AdminEventsPage() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    maxParticipants: '',
    registrationOpen: true,
    registrationCloseDate: '',
  })

  // Fetch events from Firestore
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoadingEvents(true)
    setFetchError('')
    try {
      const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(eventsQuery)
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      setEvents(eventsData)
    } catch (err: any) {
      console.error('Error fetching events:', err)
      const errorMessage = err.code === 'permission-denied' 
        ? 'You do not have permission to view events. Please check your admin role.'
        : err.code === 'unavailable'
        ? 'Unable to connect to the server. Please check your internet connection.'
        : 'Failed to load events. Please try again.'
      setFetchError(errorMessage)
    } finally {
      setLoadingEvents(false)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toISOString().slice(0, 16)
  }

  const startEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      description: event.description,
      date: formatDate(event.date),
      maxParticipants: event.maxParticipants?.toString() || '',
      registrationOpen: event.registrationOpen,
      registrationCloseDate: formatDate(event.registrationCloseDate),
    })
    setShowForm(true)
  }

  const cancelEdit = () => {
    setEditingEvent(null)
    setFormData({
      name: '',
      description: '',
      date: '',
      maxParticipants: '',
      registrationOpen: true,
      registrationCloseDate: '',
    })
    setShowForm(false)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    setDeletingEventId(eventId)
    try {
      await deleteDoc(doc(db, 'events', eventId))
      setSuccess('Event deleted successfully!')
      await fetchEvents()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error('Error deleting event:', err)
      const errorMessage = err.code === 'permission-denied'
        ? 'You do not have permission to delete events. Admin access required.'
        : err.code === 'not-found'
        ? 'Event not found. It may have been already deleted.'
        : err.message || 'Failed to delete event. Please try again.'
      setError(errorMessage)
      setTimeout(() => setError(''), 5000)
    } finally {
      setDeletingEventId(null)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.name || !formData.description || !formData.date) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) {
      setError('Max participants must be at least 1')
      return
    }

    setLoading(true)

    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: new Date(formData.date),
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
        registrationOpen: formData.registrationOpen,
        registrationCloseDate: formData.registrationCloseDate
          ? new Date(formData.registrationCloseDate)
          : null,
        updatedAt: serverTimestamp(),
      }

      if (editingEvent) {
        // Update existing event
        await updateDoc(doc(db, 'events', editingEvent.id), eventData)
        setSuccess('Event updated successfully!')
      } else {
        // Create new event
        await addDoc(collection(db, 'events'), {
          ...eventData,
          createdAt: serverTimestamp(),
          participants: 0,
        })
        setSuccess('Event created successfully!')
      }
      
      // Refresh events list
      await fetchEvents()
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        date: '',
        maxParticipants: '',
        registrationOpen: true,
        registrationCloseDate: '',
      })
      setEditingEvent(null)

      // Close form after 2 seconds
      setTimeout(() => {
        setShowForm(false)
        setSuccess('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || `Failed to ${editingEvent ? 'update' : 'create'} event`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages (Global) */}
      {(error || success) && !showForm && (
        <div className={`${error ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'} border px-4 py-3 rounded-lg`}>
          {error || success}
        </div>
      )}

      {/* Fetch Error Display */}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{fetchError}</span>
          <button
            onClick={fetchEvents}
            className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Events Management</h2>
          <p className="text-gray-400">Create and manage club events</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              cancelEdit()
            } else {
              setShowForm(true)
            }
          }}
          className="flex items-center space-x-2 bg-tech-accent text-tech-dark px-4 py-2 rounded-lg hover:bg-tech-accent/90 transition-all font-semibold"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </>
          )}
        </button>
      </div>

      {/* Create/Edit Event Form */}
      {showForm && (
        <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., TechHack 2026"
                className="w-full px-4 py-3 rounded-lg bg-tech-dark border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-300 mb-2 font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-tech-dark border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition resize-none"
                required
              />
            </div>

            {/* Event Date and Max Participants - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Date */}
              <div>
                <label htmlFor="date" className="block text-gray-300 mb-2 font-medium">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-tech-dark border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <label htmlFor="maxParticipants" className="block text-gray-300 mb-2 font-medium">
                  Max Participants
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    placeholder="Leave empty for unlimited"
                    min="1"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-tech-dark border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Registration Settings */}
            <div className="space-y-4 p-4 bg-tech-dark rounded-lg border border-gray-700">
              <h4 className="text-white font-semibold">Registration Settings</h4>
              
              {/* Registration Open Toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="registrationOpen" className="text-gray-300">
                  Registration Open
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="registrationOpen"
                    name="registrationOpen"
                    checked={formData.registrationOpen}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-tech-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tech-accent"></div>
                </label>
              </div>

              {/* Registration Close Date */}
              <div>
                <label htmlFor="registrationCloseDate" className="block text-gray-300 mb-2">
                  Registration Close Date (Optional)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="datetime-local"
                    id="registrationCloseDate"
                    name="registrationCloseDate"
                    value={formData.registrationCloseDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-tech-light border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-tech-accent text-tech-dark font-semibold py-3 rounded-lg hover:bg-tech-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? (editingEvent ? 'Updating Event...' : 'Creating Event...') 
                  : (editingEvent ? 'Update Event' : 'Create Event')}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">All Events</h3>
        
        {loadingEvents ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-tech-dark border border-tech-accent/20 rounded-lg p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-9 bg-gray-700 rounded w-20"></div>
                  <div className="h-9 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            No events yet. Create your first event!
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-tech-dark border border-gray-700 rounded-lg p-4 hover:border-tech-accent/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{event.name}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          event.registrationOpen
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {event.registrationOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="text-white">
                          {event.date?.toDate 
                            ? event.date.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Participants:</span>
                        <p className="text-white">
                          {event.participants || 0}
                          {event.maxParticipants && ` / ${event.maxParticipants}`}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Capacity:</span>
                        <p className="text-white">
                          {event.maxParticipants || 'Unlimited'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Registration Closes:</span>
                        <p className="text-white">
                          {event.registrationCloseDate?.toDate
                            ? event.registrationCloseDate.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'No limit'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => startEdit(event)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition"
                      title="Edit event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingEventId === event.id}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition disabled:opacity-50"
                      title="Delete event"
                    >
                      {deletingEventId === event.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
