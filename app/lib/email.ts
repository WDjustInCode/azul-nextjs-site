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

interface SendQuoteNotificationParams {
  quoteData: {
    address?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    segment?: "residential" | "commercial" | null;
    serviceCategory?: string | null;
    serviceCategoryOther?: string;
    poolType?: string;
    poolTypeOther?: string;
    equipmentSelections?: string[];
    equipmentOther?: string;
    specialFlags?: {
      aboveGroundPool?: boolean;
      saltwaterPool?: boolean;
      treesOverPool?: boolean;
      otherNote?: string;
    };
    poolSize?: string;
    commercial?: {
      email: string;
      company: string;
      message: string;
    };
    pricing?: {
      monthlyTotal?: number;
      breakdown?: string[];
    };
  };
}

/**
 * Send quote request notification email to internal team
 */
export async function sendQuoteNotification({
  quoteData,
}: SendQuoteNotificationParams): Promise<boolean> {
  const recipientEmail = 'hello@azulpoolservices.com';

  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set. Quote notification would have been sent to:', recipientEmail);
    console.warn('[EMAIL] Quote data:', JSON.stringify(quoteData, null, 2));
    return false;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'quotes@azulpoolservices.com';
    const companyName = process.env.COMPANY_NAME || 'Azul Pool Services';

    // Format customer name
    const customerName = quoteData.firstName || quoteData.lastName
      ? `${quoteData.firstName || ''} ${quoteData.lastName || ''}`.trim()
      : 'Customer';

    // Format service category
    const serviceCategory = quoteData.serviceCategory
      ? quoteData.serviceCategory.charAt(0).toUpperCase() + quoteData.serviceCategory.slice(1)
      : 'Not specified';

    // Format special flags
    const flags = quoteData.specialFlags || {};
    const specialFlagsList: string[] = [];
    if (flags.aboveGroundPool) specialFlagsList.push('Above-ground pool');
    if (flags.saltwaterPool) specialFlagsList.push('Saltwater pool');
    if (flags.treesOverPool) specialFlagsList.push('Trees over pool');
    if (flags.otherNote) specialFlagsList.push(`Other: ${flags.otherNote}`);

    // Format pricing info
    const pricingHtml = quoteData.pricing
      ? `
        <div style="background-color: #e7f3ff; border-left: 4px solid #0c6efd; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #0c6efd;">Pricing Estimate</h3>
          ${quoteData.pricing.breakdown && quoteData.pricing.breakdown.length > 0
            ? `<ul style="margin: 10px 0; padding-left: 20px;">${quoteData.pricing.breakdown.map(item => `<li>${item}</li>`).join('')}</ul>`
            : ''}
          ${quoteData.pricing.monthlyTotal
            ? `<p style="margin: 10px 0 0 0;"><strong>Estimated Monthly Total: $${quoteData.pricing.monthlyTotal.toFixed(2)}</strong></p>`
            : ''}
        </div>
      `
      : '';

    // Format commercial vs residential info
    const serviceDetailsHtml = quoteData.segment === 'commercial' && quoteData.commercial
      ? `
        <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #002147;">Commercial Service Request</h3>
          <p><strong>Company:</strong> ${quoteData.commercial.company}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${quoteData.commercial.message}</p>
        </div>
      `
      : `
        <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #002147;">Service Details</h3>
          <p><strong>Service Category:</strong> ${serviceCategory}${quoteData.serviceCategoryOther ? ` (${quoteData.serviceCategoryOther})` : ''}</p>
          ${quoteData.poolType ? `<p><strong>Pool Type:</strong> ${quoteData.poolType.charAt(0).toUpperCase() + quoteData.poolType.slice(1).replace(/-/g, ' ')}${quoteData.poolTypeOther ? ` (${quoteData.poolTypeOther})` : ''}</p>` : ''}
          ${quoteData.poolSize ? `<p><strong>Pool Size:</strong> ${quoteData.poolSize.charAt(0).toUpperCase() + quoteData.poolSize.slice(1)}</p>` : ''}
          ${quoteData.equipmentSelections && quoteData.equipmentSelections.length > 0
            ? `<p><strong>Equipment:</strong> ${quoteData.equipmentSelections.map(e => e.charAt(0).toUpperCase() + e.slice(1).replace(/-/g, ' ')).join(', ')}${quoteData.equipmentOther ? `, ${quoteData.equipmentOther}` : ''}</p>`
            : ''}
          ${specialFlagsList.length > 0
            ? `<p><strong>Special Conditions:</strong> ${specialFlagsList.join(', ')}</p>`
            : ''}
        </div>
      `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: quoteData.email || quoteData.commercial?.email,
      subject: `New Quote Request from ${customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #0c6efd; margin-top: 0;">New Quote Request</h1>
              <p>A new quote request has been submitted through the website.</p>
            </div>
            
            <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #002147; margin-top: 0; font-size: 18px;">Customer Information</h2>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${customerName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${quoteData.email || quoteData.commercial?.email || 'N/A'}" style="color: #0052CC;">${quoteData.email || quoteData.commercial?.email || 'N/A'}</a></p>
              ${quoteData.phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${quoteData.phone}" style="color: #0052CC;">${quoteData.phone}</a></p>` : ''}
              ${quoteData.address ? `<p style="margin: 10px 0;"><strong>Address:</strong> ${quoteData.address}</p>` : ''}
            </div>
            
            ${serviceDetailsHtml}
            
            ${pricingHtml}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p style="margin: 5px 0;">
                This email was sent from the quote wizard on ${companyName} website.
              </p>
              <p style="margin: 5px 0;">
                You can reply directly to this email to respond to ${customerName}.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
