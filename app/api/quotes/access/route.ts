import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { logAuditEvent, generateVerificationCode, verifyCode } from '../../../lib/compliance';
import { validateSession } from '../../../lib/auth';
import { sendVerificationCode } from '../../../lib/email';

/**
 * TDPSA Compliance: Right to Access Personal Data
 * 
 * SECURITY: This endpoint requires email verification to prevent unauthorized access.
 * Two-step process:
 * 1. Request verification code (sends code to email)
 * 2. Verify code and get data (requires valid code)
 * 
 * OR admin can access directly with authentication
 */
export async function POST(request: NextRequest) {
  try {
    const { email, action, code } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP for audit logging
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if admin is authenticated (admins can bypass verification)
    const isAdmin = await validateSession(request.cookies);

    // Step 1: Request verification code
    if (action === 'request-code' || !action) {
      // Generate verification code
      const verificationCode = generateVerificationCode(email);
      
      // Send verification code via email
      const emailSent = await sendVerificationCode({ email, code: verificationCode });
      
      // Log verification code request
      logAuditEvent('access', {
        email,
        ip,
        userAgent,
        success: emailSent,
        error: emailSent ? undefined : 'Failed to send verification email',
      }).catch(err => console.error('[AUDIT] Failed to log:', err));

      if (!emailSent && process.env.NODE_ENV === 'development') {
        // In development, if email fails, return code for testing
        console.warn('[DEV] Email not sent. Verification code:', verificationCode);
        return NextResponse.json(
          {
            success: true,
            message: 'Verification code generated (email service not configured).',
            verificationCode, // Only in development
            nextStep: 'Use the verification code with action: "verify-code"',
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: emailSent,
          message: emailSent
            ? 'Verification code sent to your email. Please check your inbox and use the code to access your data.'
            : 'Failed to send verification email. Please contact support.',
          nextStep: emailSent ? 'Use the verification code with action: "verify-code"' : undefined,
        },
        { status: emailSent ? 200 : 500 }
      );
    }

    // Step 2: Verify code and return data (or admin can skip verification)
    if (action === 'verify-code') {
      if (!isAdmin && !code) {
        return NextResponse.json(
          { success: false, error: 'Verification code is required' },
          { status: 400 }
        );
      }

      // Verify code (skip if admin)
      if (!isAdmin && !verifyCode(email, code)) {
        logAuditEvent('access', {
          email,
          ip,
          userAgent,
          success: false,
          error: 'Invalid or expired verification code',
        }).catch(err => console.error('[AUDIT] Failed to log:', err));

        return NextResponse.json(
          { success: false, error: 'Invalid or expired verification code' },
          { status: 401 }
        );
      }

      // Code verified - fetch and return data
      const { blobs } = await list({
        prefix: 'quotes/',
        limit: 1000,
      });

      // Find quotes matching the email
      const matchingQuotes: any[] = [];
      
      for (const blob of blobs) {
        try {
          // Fetch blob content
          const response = await fetch(blob.url);
          const content = await response.text();
          const quoteData = JSON.parse(content);
          
          // Check if email matches
          if (
            quoteData.email?.toLowerCase() === email.toLowerCase() ||
            quoteData.commercial?.email?.toLowerCase() === email.toLowerCase()
          ) {
            matchingQuotes.push({
              pathname: blob.pathname,
              uploadedAt: blob.uploadedAt,
              data: quoteData,
            });
          }
        } catch (error) {
          // Skip blobs that can't be read
          console.error(`Error reading blob ${blob.pathname}:`, error);
        }
      }

      // Log successful access
      logAuditEvent('access', {
        email,
        ip,
        userAgent,
        success: true,
      }).catch(err => console.error('[AUDIT] Failed to log:', err));

      return NextResponse.json(
        {
          success: true,
          email,
          count: matchingQuotes.length,
          quotes: matchingQuotes,
          message: 'Data access request processed. TDPSA requires response within 30 days.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "request-code" or "verify-code"' },
      { status: 400 }
    );
  } catch (error) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    logAuditEvent('access', {
      ip,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }).catch(err => console.error('[AUDIT] Failed to log:', err));

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

