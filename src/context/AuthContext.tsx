'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserRole } from '@/lib/user-utils'

interface AuthContextType {
  user: User | null
  loading: boolean
  role: string | null
  isAdmin: boolean
  roleError: string | null
  retryFetchRole: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
  roleError: null,
  retryFetchRole: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const [roleError, setRoleError] = useState<string | null>(null)

  const fetchUserRole = async (userId: string) => {
    setRoleError(null)
    try {
      const userRole = await getUserRole(userId)
      setRole(userRole)
    } catch (error: any) {
      console.error('Error fetching user role:', error)
      const errorMessage = error.code === 'permission-denied'
        ? 'Unable to access user profile. Please contact support.'
        : error.code === 'unavailable'
        ? 'Network error. Please check your connection.'
        : 'Failed to load user role. Some features may be unavailable.'
      setRoleError(errorMessage)
      setRole(null)
    }
  }

  const retryFetchRole = () => {
    if (user) {
      fetchUserRole(user.uid)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Fetch user role from Firestore
        await fetchUserRole(user.uid)
      } else {
        setRole(null)
        setRoleError(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    role,
    isAdmin: role === 'admin',
    roleError,
    retryFetchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
