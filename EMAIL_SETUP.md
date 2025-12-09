# Email Service Setup (Resend)

This guide will help you set up Resend to send verification codes and confirmation emails for TDPSA compliance.

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

## Step 2: Get API Key

1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Azul Pool Services")
4. Copy the API key (starts with `re_`)

## Step 3: Add Domain (Required for Production)

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `azulpools.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)

**Note:** For testing, Resend provides a test domain, but for production you'll need your own verified domain.

## Step 4: Set Environment Variables

Add these to your `.env.local` file (for local development):

```bash
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
COMPANY_NAME=Azul Pool Services
```

For Vercel production:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the same variables:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (use your verified domain)
   - `COMPANY_NAME`

## Step 5: Test Email Sending

1. Start your development server: `npm run dev`
2. Make a test request to the access endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/quotes/access \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com", "action": "request-code"}'
   ```
3. Check your email inbox for the verification code

## Email Templates

The system sends two types of emails:

### 1. Verification Code Email
- Sent when user requests data access
- Contains 6-digit verification code
- Expires in 15 minutes
- HTML and plain text versions

### 2. Deletion Confirmation Email
- Sent after data deletion is complete
- Confirms deletion to the user
- HTML and plain text versions

## Customization

To customize email templates, edit `/app/lib/email.ts`:

- Change email subject lines
- Modify HTML email design
- Update company name and branding
- Adjust email content

## Troubleshooting

### Emails not sending?
1. Check `RESEND_API_KEY` is set correctly
2. Verify your domain is verified in Resend
3. Check Resend dashboard for error logs
4. Ensure `RESEND_FROM_EMAIL` uses your verified domain

### Development mode
- If `RESEND_API_KEY` is not set, codes will be logged to console
- This allows development without email setup
- **Never deploy to production without email configured**

### Rate Limits
- Free tier: 100 emails/day
- Paid plans available for higher volume
- Check [Resend Pricing](https://resend.com/pricing)

## Security Notes

- ✅ Verification codes expire in 15 minutes
- ✅ Codes are single-use only
- ✅ Max 5 verification attempts per email
- ✅ Codes are never returned in API responses (only sent via email)
- ✅ All email sends are logged in audit trail

## Alternative Email Services

If you prefer a different email service, you can modify `/app/lib/email.ts`:

- **SendGrid**: Popular, good free tier
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Developer-friendly
- **Postmark**: Great deliverability

The email functions are abstracted, so switching services only requires updating the `sendVerificationCode` and `sendDeletionConfirmation` functions.

