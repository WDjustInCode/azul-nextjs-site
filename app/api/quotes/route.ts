import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { QuoteState } from '../../quote/components/types';

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function validateQuoteData(data: any): data is QuoteState {
  // Basic validation - ensure required fields exist and are correct types
  if (!data || typeof data !== 'object') return false;
  
  // Validate segment
  if (data.segment && !['residential', 'commercial', null].includes(data.segment)) {
    return false;
  }
  
  // Validate serviceCategory if present
  if (data.serviceCategory && !['regular', 'equipment', 'filter', 'green', 'other'].includes(data.serviceCategory)) {
    return false;
  }
  
  // Validate email format if present
  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }
  }
  
  // Validate commercial data structure if present
  if (data.commercial) {
    if (typeof data.commercial !== 'object') return false;
    if (data.commercial.email && typeof data.commercial.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.commercial.email)) return false;
    }
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const quoteData: QuoteState = await request.json();

    // Validate quote data
    if (!validateQuoteData(quoteData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid quote data provided' },
        { status: 400 }
      );
    }

    // Generate a unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `quotes/quote-${timestamp}.json`;

    // Upload quote data to Vercel Blob as PRIVATE (secure)
    const blob = await put(filename, JSON.stringify(quoteData, null, 2), {
      access: 'private', // Changed to private for security
      contentType: 'application/json',
    });

    // Don't return the blob URL to client for security
    // Only return success confirmation
    return NextResponse.json(
      {
        success: true,
        message: 'Quote submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading quote to blob:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

