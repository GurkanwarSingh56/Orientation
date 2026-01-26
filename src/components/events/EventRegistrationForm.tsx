'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface EventRegistrationFormProps {
  eventId: string
  eventName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EventRegistrationForm({
  eventId,
  eventName,
  onSuccess,
  onCancel,
}: EventRegistrationFormProps) {
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
          eventId,
          eventName,
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
        onSuccess?.()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to register for event')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
        <p className="text-gray-400">You've been registered for {eventName}</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">Register for Event</h3>
      <p className="text-gray-400 mb-6">{eventName}</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            Email Address
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
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-accent transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-2">
            College/University Name <span className="text-tech-accent">*</span>
          </label>
          <input
            id="college"
            name="college"
            type="text"
            value={formData.college}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-accent transition-colors"
            placeholder="e.g., Rayat Bahra University"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
            Department/Branch <span className="text-tech-accent">*</span>
          </label>
          <input
            id="department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-accent transition-colors"
            placeholder="e.g., Computer Science & Engineering"
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
            className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-tech-accent transition-colors"
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
            id="studentId"
            name="studentId"
            type="text"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-accent transition-colors"
            placeholder="e.g., CS2023001"
          />
        </div>

        <div>
          <label htmlFor="whyJoin" className="block text-sm font-medium text-gray-300 mb-2">
            Why do you want to join this event? (Optional)
          </label>
          <textarea
            id="whyJoin"
            name="whyJoin"
            value={formData.whyJoin}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-tech-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-accent transition-colors resize-none"
            placeholder="Tell us what excites you about this event..."
          />
        </div>

        <div className="bg-tech-dark/50 rounded-lg p-4 border border-tech-accent/20">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Note:</strong> Your registration details will be saved securely. 
            You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-tech-accent text-tech-dark font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Confirm Registration'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-gray-500 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
