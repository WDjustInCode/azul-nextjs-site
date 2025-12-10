# Azul Pool Services - Client Operations Guide

**Complete Guide to Operating Your Pool Service Quote Website**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Site Overview](#site-overview)
3. [Understanding the Quote Flow](#understanding-the-quote-flow)
4. [Pricing Engine & Calculations](#pricing-engine--calculations)
5. [Email System](#email-system)
6. [Admin Dashboard Operations](#admin-dashboard-operations)
7. [Managing Quotes](#managing-quotes)
8. [Compliance & Privacy Features](#compliance--privacy-features)
9. [Daily Operations](#daily-operations)
10. [Troubleshooting](#troubleshooting)
11. [Important Notes & Best Practices](#important-notes--best-practices)

---

## Introduction

This guide is designed to help you understand and operate your Azul Pool Services website. The site is a comprehensive quote management system that allows customers to request pool service quotes through an interactive wizard, and provides you with an admin dashboard to manage those quotes.

**Key Capabilities:**
- Multi-step quote wizard that guides customers through service selection
- Automatic pricing calculations based on pool size, type, and special conditions
- Secure admin dashboard to review, edit, and accept quotes
- Automated email system for sending quotes to customers
- Full compliance with Texas Data Privacy and Security Act (TDPSA)
- Audit logging for all data access and modifications

---

## Site Overview

### What Your Site Does

Your website serves as a **digital quote request system** for pool services. Here's the flow:

1. **Customer visits your site** → Enters their address and contact information
2. **Customer selects service type** → Regular maintenance, equipment repair, filter cleaning, green-to-clean, or other
3. **Customer provides pool details** → Size, type (pool only, pool+spa, hot tub), special conditions
4. **System calculates price** → Automatically generates a quote based on selections
5. **Quote is stored** → Saved securely in your system
6. **You review in admin dashboard** → View, edit pricing if needed, and accept quotes
7. **Email sent to customer** → When you accept, customer receives quote via email

### Key Pages

- **Homepage** (`/`) - Main landing page with service information
- **Quote Wizard** (`/quote`) - Multi-step form where customers request quotes
- **Admin Dashboard** (`/admin/quotes`) - Your secure dashboard to manage quotes
- **Privacy Page** (`/privacy`) - Customer data access and deletion tools

---

## Understanding the Quote Flow

### Customer Journey

The quote flow is a **multi-step wizard** that adapts based on customer selections. Here's how it works:

#### Step 1: Address Entry
- Customer enters their service address using Google Places autocomplete
- Option to enter address manually if autocomplete doesn't work
- Address is validated and stored

#### Step 2: Contact Information
- **First Name** (required)
- **Last Name** (required)
- **Email** (required - needed for compliance and quote delivery)
- **Phone** (optional)

#### Step 3: Residential or Commercial
Customer selects their segment:
- **Residential** → Continues to service type selection
- **Commercial** → Goes to commercial form (company name, email, message)

#### Step 4: Service Type Selection (Residential Only)
Customer chooses from:
- **Regular Service** - Full-service weekly pool maintenance
- **Equipment Service** - Equipment repair/replacement
- **Filter/Salt Cell Service** - Filter or salt cell cleaning
- **Green to Clean** - Emergency green pool rescue (requires on-site visit)
- **Other Service** - Other service types

#### Step 5: Pool Details (Varies by Service Type)

**For Regular, Equipment, and Filter Services:**

1. **Pool Type Selection:**
   - Pool Only
   - Pool + Spa
   - Hot Tub Only
   - Other

2. **Special Conditions:**
   - Above Ground Pool (shows special notice)
   - Saltwater Pool
   - Trees Over Pool

3. **Pool Size:**
   - Small (≤15,000 gallons)
   - Medium (15,000-25,000 gallons)
   - Large (≥25,000 gallons)

**For Equipment Service:**
- Additional step: Equipment selection (pump, filter, heater, salt system, automation, other)

**For Green to Clean:**
- Skips pool details (requires on-site visit)
- Goes directly to email capture

#### Step 6: Email Confirmation
- Final email capture/confirmation
- Customer submits quote

#### Step 7: Thank You Page
- Confirmation that quote was submitted
- Displays customer's address

### Special Flow Cases

**Above Ground Pools:**
- Shows special notice explaining limited service options (chemical-only, no cleaning)
- Then proceeds to email capture

**Hot Tub Only:**
- Skips special flags and pool size steps
- Goes directly to email capture

**Commercial Customers:**
- Simplified form: Company name, email, message
- No pricing calculation (manual quote required)

### Quote States

Each quote has a status:
- **Pending** - Newly submitted, not yet reviewed
- **Updated** - Pricing has been manually adjusted
- **Accepted** - Quote approved and email sent to customer

---

## Pricing Engine & Calculations

### Overview

The pricing engine automatically calculates quotes based on:
- Service category (regular, equipment, filter, green, other)
- Pool size (small, medium, large)
- Pool type (pool only, pool+spa, hot tub, other)
- Special conditions (saltwater, trees over pool, above ground)
- Equipment selections (for equipment service)

### Base Pricing Structure

#### Service Category Base Prices

| Service Category | Base Price | Service Type | Notes |
|-----------------|------------|--------------|-------|
| **Regular** | $210/month | Recurring | Weekly full-service maintenance, medium in-ground pool |
| **Equipment** | $150 | One-time | Base job anchor (trip + first hour) |
| **Filter** | $150/month | Recurring | Weekly chemical-only/light service, medium pool |
| **Green** | $350 | One-time | One-time green-to-clean baseline (small/medium scenario) |
| **Other** | $210 | Recurring | Defaults to regular pricing |

**Important:** Regular, Filter, and Other are **recurring services** (monthly pricing). Equipment and Green are **one-time services**.

### Size Multipliers

Pool size affects the base price:

| Pool Size | Multiplier | Gallons | Example (Regular Service) |
|-----------|------------|---------|---------------------------|
| **Small** | 0.90 | ≤15,000 | ~$190/month |
| **Medium** | 1.0 | 15,000-25,000 | $210/month (baseline) |
| **Large** | 1.095 | ≥25,000 | ~$230/month |

**Calculation:** `adjustedPrice = basePrice × sizeMultiplier`

### Pool Type Adjustments

Pool type affects pricing:

| Pool Type | Multiplier | Notes |
|-----------|------------|-------|
| **Pool Only** | 1.0 | Standard pricing |
| **Pool + Spa** | 1.15 | 15% premium for combo |
| **Hot Tub Only** | 0.6 | 40% discount (smaller volume) |
| **Other** | 1.0 | Standard pricing |

**Calculation:** `adjustedPrice = adjustedPrice × poolTypeMultiplier`

### Special Condition Fees

Additional fees for special conditions (recurring services only):

| Condition | Monthly Fee | Notes |
|-----------|-------------|-------|
| **Saltwater Pool** | $0 | Neutral (cost difference in salt-cell maintenance) |
| **Trees Over Pool** | +$20/month | Extra time/chemicals for heavy debris |
| **Above Ground Pool** | -$20/month | Discount vs. in-ground baseline |

**Note:** These fees are added/subtracted from the monthly total for recurring services.

### Equipment Service Pricing

Equipment services use per-item pricing:

| Equipment Type | Price |
|---------------|-------|
| Pool Pump | $120 |
| Pool Filter | $100 |
| Pool Heater | $150 |
| Salt System | $110 |
| Automation System | $180 |
| Other / Not Sure | $130 |

**Calculation:** `equipmentTotal = sum of selected equipment prices`

### Frequency Variants (Recurring Services Only)

For recurring services (Regular, Filter, Other), the system calculates alternative frequencies:

| Frequency | Calculation | Notes |
|-----------|-------------|-------|
| **Weekly** | Base monthly price | Standard service |
| **Bi-Weekly** | Monthly × 0.65 | Every other week estimate |
| **Monthly** | Monthly × 0.4 | Once per month estimate |

**Note:** These are display-only estimates. The primary price shown is for weekly service.

### Complete Pricing Calculation Flow

```
1. Start with base price for service category
   ↓
2. Apply pool size multiplier
   ↓
3. Apply pool type multiplier
   ↓
4. Add special condition fees (recurring only)
   ↓
5. Add equipment fees (equipment service only)
   ↓
6. Calculate subtotal
   ↓
7. Generate frequency variants (recurring only)
   ↓
8. Create pricing breakdown
```

### Example Calculations

#### Example 1: Regular Service - Medium Pool, Pool Only, No Special Conditions

```
Base Price: $210 (regular, medium)
Size Multiplier: 1.0 (medium)
Pool Type: 1.0 (pool only)
Special Fees: $0

Calculation:
$210 × 1.0 × 1.0 + $0 = $210/month

Frequency Variants:
- Weekly: $210/month
- Bi-Weekly: $136.50/month
- Monthly: $84/month
```

#### Example 2: Regular Service - Large Pool, Pool+Spa, Trees Over Pool

```
Base Price: $210 (regular, medium baseline)
Size Multiplier: 1.095 (large)
Pool Type: 1.15 (pool+spa)
Special Fees: +$20 (trees over pool)

Calculation:
$210 × 1.095 × 1.15 + $20
= $230.00 × 1.15 + $20
= $264.50 + $20
= $284.50/month
```

#### Example 3: Equipment Service - Pool Pump + Filter, Medium Pool

```
Base Price: $150 (equipment base)
Size Multiplier: 1.0 (medium)
Pool Type: 1.0 (pool only)
Equipment: $120 (pump) + $100 (filter) = $220

Calculation:
$150 + $220 = $370 (one-time estimate)
```

#### Example 4: Green to Clean - Small Pool

```
Base Price: $350 (green baseline)
Size Multiplier: 0.90 (small)

Calculation:
$350 × 0.90 = $315 (one-time estimate)
```

### Pricing Breakdown Format

The pricing engine generates a detailed breakdown that appears in quotes:

```
Base regular service (weekly, medium pool): $210.00
Pool size (large): +$19.95
Pool type (pool-spa): +$34.50
Trees over pool: +$20.00/month
---
Standard weekly service: $284.50/month
If serviced every other week: ~$184.93/month
If serviced once per month: ~$113.80/month
```

### Adjusting Pricing

**In Admin Dashboard:**
- You can manually edit any pricing field
- Changes are saved to the quote
- When you accept, the updated pricing is sent to the customer

**To Change Base Prices:**
- Requires code changes (contact your developer)
- Base prices are in `app/utils/pricing.ts`

---

## Email System

### Overview

Your site uses **Resend** as the email service provider. Emails are sent automatically in specific scenarios and can be customized.

### Email Types

#### 1. Quote Acceptance Email

**When Sent:** When you click "Accept & Email" in the admin dashboard

**Recipients:**
- Customer (email from quote)
- Internal team email (currently: `justin@justinception.studio`)

**Content:**
- Customer name (if available)
- Complete pricing breakdown
- Summary with subtotal and total
- Professional HTML formatting

**Subject:** "Your Azul Pool Services Quote"

**Example:**
```
Hello John,

Your quote is ready. Details are below.

Summary
- Subtotal: $284.50
- Monthly Total: $284.50

Pricing Breakdown
- Base regular service (weekly, medium pool): $210.00
- Pool size (large): +$19.95
- Pool type (pool-spa): +$34.50
- Trees over pool: +$20.00/month
- Standard weekly service: $284.50/month
- If serviced every other week: ~$184.93/month
- If serviced once per month: ~$113.80/month

Thanks,
Azul Pool Services Team
```

#### 2. Data Access Verification Code

**When Sent:** When a customer requests access to their data (privacy compliance)

**Recipients:** Customer email

**Content:**
- 6-digit verification code
- 15-minute expiration notice
- Security warnings

**Subject:** "Your Azul Pool Services Data Access Verification Code"

#### 3. Data Deletion Verification Code

**When Sent:** When a customer requests deletion of their data

**Recipients:** Customer email

**Content:**
- 6-digit verification code
- Warning about permanent deletion
- 15-minute expiration notice

**Subject:** "Your Azul Pool Services Data Deletion Verification Code"

#### 4. Data Deletion Confirmation

**When Sent:** After customer confirms data deletion

**Recipients:** Customer email

**Content:**
- Confirmation that data was deleted
- Compliance notice

**Subject:** "Your Azul Pool Services Data Has Been Deleted"

### Email Configuration

**Required Environment Variables:**
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Email address to send from (e.g., `quotes@azulpoolservices.com`)
- `COMPANY_NAME` - Your company name (defaults to "Azul Pool Services")

**Important:** 
- The "from" email must be verified in your Resend account
- For production, use a domain email (not Gmail/Yahoo)
- Set up SPF and DKIM records for better deliverability

### Email Delivery

- Emails are sent asynchronously (don't block the request)
- If email fails, the action still completes (quote is still accepted)
- Check Resend dashboard for delivery status
- Failed emails are logged in server logs

### Customizing Email Templates

Email templates are in `app/lib/email.ts`. To customize:
1. Edit the HTML content in the email functions
2. Update company branding
3. Adjust formatting and colors
4. Test thoroughly before deploying

---

## Admin Dashboard Operations

### Accessing the Dashboard

1. Navigate to `/admin/quotes` on your website
2. Enter your admin password
3. Click "Login"

**Security:**
- Password is set via `ADMIN_PASSWORD` environment variable
- Sessions expire after 24 hours
- Rate limiting: 5 failed attempts, 15-minute lockout
- HTTP-only cookies (secure)

### Dashboard Overview

The admin dashboard has two main sections:

#### Left Panel: Quote List
- Shows all submitted quotes
- Displays filename, upload date, and file size
- Click any quote to view details
- "Refresh List" button to reload quotes

#### Right Panel: Quote Details
- Shows full quote information when a quote is selected
- Displays customer information, service selections, and pricing
- Allows editing pricing
- Actions: "Save Pricing" and "Accept & Email"

### Key Features

#### 1. Viewing Quotes

**To view a quote:**
1. Click on any quote in the left panel
2. Quote details appear in the right panel
3. Shows:
   - Customer contact information
   - Service selections
   - Pool details
   - Calculated pricing
   - Status (pending, updated, accepted)
   - Timestamps (created, updated, accepted)

**Quote Status Indicators:**
- **Pending** - New quote, not yet reviewed
- **Updated** - Pricing has been manually adjusted
- **Accepted** - Quote approved and email sent

#### 2. Editing Pricing

**When to Edit:**
- If automatic calculation seems incorrect
- For special cases or discounts
- To adjust for market conditions
- For commercial quotes (no auto-pricing)

**How to Edit:**
1. Select a quote
2. Scroll to "Pricing (editable)" section
3. Edit any field:
   - Base price
   - Size adjustment
   - Pool type adjustment
   - Special condition fees
   - Equipment fees
   - Subtotal
   - Monthly total
   - Frequency variants (weekly, bi-weekly, monthly)
   - Breakdown text
4. Click "Save Pricing"
5. Quote status changes to "updated"

**Important:** 
- Changes are saved immediately
- Original calculated pricing is preserved in breakdown
- You can always revert to original calculation

#### 3. Accepting Quotes

**When to Accept:**
- After reviewing quote details
- When pricing is correct (or after editing)
- When ready to send quote to customer

**How to Accept:**
1. Select a quote
2. Review all details
3. Edit pricing if needed (optional)
4. Click "Accept & Email"
5. System will:
   - Update quote status to "accepted"
   - Send email to customer with quote details
   - Send copy to internal team email
   - Log the action in audit logs

**After Acceptance:**
- Quote status changes to "accepted"
- "Accepted At" timestamp is recorded
- Customer receives email within seconds
- You'll see confirmation message

#### 4. Audit Logs

**Purpose:** Track all data access, modifications, and compliance actions

**To View:**
1. Click "Show Audit Logs" button
2. Logs appear in a table
3. Filter by email address (optional)
4. Click "Refresh" to reload

**What's Logged:**
- **Access** - Data access requests (compliance)
- **Delete** - Data deletion requests (compliance)
- **View** - Admin viewing quotes
- **Accept** - Quote acceptance actions

**Log Information:**
- Timestamp
- Action type
- Email address (if applicable)
- IP address
- Success/failure status
- Error messages (if failed)

**Use Cases:**
- Compliance audits
- Security monitoring
- Troubleshooting customer issues
- Tracking quote acceptance rates

### Logout

Click "Logout" button in top right to end your session.

---

## Managing Quotes

### Daily Workflow

**Recommended Process:**

1. **Morning Review**
   - Log into admin dashboard
   - Review new quotes from overnight
   - Check for any urgent requests (green-to-clean, equipment)

2. **Quote Processing**
   - Click each quote to review details
   - Verify customer information is complete
   - Check if pricing calculation is appropriate
   - Edit pricing if needed for special cases

3. **Acceptance**
   - Accept quotes that are ready
   - System automatically emails customer
   - Monitor for any email delivery issues

4. **Follow-up**
   - Check email for customer responses
   - Update quote status if needed
   - Track in your CRM or system

### Quote Status Management

**Pending → Updated:**
- When you manually adjust pricing
- Click "Save Pricing" to update status

**Pending/Updated → Accepted:**
- When quote is ready to send to customer
- Click "Accept & Email"
- Cannot be undone (but you can create new quote)

### Handling Special Cases

#### Commercial Quotes
- No automatic pricing
- Review message from customer
- Manually set pricing in admin dashboard
- Add custom breakdown text

#### Green-to-Clean Requests
- Requires on-site visit
- Quote is estimate only
- Contact customer to schedule visit
- Update pricing after visit if needed

#### Above Ground Pools
- Limited service options
- Chemical-only service
- Discount applied automatically
- May need to adjust if customer wants different service

#### Equipment Service
- Base price + equipment costs
- Review equipment selections
- May need to adjust if multiple items or complex work

### Quote Organization

**Current System:**
- Quotes stored by timestamp
- Filename format: `quote-YYYY-MM-DDTHH-MM-SS-sssZ.json`
- No built-in categorization

**Recommendations:**
- Use timestamps to identify recent quotes
- Check "Created At" date for prioritization
- Use search/filter by email if needed
- Consider exporting to spreadsheet for tracking

---

## Compliance & Privacy Features

### Texas Data Privacy and Security Act (TDPSA)

Your site is fully compliant with TDPSA requirements. This means:

#### Consumer Rights

1. **Right to Access Personal Data**
   - Customers can request all their data
   - Available at `/privacy` page
   - Two-step email verification required
   - Data returned immediately (within 30 days required)

2. **Right to Delete Personal Data**
   - Customers can request deletion
   - Available at `/privacy` page
   - Two-step email verification required
   - Deletion processed immediately (within 30 days required)

3. **Right to Correct Data**
   - Available via contact email
   - Manual process (contact support)

4. **Right to Opt-Out**
   - Available via contact email
   - Manual process (contact support)

### Privacy Page (`/privacy`)

**Features:**
- Privacy policy
- Data access request form
- Data deletion request form
- Clear instructions for customers

**Customer Process:**
1. Enter email address
2. Receive verification code via email
3. Enter code to verify identity
4. Access data or confirm deletion

### Audit Logging

**What's Logged:**
- All data access requests
- All data deletion requests
- All admin actions (viewing, accepting quotes)
- IP addresses and timestamps
- Success/failure status

**Purpose:**
- Compliance audits
- Security monitoring
- Troubleshooting
- Legal requirements

**Access:**
- Available in admin dashboard
- Filter by email address
- Export for records (manual process)

### Data Retention

**Policy:**
- Data retained for 7 years (standard business records)
- Automatic expiration check available
- Manual cleanup process

**Important:**
- Don't delete quotes manually unless customer requests
- Keep records for business purposes
- Compliance deletion is separate from business records

---

## Daily Operations

### Morning Routine

1. **Check Admin Dashboard**
   - Log in at `/admin/quotes`
   - Review new quotes from last 24 hours
   - Prioritize urgent requests

2. **Process Quotes**
   - Review each quote for completeness
   - Verify pricing calculations
   - Edit pricing for special cases
   - Accept ready quotes

3. **Monitor Email**
   - Check for customer responses
   - Verify quote emails were delivered
   - Follow up on any issues

### Weekly Tasks

1. **Review Audit Logs**
   - Check for any unusual activity
   - Review data access/deletion requests
   - Ensure compliance

2. **Quote Analysis**
   - Review quote acceptance rates
   - Identify common service requests
   - Note pricing adjustments needed

3. **System Maintenance**
   - Check Resend email delivery stats
   - Review any error logs
   - Verify environment variables are set

### Monthly Tasks

1. **Compliance Review**
   - Review all data access/deletion requests
   - Ensure timely responses
   - Update privacy policy if needed

2. **Pricing Review**
   - Analyze pricing adjustments made
   - Consider updating base prices if needed
   - Review market competitiveness

3. **Performance Review**
   - Check quote submission volume
   - Review conversion rates
   - Identify improvement opportunities

### Best Practices

**Quote Processing:**
- Process quotes within 24 hours when possible
- Respond to urgent requests (green-to-clean) immediately
- Keep pricing consistent unless special circumstances
- Document any manual adjustments

**Customer Communication:**
- Quote emails are sent automatically
- Follow up with phone call for high-value quotes
- Respond to customer questions promptly
- Update quote if customer requests changes

**Data Management:**
- Don't delete quotes unless customer requests
- Keep audit logs for compliance
- Respond to data requests within 30 days (system does immediately)
- Maintain backup of important quotes

---

## Troubleshooting

### Common Issues

#### 1. Cannot Log Into Admin Dashboard

**Symptoms:**
- Password not working
- "Invalid password" error

**Solutions:**
- Verify `ADMIN_PASSWORD` environment variable is set correctly
- Check for typos (password is case-sensitive)
- Wait 15 minutes if locked out (after 5 failed attempts)
- Clear browser cookies and try again
- Contact developer if issue persists

#### 2. Quotes Not Appearing in Dashboard

**Symptoms:**
- Dashboard shows "No quotes found"
- Quotes not loading

**Solutions:**
- Click "Refresh List" button
- Check if quotes are being submitted (test submission)
- Verify Supabase env vars are set (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- Ensure Supabase Storage buckets exist (`quotes`, `audit-logs`)
- Check browser console for errors

#### 3. Email Not Sending

**Symptoms:**
- Customer didn't receive quote email
- "Accept & Email" completes but no email

**Solutions:**
- Check `RESEND_API_KEY` is set correctly
- Verify `RESEND_FROM_EMAIL` is verified in Resend account
- Check Resend dashboard for delivery status
- Check spam folder
- Verify customer email address is correct
- Check server logs for email errors

#### 4. Pricing Calculation Incorrect

**Symptoms:**
- Price seems too high or too low
- Missing adjustments

**Solutions:**
- Review quote details (size, type, special conditions)
- Check if all fields were selected correctly
- Manually adjust pricing in admin dashboard
- Verify base prices are correct (may need developer)
- Check breakdown text for calculation steps

#### 5. Customer Cannot Access Their Data

**Symptoms:**
- Customer says verification code not received
- Data access request fails

**Solutions:**
- Verify email service is configured
- Check spam folder
- Verify email address matches exactly (case-insensitive)
- Check verification code expiration (15 minutes)
- Review audit logs for errors
- Customer can try again (new code generated)

#### 6. Quote Submission Fails

**Symptoms:**
- Customer sees error when submitting
- "Too many requests" error

**Solutions:**
- Rate limiting: 5 requests per minute per IP
- Customer should wait 1 minute and try again
- Check if email is provided (required)
- Verify all required fields are filled
- Check browser console for errors
- Review server logs

### Getting Help

**For Technical Issues:**
1. Check browser console for errors
2. Check Vercel logs (if deployed on Vercel)
3. Review audit logs in admin dashboard
4. Check environment variables are set
5. Contact developer with error details

**For Business Questions:**
- Review this guide
- Check pricing examples
- Consult with team
- Document any needed changes

**For Compliance Questions:**
- Review compliance documentation
- Check audit logs
- Consult legal counsel if needed
- Review TDPSA requirements

---

## Important Notes & Best Practices

### Security

**Admin Password:**
- Use a strong, unique password
- Don't share password
- Change password periodically
- Store password securely

**Session Management:**
- Sessions expire after 24 hours
- Log out when done
- Don't leave dashboard open on shared computers

**Data Protection:**
- All data encrypted in transit (HTTPS)
- All data encrypted at rest (Supabase Storage)
- No direct URL exposure to customers
- Audit logging for all access

### Pricing

**Consistency:**
- Use automatic calculations when possible
- Document any manual adjustments
- Keep pricing competitive
- Review market rates periodically

**Adjustments:**
- Only adjust when necessary
- Note reason for adjustment
- Keep breakdown text clear
- Update base prices if market changes significantly

### Customer Experience

**Response Time:**
- Process quotes within 24 hours
- Respond to urgent requests immediately
- Follow up on high-value quotes
- Keep communication professional

**Quote Accuracy:**
- Review all details before accepting
- Verify customer information
- Check pricing calculations
- Edit if needed before sending

**Email Delivery:**
- Monitor email delivery rates
- Check spam folder issues
- Verify email addresses
- Follow up if customer doesn't receive email

### Compliance

**Data Requests:**
- Respond to data access requests promptly
- Process deletions immediately
- Keep audit logs
- Document any issues

**Privacy Policy:**
- Keep privacy policy updated
- Ensure contact information is current
- Review compliance requirements annually
- Consult legal counsel for changes

### System Maintenance

**Environment Variables:**
- Keep all variables set correctly
- Don't expose API keys
- Rotate keys periodically
- Document all variables

**Monitoring:**
- Check email delivery regularly
- Review error logs
- Monitor quote submission volume
- Track acceptance rates

**Updates:**
- Keep system updated
- Test changes before deploying
- Backup important data
- Document any customizations

---

## Quick Reference

### Admin Dashboard URL
`https://yourdomain.com/admin/quotes`

### Key Environment Variables
- `ADMIN_PASSWORD` - Admin dashboard password
- `RESEND_API_KEY` - Email service API key
- `RESEND_FROM_EMAIL` - Email address for sending
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_QUOTES_BUCKET` - Quotes bucket name (default `quotes`)
- `SUPABASE_AUDIT_BUCKET` - Audit bucket name (default `audit-logs`)
- `COMPANY_NAME` - Your company name

### Quote Statuses
- **Pending** - New quote, not reviewed
- **Updated** - Pricing manually adjusted
- **Accepted** - Quote approved, email sent

### Service Categories
- **Regular** - Weekly maintenance ($210/month base)
- **Equipment** - Equipment repair ($150 base + equipment)
- **Filter** - Filter/salt cell cleaning ($150/month base)
- **Green** - Green-to-clean rescue ($350 base)
- **Other** - Other services ($210 base)

### Pool Sizes
- **Small** - ≤15,000 gallons (0.90 multiplier)
- **Medium** - 15,000-25,000 gallons (1.0 multiplier)
- **Large** - ≥25,000 gallons (1.095 multiplier)

### Special Conditions
- **Saltwater Pool** - $0/month (neutral)
- **Trees Over Pool** - +$20/month
- **Above Ground Pool** - -$20/month

### Support Contacts

**Technical Support:**
- Developer: [Your developer contact]
- Vercel Support: [If using Vercel]
- Resend Support: [For email issues]

**Business Questions:**
- Review this guide
- Check pricing documentation
- Consult with team

---

## Conclusion

This guide covers everything you need to operate your Azul Pool Services website effectively. The system is designed to be user-friendly while providing powerful features for quote management and compliance.

**Key Takeaways:**
- Quotes are automatically calculated based on customer selections
- You can review, edit, and accept quotes in the admin dashboard
- Emails are sent automatically when you accept quotes
- Full compliance with TDPSA is built-in
- Audit logging tracks all actions for compliance

**Remember:**
- Process quotes promptly for best customer experience
- Review pricing calculations before accepting
- Monitor email delivery
- Keep audit logs for compliance
- Contact developer for technical issues

For questions or issues not covered in this guide, refer to the technical documentation or contact your developer.

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**For:** Azul Pool Services

