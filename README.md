# Azul Pool Services - Next.js Web Application

A comprehensive pool service quote management system built with Next.js, featuring dynamic pricing, TDPSA compliance, and a multi-step quote wizard.

## 📚 Documentation

**For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)**

The documentation covers:
- **Getting Started**: Installation, setup, and configuration
- **Application Overview**: Architecture and key features
- **Quote Flow**: Detailed walkthrough of the multi-step quote wizard
- **Pricing & Calculations**: Complete pricing engine documentation with examples
- **Security & Compliance**: TDPSA compliance, security features, and audit logging
- **API Reference**: All endpoints and data types
- **Deployment**: Vercel deployment guide
- **Troubleshooting**: Common issues and solutions

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (create `.env.local`):
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_QUOTES_BUCKET=quotes
   SUPABASE_AUDIT_BUCKET=audit-logs
   RESEND_API_KEY=re_your_resend_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   COMPANY_NAME=Azul Pool Services
   ADMIN_PASSWORD=your_secure_admin_password
   SESSION_SECRET=your_random_session_secret
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**: [http://localhost:3000](http://localhost:3000)

## Additional Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete application documentation
- **[COMPLIANCE.md](./COMPLIANCE.md)** - TDPSA compliance details
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Email service configuration guide

## Key Features

- ✅ Multi-step quote wizard with dynamic flow
- ✅ Real-time pricing calculations
- ✅ Residential & commercial support
- ✅ TDPSA compliance (data access, deletion, audit logging)
- ✅ Admin dashboard for quote management
- ✅ Secure authentication and rate limiting
- ✅ Email verification for data requests

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19
- **Storage**: Supabase Storage (private buckets)
- **Email**: Resend
- **Deployment**: Vercel

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [TDPSA Information](https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00004F.htm)
