import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config';

/**
 * Signs in user anonymously for participant tracking.
 * Provides seamless fallback ID if Anonymous Auth is disabled in Firebase Console.
 */
export async function signInAnonymouslyUser(): Promise<{ uid: string; isFallback?: boolean }> {
  try {
    if (auth.currentUser) {
      return { uid: auth.currentUser.uid };
    }
    const userCredential = await signInAnonymously(auth);
    return { uid: userCredential.user.uid };
  } catch (error: any) {
    // If Anonymous Auth is not toggled ON in Firebase Console yet
    if (error?.code === 'auth/configuration-not-found') {
      console.warn(
        '⚠️ Firebase Anonymous Auth is not enabled in Firebase Console. Using local session identity fallback.'
      );
    } else {
      console.warn('Firebase Anonymous Auth notice:', error?.message || error);
    }

    // Persistent local browser fallback UID
    let fallbackId = typeof window !== 'undefined' ? localStorage.getItem('technovate_fallback_uid') : null;
    if (!fallbackId) {
      fallbackId = 'usr_' + Math.random().toString(36).substring(2, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem('technovate_fallback_uid', fallbackId);
      }
    }
    return { uid: fallbackId, isFallback: true };
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
