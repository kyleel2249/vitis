import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signOut, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

function missingConfig(): string[] {
  return Object.entries(firebaseConfig)
    .filter(([, value]) => !value || !value.trim())
    .map(([key]) => key);
}

/** True when all public Firebase variables are present (browser or server). */
export function isFirebaseConfigured(): boolean {
  return missingConfig().length === 0;
}

/**
 * Initialize Firebase Auth only when a browser action needs it.
 * Next.js prerenders Client Components on the server during builds, so
 * initializing Firebase at module scope can break builds when public
 * Firebase environment variables are not present in the build environment.
 */
export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Authentication is available only in the browser.');
  }

  const missing = missingConfig();
  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Set these build environment variables: ${missing.join(', ')}.`
    );
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

/**
 * Sign out of Firebase when a Firebase session may exist.
 * Direct email/password users never initialize Firebase, so this must never
 * throw: logout always has to proceed to clear the server session cookie.
 */
export async function signOutFirebase(): Promise<void> {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) return;
  try {
    await signOut(getFirebaseAuth());
  } catch {
    /* no Firebase session — continue with server logout */
  }
}

export default function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase is available only in the browser.');
  }

  const missing = missingConfig();
  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Set these build environment variables: ${missing.join(', ')}.`
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
