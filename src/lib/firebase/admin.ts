import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    adminApp = existing[0];
  } else {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      console.log('Firebase Admin: Initializing with explicit credentials.', { projectId, emailLen: clientEmail.length, keyLen: privateKey.length });
      adminApp = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId,
      });
    } else {
      // Fallback: initialize without explicit credentials (for environments with default creds)
      console.warn('Firebase Admin: Missing credentials, initializing with defaults', {
        hasProject: !!projectId,
        hasEmail: !!clientEmail,
        hasKey: !!privateKey
      });
      adminApp = initializeApp({ projectId });
    }
  }

  return adminApp;
}

export function getAdminFirestore(): Firestore {
  if (adminDb) return adminDb;
  getAdminApp();
  adminDb = getFirestore();
  return adminDb;
}
