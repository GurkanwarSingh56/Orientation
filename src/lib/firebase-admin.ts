/**
 * Firebase Admin SDK Configuration
 * This file should only be used in server-side code (API routes, server components)
 * DO NOT import this in client components
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getDatabase, Database } from 'firebase-admin/database'

let adminApp: App | undefined
let adminAuth: Auth | undefined
let adminDb: Firestore | undefined
let adminDatabase: Database | undefined

// Only initialize on server side
if (typeof window === 'undefined') {
  try {
    // Check if admin app is already initialized
    if (!getApps().length) {
      // Option 1: Using service account key file (recommended for development)
      // Place your service account JSON file in the project root (DO NOT commit it!)
      // adminApp = initializeApp({
      //   credential: cert('./service-account-key.json'),
      // })

      // Option 2: Using environment variables (recommended for production)
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      )

      if (
        process.env.FIREBASE_ADMIN_PROJECT_ID &&
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
        privateKey
      ) {
        adminApp = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        })
      } else {
        console.warn(
          'Firebase Admin SDK environment variables not found. Admin features will not be available.'
        )
      }
    } else {
      adminApp = getApps()[0]
    }

    if (adminApp) {
      adminAuth = getAuth(adminApp)
      adminDb = getFirestore(adminApp)
      adminDatabase = getDatabase(adminApp)
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error)
  }
}

export { adminApp, adminAuth, adminDb, adminDatabase }

/**
 * Verify Firebase ID token
 * Use this in API routes to verify authenticated requests
 */
export async function verifyIdToken(token: string) {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin not initialized')
    }
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Error verifying token:', error)
    throw error
  }
}

/**
 * Get user by UID
 */
export async function getUserByUid(uid: string) {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin not initialized')
    }
    const userRecord = await adminAuth.getUser(uid)
    return userRecord
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

/**
 * Set custom claims for a user
 * Use this to assign roles (admin, member, etc.)
 */
export async function setCustomUserClaims(
  uid: string,
  claims: Record<string, any>
) {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin not initialized')
    }
    await adminAuth.setCustomUserClaims(uid, claims)
  } catch (error) {
    console.error('Error setting custom claims:', error)
    throw error
  }
}
