'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { logOut } from '@/lib/firebase-auth'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user, role, isAdmin, roleError, retryFetchRole } = useAuth()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    setLoggingOut(true)
    setLogoutError('')
    try {
      await logOut()
      router.push('/login')
    } catch (error: any) {
      console.error('Error logging out:', error)
      const errorMessage = error.code === 'network-request-failed'
        ? 'Network error. Please check your connection and try again.'
        : 'Failed to logout. Please try again.'
      setLogoutError(errorMessage)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-tech-dark">
      {/* Navigation */}
      <nav className="bg-tech-light border-b border-tech-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-tech-accent rounded-lg flex items-center justify-center">
                <span className="text-tech-dark font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">
                Tech<span className="text-tech-accent">novate</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <a
                  href="/admin"
                  className="px-4 py-2 bg-tech-accent/10 text-tech-accent rounded-lg hover:bg-tech-accent/20 transition-colors"
                >
                  Admin Panel
                </a>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-4 py-2 bg-tech-accent text-tech-dark font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Role Error Banner */}
        {roleError && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{roleError}</span>
            </div>
            <button
              onClick={retryFetchRole}
              className="ml-4 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded transition text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Logout Error Banner */}
        {logoutError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {logoutError}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {user?.displayName || 'Student'}!
          </h1>
          <p className="text-gray-400">
            Role: <span className="text-tech-accent capitalize">{role}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-tech-light rounded-xl border border-tech-accent/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Events Attended</h3>
              <svg className="w-8 h-8 text-tech-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">12</p>
          </div>

          <div className="bg-tech-light rounded-xl border border-tech-accent/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Projects</h3>
              <svg className="w-8 h-8 text-tech-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">5</p>
          </div>

          <div className="bg-tech-light rounded-xl border border-tech-accent/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Certificates</h3>
              <svg className="w-8 h-8 text-tech-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">8</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-tech-light rounded-xl border border-tech-accent/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Role</p>
              <p className="text-white capitalize">{role}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Email Verified</p>
              <p className="text-white">{user?.emailVerified ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white">
                {user?.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
