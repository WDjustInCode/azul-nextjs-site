# Testing Email Integration

## Quick Test

Once you've added your `RESEND_API_KEY`, test the email functionality:

### 1. Start Your Dev Server

```bash
npm run dev
```

### 2. Test Verification Code Email

Make a request to request a verification code:

```bash
curl -X POST http://localhost:3000/api/quotes/access \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "action": "request-code"}'
```

Or use a tool like Postman, or create a simple test page.

### 3. Check Your Email

- Check your inbox (and spam folder)
- You should receive an email with a 6-digit verification code
- The code expires in 15 minutes

### 4. Verify the Code

Once you have the code, verify it:

```bash
curl -X POST http://localhost:3000/api/quotes/access \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "action": "verify-code", "code": "123456"}'
```

Replace `123456` with the actual code from your email.

## Environment Variables Checklist

Make sure you have these set in `.env.local`:

```bash
RESEND_API_KEY=re_your_key_here          # ✅ Required
RESEND_FROM_EMAIL=noreply@yourdomain.com # Optional (defaults to noreply@yourdomain.com)
COMPANY_NAME=Azul Pool Services          # Optional (defaults to "Azul Pool Services")
```

**Important for Production:**
- `RESEND_FROM_EMAIL` must use a domain you've verified in Resend
- For testing, you can use Resend's test domain temporarily
- Check Resend dashboard for verified domains

## Troubleshooting

### Email not received?
1. Check spam/junk folder
2. Verify `RESEND_API_KEY` is correct
3. Check Resend dashboard for error logs
4. Ensure `RESEND_FROM_EMAIL` uses a verified domain (or test domain)

### Getting errors?
- Check server console for error messages
- Verify API key format (should start with `re_`)
- Make sure Resend account is active

### Testing without email?
- In development, if email fails, the code will be logged to console
- Check your terminal/server logs for the verification code

## Production Checklist

Before deploying:
- [ ] Resend API key added to Vercel environment variables
- [ ] Domain verified in Resend
- [ ] `RESEND_FROM_EMAIL` set to verified domain
- [ ] `COMPANY_NAME` set to your company name
- [ ] Test email sending in production environment
- [ ] Monitor Resend dashboard for delivery issues

