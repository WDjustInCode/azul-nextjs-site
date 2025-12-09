import { head } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';
import { logAuditEvent } from '../../../lib/compliance';

export async function GET(request: NextRequest) {
  // Check authentication - pass request cookies to read from request
  const isAuthenticated = await validateSession(request.cookies);
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const pathname = searchParams.get('pathname');

    if (!pathname) {
      return NextResponse.json(
        { success: false, error: 'pathname parameter is required' },
        { status: 400 }
      );
    }

    // Get blob metadata
    const blob = await head(pathname);

    // Fetch the actual content
    const response = await fetch(blob.url);
    const content = await response.text();

    let quoteData;
    try {
      quoteData = JSON.parse(content);
    } catch {
      quoteData = content;
    }

    // Log admin viewing for compliance audit trail
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    logAuditEvent('view', {
      email: quoteData.email || quoteData.commercial?.email,
      pathname: blob.pathname,
      ip,
      userAgent,
      success: true,
    }).catch(err => console.error('[AUDIT] Failed to log:', err));

    return NextResponse.json(
      {
        success: true,
        blob: {
          pathname: blob.pathname,
          url: blob.url,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          contentType: blob.contentType,
        },
        data: quoteData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting blob:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

