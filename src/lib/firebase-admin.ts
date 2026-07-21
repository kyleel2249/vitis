import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

/**
 * Parse the Firebase private key robustly.
 * Handles the common case where Replit stores the key with literal \n sequences
 * instead of actual newline characters, and strips any accidental wrapping quotes.
 */
function parsePrivateKey(raw: string): string {
  // Strip surrounding quotes if the user accidentally included them
  let key = raw.trim().replace(/^["']|["']$/g, '');

  // Replace literal \n (two chars) with actual newlines — the most common issue
  // when copying the private_key value out of the Firebase JSON file
  key = key.replace(/\\n/g, '\n');

  // If the key is still a single line with no newlines but contains the PEM markers,
  // it may have been stored with spaces instead of newlines — reconstruct it
  if (!key.includes('\n') && key.includes('-----')) {
    const headerMatch = key.match(/(-----BEGIN [^-]+-----)/);
    const footerMatch = key.match(/(-----END [^-]+-----)/);
    const bodyMatch  = key.match(/-----BEGIN [^-]+-----([A-Za-z0-9+/=\s]+)-----END/);
    if (headerMatch && footerMatch && bodyMatch) {
      const body = bodyMatch[1].replace(/\s+/g, '').match(/.{1,64}/g)?.join('\n') ?? bodyMatch[1];
      key = `${headerMatch[1]}\n${body}\n${footerMatch[1]}\n`;
    }
  }

  return key;
}

function initAdmin() {
  if (getApps().length > 0) return getAuth();

  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId   = process.env.FIREBASE_PROJECT_ID;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      'Firebase Admin env vars are missing. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  const privateKey = parsePrivateKey(rawKey);

  try {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch (err: any) {
    throw new Error(
      `Firebase Admin failed to initialize — the private key could not be parsed. ` +
      `Make sure you copied the full "private_key" value (including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----) ` +
      `from the Firebase service account JSON. Original error: ${err.message}`
    );
  }

  return getAuth();
}

export const adminAuth = initAdmin();
