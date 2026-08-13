import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config';

/**
 * Signs in user anonymously for participant tracking
 */
export async function signInAnonymouslyUser(): Promise<User> {
  try {
    if (auth.currentUser) {
      return auth.currentUser;
    }
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase Anonymous Auth Error:', error);
    throw error;
  }
}

/**
 * Subscribes to Firebase Auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Returns current authenticated user or null
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
