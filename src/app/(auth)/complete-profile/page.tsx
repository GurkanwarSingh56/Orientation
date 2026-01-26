'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createUserProfile } from '@/lib/user-utils'

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    department: '',
    year: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.department || !formData.year) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      // Update user profile with additional info
      await createUserProfile(user!.uid, {
        email: user!.email!,
        displayName: user!.displayName || 'User',
        department: formData.department,
        year: parseInt(formData.year),
        role: 'student',
      })

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error completing profile:', err)
      let errorMessage = 'Failed to complete profile. Please try again.'
      
      if (err.code === 'permission-denied') {
        errorMessage = 'Unable to save your profile. Please contact support.'
      } else if (err.code === 'unavailable') {
        errorMessage = 'Network error. Please check your internet connection.'
      } else if (err.code === 'unauthenticated') {
        errorMessage = 'Session expired. Please login again.'
        setTimeout(() => router.push('/login'), 2000)
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-tech-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-tech-accent rounded-lg flex items-center justify-center">
              <span className="text-tech-dark font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-white">
              Tech<span className="text-tech-accent">novate</span>
            </span>
          </div>
          <p className="text-gray-400">Complete Your Profile</p>
        </div>

        {/* Form */}
        <div className="bg-tech-light rounded-2xl border border-tech-accent/20 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Almost Done!</h2>
          <p className="text-gray-400 mb-6">
            Just a few more details to get started
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-gray-300 mb-2 text-sm">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-tech-dark border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-gray-300 mb-2 text-sm">
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-tech-dark border border-gray-700 text-white focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none transition"
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tech-accent text-tech-dark font-semibold py-3 rounded-lg hover:bg-tech-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Completing Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
