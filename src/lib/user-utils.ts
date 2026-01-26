/**
 * User utility functions for role management and user data
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export interface UserData {
  uid: string
  email: string
  displayName: string
  role: 'student' | 'admin' | 'member'
  department?: string
  year?: number
  phone?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Create user profile in Firestore after signup
 */
export async function createUserProfile(
  uid: string,
  data: {
    email: string
    displayName: string
    role?: 'student' | 'admin' | 'member'
    department?: string
    year?: number | string
  }
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    
    // Parse year to number if it's a string
    const yearValue = typeof data.year === 'string' ? parseInt(data.year) : data.year
    
    await setDoc(userRef, {
      uid,
      email: data.email,
      displayName: data.displayName,
      role: data.role || 'student',
      department: data.department || '',
      year: yearValue || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserData
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const userProfile = await getUserProfile(uid)
    return userProfile?.role || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const role = await getUserRole(uid)
    return role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  uid: string,
  role: 'student' | 'admin' | 'member'
): Promise<void> {
  try {
    await updateUserProfile(uid, { role })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}
