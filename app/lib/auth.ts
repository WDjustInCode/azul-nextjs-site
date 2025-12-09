import { cookies } from 'next/headers';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin-auth';
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'change-me';
const SESSION_DURATION = 60 * 60 * 24 * 1000; // 24 hours

// In-memory session store (for production with multiple instances, use Redis)
const validSessions = new Map<string, number>(); // token -> expiration timestamp

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, expires] of validSessions.entries()) {
    if (expires < now) {
      validSessions.delete(token);
    }
  }
}, 60 * 1000); // Clean every minute

function signToken(token: string): string {
  const hmac = createHmac('sha256', SESSION_SECRET);
  hmac.update(token);
  return `${token}.${hmac.digest('hex')}`;
}

function verifySignedToken(signedToken: string): string | null {
  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;
  
  const [token, signature] = parts;
  const expectedSignature = signToken(token).split('.')[1];
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    const tokenBuf = Buffer.from(signature, 'hex');
    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    if (tokenBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(tokenBuf, expectedBuf)) return null;
    return token;
  } catch {
    return null;
  }
}

export function createSession(): string {
  const token = randomBytes(32).toString('hex');
  const expires = Date.now() + SESSION_DURATION;
  validSessions.set(token, expires);
  return signToken(token);
}

export async function validateSession(requestCookies?: { get: (name: string) => { value: string } | undefined }): Promise<boolean> {
  let cookieValue: string | undefined;
  
  if (requestCookies) {
    // If request cookies are provided (from API route), use them
    const authCookie = requestCookies.get(COOKIE_NAME);
    cookieValue = authCookie?.value;
  } else {
    // Otherwise use Next.js cookies() helper (for server components)
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(COOKIE_NAME);
    cookieValue = authCookie?.value;
  }
  
  if (!cookieValue) {
    return false;
  }
  
  // Verify signature
  const token = verifySignedToken(cookieValue);
  if (!token) {
    return false;
  }
  
  // Check if token is in valid sessions
  const expires = validSessions.get(token);
  if (!expires) {
    // In development, if signature is valid but session not in store (e.g., after server restart),
    // we'll accept it and re-add to the store. In production, you should use persistent session storage.
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
      // Re-add to session store with default expiration
      const newExpires = Date.now() + SESSION_DURATION;
      validSessions.set(token, newExpires);
      return true;
    } else {
      return false;
    }
  }
  
  // Check expiration
  if (expires < Date.now()) {
    validSessions.delete(token);
    return false;
  }
  
  return true;
}

export function revokeSession(token: string): void {
  validSessions.delete(token);
}

export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  
  if (authCookie?.value) {
    const token = verifySignedToken(authCookie.value);
    if (token) {
      revokeSession(token);
    }
  }
}

