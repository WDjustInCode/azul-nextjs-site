import { Resend } from 'resend';

// Initialize Resend (will use RESEND_API_KEY from environment)
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationCodeParams {
  email: string;
  code: string;
}

/**
 * Send verification code email to user
 */
export async function sendVerificationCode({ email, code }: SendVerificationCodeParams): Promise<boolean> {
  // If no API key, log and return false (for development)
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set. Verification code:', code);
    console.warn('[EMAIL] In production, set RESEND_API_KEY to send emails.');
    return false;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
    const companyName = process.env.COMPANY_NAME || 'Azul Pool Services';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your ${companyName} Data Access Verification Code`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #0070f3; margin-top: 0;">Data Access Request</h1>
              <p>You requested access to your personal data. Use the verification code below to complete your request.</p>
            </div>
            
            <div style="background-color: #ffffff; border: 2px solid #0070f3; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code is:</p>
              <h2 style="font-size: 32px; letter-spacing: 8px; color: #0070f3; margin: 10px 0; font-family: 'Courier New', monospace;">${code}</h2>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 15 minutes</p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you did not request access to your data, please ignore this email. 
                The verification code will expire automatically.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p style="margin: 5px 0;">
                This email was sent in response to a data access request under the Texas Data Privacy and Security Act (TDPSA).
              </p>
              <p style="margin: 5px 0;">
                ${companyName}<br>
                San Antonio, TX
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Data Access Request

You requested access to your personal data. Use the verification code below to complete your request.

Your verification code is: ${code}

This code expires in 15 minutes.

Security Notice: If you did not request access to your data, please ignore this email. The verification code will expire automatically.

This email was sent in response to a data access request under the Texas Data Privacy and Security Act (TDPSA).

${companyName}
San Antonio, TX
      `,
    });

    if (error) {
      console.error('[EMAIL] Error sending verification code:', error);
      return false;
    }

    console.log('[EMAIL] Verification code sent successfully to', email);
    return true;
  } catch (error) {
    console.error('[EMAIL] Exception sending verification code:', error);
    return false;
  }
}

/**
 * Send deletion verification code email to user
 */
export async function sendDeletionVerificationCode({ email, code }: SendVerificationCodeParams): Promise<boolean> {
  // If no API key, log and return false (for development)
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set. Deletion verification code:', code);
    console.warn('[EMAIL] In production, set RESEND_API_KEY to send emails.');
    return false;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
    const companyName = process.env.COMPANY_NAME || 'Azul Pool Services';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your ${companyName} Data Deletion Verification Code`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #dc3545; margin-top: 0;">Data Deletion Request</h1>
              <p>You requested deletion of your personal data. Use the verification code below to confirm and complete the deletion.</p>
            </div>
            
            <div style="background-color: #ffffff; border: 2px solid #dc3545; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code is:</p>
              <h2 style="font-size: 32px; letter-spacing: 8px; color: #dc3545; margin: 10px 0; font-family: 'Courier New', monospace;">${code}</h2>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 15 minutes</p>
            </div>
            
            <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #721c24;">
                <strong>⚠️ Warning:</strong> This action cannot be undone. Once you confirm deletion, all your quote data will be permanently removed from our systems.
              </p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you did not request deletion of your data, please ignore this email. 
                The verification code will expire automatically.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p style="margin: 5px 0;">
                This email was sent in response to a data deletion request under the Texas Data Privacy and Security Act (TDPSA).
              </p>
              <p style="margin: 5px 0;">
                ${companyName}<br>
                San Antonio, TX
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Data Deletion Request

You requested deletion of your personal data. Use the verification code below to confirm and complete the deletion.

Your verification code is: ${code}

This code expires in 15 minutes.

⚠️ Warning: This action cannot be undone. Once you confirm deletion, all your quote data will be permanently removed from our systems.

Security Notice: If you did not request deletion of your data, please ignore this email. The verification code will expire automatically.

This email was sent in response to a data deletion request under the Texas Data Privacy and Security Act (TDPSA).

${companyName}
San Antonio, TX
      `,
    });

    if (error) {
      console.error('[EMAIL] Error sending deletion verification code:', error);
      return false;
    }

    console.log('[EMAIL] Deletion verification code sent successfully to', email);
    return true;
  } catch (error) {
    console.error('[EMAIL] Exception sending deletion verification code:', error);
    return false;
  }
}