New Quote Request

A new quote request has been submitted through the website.

Customer Information:
Name: ${customerName}
Email: ${quoteData.email || quoteData.commercial?.email || 'N/A'}
${quoteData.phone ? `Phone: ${quoteData.phone}` : ''}
${quoteData.address ? `Address: ${quoteData.address}` : ''}

${quoteData.segment === 'commercial' && quoteData.commercial
  ? `Commercial Service Request:
Company: ${quoteData.commercial.company}
Message: ${quoteData.commercial.message}`
  : `Service Details:
Service Category: ${serviceCategory}${quoteData.serviceCategoryOther ? ` (${quoteData.serviceCategoryOther})` : ''}
${quoteData.poolType ? `Pool Type: ${quoteData.poolType}${quoteData.poolTypeOther ? ` (${quoteData.poolTypeOther})` : ''}` : ''}
${quoteData.poolSize ? `Pool Size: ${quoteData.poolSize}` : ''}
${quoteData.equipmentSelections && quoteData.equipmentSelections.length > 0 ? `Equipment: ${quoteData.equipmentSelections.join(', ')}${quoteData.equipmentOther ? `, ${quoteData.equipmentOther}` : ''}` : ''}
${specialFlagsList.length > 0 ? `Special Conditions: ${specialFlagsList.join(', ')}` : ''}`}

${quoteData.pricing
  ? `Pricing Estimate:
${quoteData.pricing.breakdown && quoteData.pricing.breakdown.length > 0 ? quoteData.pricing.breakdown.join('\n') : ''}
${quoteData.pricing.monthlyTotal ? `Estimated Monthly Total: $${quoteData.pricing.monthlyTotal.toFixed(2)}` : ''}`
  : ''}

---
This email was sent from the quote wizard on ${companyName} website.
You can reply directly to this email to respond to ${customerName}.
      `,
    });

    if (error) {
      console.error('[EMAIL] Error sending quote notification:', error);
      return false;
    }

    console.log('[EMAIL] Quote notification sent successfully to', recipientEmail);
    return true;
  } catch (error) {
    console.error('[EMAIL] Exception sending quote notification:', error);
    return false;
  }
}

interface SendContactFormParams {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Send contact form submission email
 */
export async function sendContactForm({
  name,
  email,
  phone,
  message,
}: SendContactFormParams): Promise<boolean> {
  // Use test email for testing, production email for production
  // Can be overridden with CONTACT_EMAIL environment variable
  const recipientEmail = process.env.CONTACT_EMAIL || 
    (process.env.NODE_ENV === 'production' 
      ? 'hello@azulpoolservices.com' 
      : 'justblocker@icloud.com');

  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set. Contact form submission:');
    console.warn('[EMAIL] Name:', name);
    console.warn('[EMAIL] Email:', email);
    console.warn('[EMAIL] Phone:', phone || 'N/A');
    console.warn('[EMAIL] Message:', message);
    return false;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
    const companyName = process.env.COMPANY_NAME || 'Azul Pool Services';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #0052CC; margin-top: 0;">New Contact Form Submission</h1>
              <p>You have received a new message through the contact form on your website.</p>
            </div>
            
            <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #002147; margin-top: 0; font-size: 18px;">Contact Information</h2>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0052CC;">${email}</a></p>
              ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #0052CC;">${phone}</a></p>` : ''}
            </div>
            
            <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #002147; margin-top: 0; font-size: 18px;">Message</h2>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p style="margin: 5px 0;">
                This email was sent from the contact form on ${companyName} website.
              </p>
              <p style="margin: 5px 0;">
                You can reply directly to this email to respond to ${name}.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

You have received a new message through the contact form on your website.

Contact Information:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
This email was sent from the contact form on ${companyName} website.
You can reply directly to this email to respond to ${name}.
      `,
    });

    if (error) {
      console.error('[EMAIL] Error sending contact form:', error);
      return false;
    }

    console.log('[EMAIL] Contact form submission sent successfully to', recipientEmail);
    return true;
  } catch (error) {
    console.error('[EMAIL] Exception sending contact form:', error);
    return false;
  }
}

