import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

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

  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value || !value.trim())
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Set these Cloudflare build environment variables: ${missing.join(', ')}.`
    );
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export default function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase is available only in the browser.');
  }

  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value || !value.trim())
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Set these Cloudflare build environment variables: ${missing.join(', ')}.`
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