/**
 * Send data deletion confirmation email
 */
export async function sendDeletionConfirmation({ email }: { email: string }): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set. Skipping deletion confirmation email.');
    return false;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
    const companyName = process.env.COMPANY_NAME || 'Azul Pool Services';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your ${companyName} Data Has Been Deleted`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #0070f3; margin-top: 0;">Data Deletion Confirmation</h1>
              <p>This email confirms that your personal data has been deleted from our systems as requested.</p>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #155724;">
                <strong>✓ Deletion Complete</strong><br>
                All quote data associated with ${email} has been permanently deleted.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p style="margin: 5px 0;">
                This deletion was processed in response to your request under the Texas Data Privacy and Security Act (TDPSA).
              </p>
              <p style="margin: 5px 0;">
                ${companyName}<br>
                San Antonio, TX
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Data Deletion Confirmation

This email confirms that your personal data has been deleted from our systems as requested.

✓ Deletion Complete
All quote data associated with ${email} has been permanently deleted.

This deletion was processed in response to your request under the Texas Data Privacy and Security Act (TDPSA).

${companyName}
San Antonio, TX
      `,
    });

    if (error) {
      console.error('[EMAIL] Error sending deletion confirmation:', error);
      return false;
    }

    console.log('[EMAIL] Deletion confirmation sent successfully to', email);
    return true;
  } catch (error) {
    console.error('[EMAIL] Exception sending deletion confirmation:', error);
    return false;
  }
}

interface SendQuoteEmailParams {
  to: string | string[];
  subject: string;
  customerName?: string;
  breakdownLines?: string[];
  summary?: {
    subtotal?: number;
    monthlyTotal?: number;
    isOneTime?: boolean;
  };
}

/**
 * Send a quote email to customer + internal team.
 */
export async function sendQuoteEmail({
  to,
  subject,
  customerName,
  breakdownLines = [],
  summary,
}: SendQuoteEmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set. Quote email would have been sent to:', to);
    return false;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'quotes@azulpoolservices.com';
    const companyName = process.env.COMPANY_NAME || 'Azul Pool Services';
    const toArray = Array.isArray(to) ? to : [to];

    const breakdownHtml = breakdownLines.length
      ? `<ul>${breakdownLines.map(line => `<li>${line}</li>`).join('')}</ul>`
      : '<p>No pricing breakdown provided.</p>';

    const summaryHtml = summary
      ? `
        <p><strong>Summary</strong></p>
        <ul>
          ${summary.subtotal !== undefined ? `<li>Subtotal: $${summary.subtotal.toFixed(2)}</li>` : ''}
          ${summary.monthlyTotal !== undefined ? `<li>${summary.isOneTime ? 'Total' : 'Monthly'} Total: $${summary.monthlyTotal.toFixed(2)}</li>` : ''}
        </ul>
      `
      : '';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toArray,
      subject,
      html: `
        <!doctype html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color:#0c6efd;">${companyName} Quote</h2>
          <p>Hello${customerName ? ` ${customerName}` : ''},</p>
          <p>Your quote is ready. Details are below.</p>
          ${summaryHtml}
          <p><strong>Pricing Breakdown</strong></p>
          ${breakdownHtml}
          <p style="margin-top:20px;">Thanks,<br/>${companyName} Team</p>
        </body>
        </html>
      `,
      text: `Your ${companyName} quote is ready.\n\nBreakdown:\n${breakdownLines.join('\n')}\n\n${summary ? `Subtotal: $${summary.subtotal?.toFixed(2) || ''}\nTotal: $${summary.monthlyTotal?.toFixed(2) || ''}\n` : ''}`,
    });

    if (error) {
      console.error('[EMAIL] Error sending quote email:', error);
      return false;
    }

    console.log('[EMAIL] Quote email sent to', toArray.join(', '));
    return true;
  } catch (err) {
    console.error('[EMAIL] Exception sending quote email:', err);
    return false;
  }
}

