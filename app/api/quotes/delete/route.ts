import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent, generateVerificationCode, verifyCode } from '../../../lib/compliance';
import { validateSession } from '../../../lib/auth';
import { sendDeletionConfirmation, sendDeletionVerificationCode } from '../../../lib/email';
import { deleteQuote, downloadQuote, listQuotes } from '../../../lib/storage';

/**
 * TDPSA Compliance: Right to Delete Personal Data
 * 
 * SECURITY: This endpoint supports two methods:
 * 1. Self-service deletion with email verification (two-step process)
 * 2. Admin deletion (requires admin authentication)
 * 
 * Self-service process:
 * - Step 1: Request verification code (sends code to email)
 * - Step 2: Verify code and delete data (requires valid code)
 */
export async function POST(request: NextRequest) {
  try {
    const { email, action, code, confirm } = await request.json();
    
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
    const isAdmin = await validateSession();

    // Step 1: Request verification code (self-service)
    if (action === 'request-code' || (!action && !isAdmin)) {
      // Generate verification code
      const verificationCode = generateVerificationCode(email);
      
      // Send verification code via email
      const emailSent = await sendDeletionVerificationCode({ email, code: verificationCode });
      
      // Log verification code request
      logAuditEvent('delete', {
        email,
        ip,
        userAgent,
        success: emailSent,
        error: emailSent ? undefined : 'Failed to send verification email',
      }).catch(err => console.error('[AUDIT] Failed to log:', err));

      if (!emailSent && process.env.NODE_ENV === 'development') {
        // In development, if email fails, return code for testing
        console.warn('[DEV] Email not sent. Deletion verification code:', verificationCode);
        return NextResponse.json(
          {
            success: true,
            message: 'Verification code generated (email service not configured).',
            verificationCode, // Only in development
            nextStep: 'Use the verification code with action: "verify-code" and confirm: true',
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: emailSent,
          message: emailSent
            ? 'Verification code sent to your email. Please check your inbox and use the code to confirm deletion.'
            : 'Failed to send verification email. Please contact support.',
          nextStep: emailSent ? 'Use the verification code with action: "verify-code" and confirm: true' : undefined,
        },
        { status: emailSent ? 200 : 500 }
      );
    }

    // Step 2: Verify code and delete data (self-service) OR admin deletion
    if (action === 'verify-code' || isAdmin) {
      // For self-service, require verification code
      if (!isAdmin) {
        if (!code) {
          return NextResponse.json(
            { success: false, error: 'Verification code is required' },
            { status: 400 }
          );
        }

        // Verify code
        if (!verifyCode(email, code)) {
          logAuditEvent('delete', {
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
      }

      // Require explicit confirmation for deletion
      if (confirm !== true) {
        return NextResponse.json(
          { success: false, error: 'Deletion must be confirmed. Set confirm: true' },
          { status: 400 }
        );
      }

      // List all quotes
      const objects = await listQuotes();

    // Find and delete quotes matching the email
    const deletedQuotes: string[] = [];
    const errors: string[] = [];
    const emailLower = email.toLowerCase();
    
    console.log(`[DELETE] Searching for quotes with email: ${email}`);
    console.log(`[DELETE] Total objects to check: ${objects.length}`);
    
    for (const obj of objects) {
      try {
        const quoteData = await downloadQuote<any>(obj.pathname);
        
        // Debug: log the structure of each quote
        const quoteEmail = quoteData.email?.toLowerCase();
        const commercialEmail = quoteData.commercial?.email?.toLowerCase();
        
        console.log(`[DELETE] Checking object ${obj.pathname}:`, {
          hasEmail: !!quoteData.email,
          email: quoteData.email,
          hasCommercial: !!quoteData.commercial,
          commercialEmail: quoteData.commercial?.email,
        });
        
        // Check if email matches (residential or commercial)
        const emailMatches = quoteEmail === emailLower || commercialEmail === emailLower;
        
        if (emailMatches) {
          console.log(`[DELETE] Match found! Deleting ${obj.pathname}`);
          // Delete the stored object
          await deleteQuote(obj.pathname);
          deletedQuotes.push(obj.pathname);
        }
      } catch (error) {
        const errorMsg = `Error processing ${obj.pathname}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`[DELETE] ${errorMsg}`, error);
      }
    }
    
    console.log(`[DELETE] Deletion complete. Deleted ${deletedQuotes.length} quote(s)`);

    // Log deletion for compliance
    logAuditEvent('delete', {
      email,
      ip,
      userAgent,
      success: deletedQuotes.length > 0,
      error: errors.length > 0 ? errors.join('; ') : undefined,
    }).catch(err => console.error('[AUDIT] Failed to log:', err));

    // Send deletion confirmation email
    if (deletedQuotes.length > 0) {
      await sendDeletionConfirmation({ email });
    }

    return NextResponse.json(
      {
        success: true,
        email,
        deletedCount: deletedQuotes.length,
        deletedQuotes,
        errors: errors.length > 0 ? errors : undefined,
        message: 'Data deletion request processed. TDPSA requires response within 30 days. Confirmation email sent.',
      },
      { status: 200 }
    );
    }

    // Invalid action
    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "request-code" or "verify-code" (or authenticate as admin)' },
      { status: 400 }
    );
  } catch (error) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    logAuditEvent('delete', {
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

