import { NextRequest, NextResponse } from 'next/server';
import { createSession, validateSession, revokeCurrentSession } from '../../../lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_NAME = 'admin-auth';
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Rate limiting store for login attempts
const loginAttempts = new Map<string, { count: number; lockoutUntil: number }>();

// Simple password-based auth (for production, use proper auth like NextAuth)
function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD environment variable not set!');
    return false;
  }
  return password === ADMIN_PASSWORD;
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; lockoutUntil?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  // Check if locked out
  if (record && record.lockoutUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutUntil: record.lockoutUntil,
    };
  }

  // Reset if lockout expired
  if (record && record.lockoutUntil <= now) {
    loginAttempts.delete(identifier);
  }

  // Check current attempts
  if (record && record.count >= MAX_LOGIN_ATTEMPTS) {
    const lockoutUntil = now + LOCKOUT_DURATION;
    record.lockoutUntil = lockoutUntil;
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutUntil,
    };
  }

  return {
    allowed: true,
    remainingAttempts: record ? MAX_LOGIN_ATTEMPTS - record.count : MAX_LOGIN_ATTEMPTS,
  };
}

function recordFailedAttempt(identifier: string) {
  const record = loginAttempts.get(identifier);
  if (record) {
    record.count++;
  } else {
    loginAttempts.set(identifier, { count: 1, lockoutUntil: 0 });
  }
}

function clearAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    
    // Check rate limiting
    const rateLimit = checkRateLimit(identifier);
    if (!rateLimit.allowed) {
      const minutesRemaining = rateLimit.lockoutUntil 
        ? Math.ceil((rateLimit.lockoutUntil - Date.now()) / 60000)
        : 0;
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many failed attempts. Please try again in ${minutesRemaining} minute(s).` 
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (verifyPassword(password)) {
      // Clear failed attempts on successful login
      clearAttempts(identifier);
      
      // Generate secure signed session token
      const sessionToken = createSession();
      
      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
        path: '/', // Explicitly set path to root
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    } else {
      // Record failed attempt
      recordFailedAttempt(identifier);
      const rateLimitAfter = checkRateLimit(identifier);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid password',
          remainingAttempts: rateLimitAfter.remainingAttempts,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const isAuthenticated = await validateSession(request.cookies);
  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}

export async function DELETE(request: NextRequest) {
  await revokeCurrentSession();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}

