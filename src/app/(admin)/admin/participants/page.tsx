'use client'

import { useState, useEffect } from 'react'
import { Download, Search, Calendar, Users as UsersIcon, Mail, Phone, BookOpen, GraduationCap, Trash2 } from 'lucide-react'
import { collection, getDocs, query, orderBy, where, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Registration {
  id: string
  eventId: string
  eventName: string
  studentName: string
  studentEmail: string
  studentId: string
  department: string
  year: number
  phone: string
  timestamp: any
  createdAt: any
}

interface Event {
  id: string
  name: string
}

export default function AdminParticipantsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch events
      const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
      const eventsSnapshot = await getDocs(eventsQuery)
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      })) as Event[]
      setEvents(eventsData)

      // Fetch all registrations
      const registrationsQuery = query(
        collection(db, 'registrations'),
        orderBy('createdAt', 'desc')
      )
      const registrationsSnapshot = await getDocs(registrationsQuery)
      const registrationsData = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[]
      setRegistrations(registrationsData)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      const errorMessage = err.code === 'permission-denied'
        ? 'You do not have permission to view participants. Admin access required.'
        : err.code === 'unavailable'
        ? 'Unable to connect to the server. Please check your internet connection.'
        : 'Failed to load participants data. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEvent = selectedEvent === 'all' || reg.eventId === selectedEvent

    return matchesSearch && matchesEvent
  })

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No data to export')
      return
    }

    // CSV headers
    const headers = [
      'Event Name',
      'Student Name',
      'Email',
      'Department',
      'Year',
      'Phone',
      'Registration Date'
    ]

    // CSV rows
    const rows = filteredRegistrations.map(reg => [
      reg.eventName,
      reg.studentName,
      reg.studentEmail,
      reg.department,
      reg.year.toString(),
      reg.phone || 'N/A',
      reg.timestamp?.toDate ? reg.timestamp.toDate().toLocaleString() : 
        (reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleString() : 'N/A')
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `participants_${selectedEvent === 'all' ? 'all_events' : events.find(e => e.id === selectedEvent)?.name || 'export'}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (registrationId: string, participantName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the registration for ${participantName}? This action cannot be undone.`
    )
    
    if (!confirmDelete) return

    setDeleteLoading(registrationId)
    try {
      await deleteDoc(doc(db, 'registrations', registrationId))
      
      // Update local state
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId))
      
      alert('Participant deleted successfully')
    } catch (err: any) {
      console.error('Error deleting participant:', err)
      alert('Failed to delete participant. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Group registrations by event
  const registrationsByEvent = filteredRegistrations.reduce((acc, reg) => {
    if (!acc[reg.eventId]) {
      acc[reg.eventId] = {
        eventName: reg.eventName,
        registrations: []
      }
    }
    acc[reg.eventId].registrations.push(reg)
    return acc
  }, {} as Record<string, { eventName: string; registrations: Registration[] }>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Participants</h2>
          <p className="text-gray-400">
            Total: {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredRegistrations.length === 0}
          className="flex items-center space-x-2 bg-tech-accent text-tech-dark px-4 py-2 rounded-lg hover:bg-tech-accent/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchData}
            className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, event, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent outline-none"
            />
          </div>

          {/* Event Filter */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-4 py-3 bg-tech-dark border border-gray-700 rounded-lg text-white focus:border-tech-accent outline-none"
          >
            <option value="all">All Events</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Participants List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-tech-light border border-tech-accent/20 rounded-lg p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
          <p className="text-gray-400 text-center py-12">
            {searchTerm || selectedEvent !== 'all' 
              ? 'No participants found matching your filters.' 
              : 'No registrations yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedEvent === 'all' ? (
            // Group by event
            Object.entries(registrationsByEvent).map(([eventId, { eventName, registrations }]) => (
              <div key={eventId} className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-tech-accent" />
                    <span>{eventName}</span>
                  </h3>
                  <span className="text-sm text-gray-400">
                    {registrations.length} participant{registrations.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {registrations.map((reg) => (
                    <ParticipantCard 
                      key={reg.id} 
                      registration={reg} 
                      onDelete={handleDelete}
                      deleteLoading={deleteLoading}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Single event view
            <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Participants</h3>
              <div className="space-y-3">
                {filteredRegistrations.map((reg) => (
                  <ParticipantCard 
                    key={reg.id} 
                    registration={reg} 
                    onDelete={handleDelete}
                    deleteLoading={deleteLoading}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ParticipantCard({ 
  registration, 
  onDelete, 
  deleteLoading 
}: { 
  registration: Registration
  onDelete: (id: string, name: string) => void
  deleteLoading: string | null
}) {
  const isDeleting = deleteLoading === registration.id

  return (
    <div className="bg-tech-dark border border-gray-700 rounded-lg p-4 hover:border-tech-accent/50 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {/* Name */}
          <div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
              <UsersIcon className="w-3 h-3" />
              <span>Name</span>
            </div>
            <p className="text-white font-medium">{registration.studentName}</p>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </div>
            <p className="text-white text-sm break-all">{registration.studentEmail}</p>
          </div>

          {/* Department */}
          <div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
              <BookOpen className="w-3 h-3" />
              <span>Department</span>
            </div>
            <p className="text-white">{registration.department}</p>
          </div>

          {/* Year & Phone */}
          <div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
              <GraduationCap className="w-3 h-3" />
              <span>Year / Phone</span>
            </div>
            <p className="text-white">
              Year {registration.year}
              {registration.phone && (
                <span className="text-gray-400 text-sm block">{registration.phone}</span>
              )}
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(registration.id, registration.studentName)}
          disabled={isDeleting}
          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete participant"
        >
          <Trash2 className={`w-5 h-5 ${isDeleting ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Registration Date */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <span className="text-gray-400 text-xs">
          Registered: {registration.timestamp?.toDate 
            ? registration.timestamp.toDate().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : (registration.createdAt?.toDate 
              ? registration.createdAt.toDate().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'N/A')}
        </span>
      </div>
    </div>
  )
}
