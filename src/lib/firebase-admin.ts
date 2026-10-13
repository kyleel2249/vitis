import { createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Firebase ID-token verification implemented with `jose` + Google's public keys.
 *
 * Replaces the firebase-admin SDK for the only thing this app uses it for
 * (verifyIdToken). It runs on Node AND on Cloudflare Workers, needs only the
 * project id (no service-account private key), and keeps the same
 * `adminAuth.verifyIdToken(idToken)` API the login/register routes already call.
 */
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

function getProjectId(): string {
  const id = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!id) {
    throw new Error('Firebase project id is missing. Set FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID).');
  }
  return id;
}

export type DecodedFirebaseToken = {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  [claim: string]: unknown;
};

export const adminAuth = {
  async verifyIdToken(idToken: string): Promise<DecodedFirebaseToken> {
    const projectId = getProjectId();
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ['RS256'],
    });
    if (!payload.sub) throw new Error('Firebase token has no subject');
    return { ...payload, uid: payload.sub } as DecodedFirebaseToken;
  },
};
