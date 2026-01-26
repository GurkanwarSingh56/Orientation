/**
 * Firebase Authentication Helper Functions
 * Client-side authentication utilities
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  UserCredential,
} from 'firebase/auth'
import { auth } from './firebase'

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }

    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user)
    }

    return userCredential
  } catch (error: any) {
    console.error('Error signing up:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    console.error('Error signing in:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Sign in with Google (Popup)
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Sign in with Google (Redirect) - Better for mobile
 */
export async function signInWithGoogleRedirect(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Get redirect result after Google sign-in redirect
 */
export async function getGoogleRedirectResult(): Promise<UserCredential | null> {
  try {
    return await getRedirectResult(auth)
  } catch (error: any) {
    console.error('Error getting redirect result:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Sign out
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error('Error sending password reset email:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Update user password
 */
export async function changePassword(
  user: User,
  newPassword: string
): Promise<void> {
  try {
    await updatePassword(user, newPassword)
  } catch (error: any) {
    console.error('Error updating password:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  user: User,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> {
  try {
    await updateProfile(user, profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser
}

/**
 * Get user ID token
 */
export async function getUserIdToken(): Promise<string | null> {
  const user = auth.currentUser
  if (user) {
    return await user.getIdToken()
  }
  return null
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
  }

  return errorMessages[errorCode] || 'An error occurred. Please try again.'
}
