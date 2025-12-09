import { head, put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';
import { logAuditEvent } from '../../../lib/compliance';
import { QuoteState, QuotePricing } from '../../../quote/components/types';

export async function POST(request: NextRequest) {
  const isAuthenticated = await validateSession(request.cookies);

  if (!isAuthenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { pathname, pricing, status }: { pathname?: string; pricing?: QuotePricing; status?: QuoteState['status'] } =
      await request.json();

    if (!pathname) {
      return NextResponse.json({ success: false, error: 'pathname is required' }, { status: 400 });
    }

    const blob = await head(pathname);
    const response = await fetch(blob.url);
    const content = await response.text();
    const quoteData: QuoteState = JSON.parse(content);

    const nowIso = new Date().toISOString();
    const updatedQuote: QuoteState = {
      ...quoteData,
      pricing: pricing || quoteData.pricing,
      status: status || quoteData.status || 'updated',
      updatedAt: nowIso,
    };

    await put(pathname, JSON.stringify(updatedQuote, null, 2), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });

    logAuditEvent('access', {
      email: quoteData.email || quoteData.commercial?.email,
      pathname,
      ip: request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      success: true,
    }).catch(err => console.error('[AUDIT] Failed to log update:', err));

    return NextResponse.json({ success: true, data: updatedQuote }, { status: 200 });
  } catch (error) {
    console.error('[QUOTE] Failed to update quote pricing', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

