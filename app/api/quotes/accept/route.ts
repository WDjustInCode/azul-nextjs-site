import { head, put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';
import { logAuditEvent } from '../../../lib/compliance';
import { sendQuoteEmail } from '../../../lib/email';
import { QuotePricing, QuoteState } from '../../../quote/components/types';

export async function POST(request: NextRequest) {
  const isAuthenticated = await validateSession(request.cookies);

  if (!isAuthenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      pathname,
      pricing,
    }: {
      pathname?: string;
      pricing?: QuotePricing;
    } = await request.json();

    if (!pathname) {
      return NextResponse.json({ success: false, error: 'pathname is required' }, { status: 400 });
    }

    const blob = await head(pathname);
    const response = await fetch(blob.url);
    const content = await response.text();
    const quoteData: QuoteState = JSON.parse(content);

    const customerEmail = quoteData.email || quoteData.commercial?.email;
    if (!customerEmail) {
      return NextResponse.json({ success: false, error: 'Quote has no customer email' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const mergedPricing = pricing || quoteData.pricing;

    const updatedQuote: QuoteState = {
      ...quoteData,
      pricing: mergedPricing,
      status: 'accepted',
      updatedAt: nowIso,
      acceptedAt: nowIso,
    };

    await put(pathname, JSON.stringify(updatedQuote, null, 2), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });

    const breakdownLines = mergedPricing?.breakdown || [];
    const summary = mergedPricing
      ? {
          subtotal: mergedPricing.subtotal,
          monthlyTotal: mergedPricing.monthlyTotal,
          isOneTime: mergedPricing.isOneTime,
        }
      : undefined;

    await sendQuoteEmail({
      to: [customerEmail, 'justin@justinception.studio'],
      subject: 'Your Azul Pool Services Quote',
      customerName: quoteData.firstName,
      breakdownLines,
      summary,
    });

    logAuditEvent('access', {
      email: customerEmail,
      pathname,
      ip: request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      success: true,
    }).catch(err => console.error('[AUDIT] Failed to log accept:', err));

    return NextResponse.json({ success: true, data: updatedQuote }, { status: 200 });
  } catch (error) {
    console.error('[QUOTE] Failed to accept quote', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

