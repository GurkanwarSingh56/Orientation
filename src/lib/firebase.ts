import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { getDatabase, Database } from 'firebase/database'

// Firebase configuration from environment variables
// These are replaced at build time by Next.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
}

// Validate that Firebase config has required values
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error(
    'Missing required Firebase configuration. Please check your .env.local file and restart the dev server.'
  )
}

// Initialize Firebase only if it hasn't been initialized yet
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let database: Database

try {

  // Check if Firebase is already initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  database = getDatabase(app)

  // Optional: Set Firebase Auth language to user's preference
  // auth.languageCode = 'en' // or use auth.useDeviceLanguage()

} catch (error) {
  console.error('Error initializing Firebase:', error)
  throw error
}

export { app, auth, db, storage, database }

// Export Firebase configuration for reference (without sensitive data)
export const getFirebaseConfig = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
})
