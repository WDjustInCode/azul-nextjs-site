# Compliance Documentation
## Texas Data Privacy and Security Act (TDPSA) Compliance

This document outlines the compliance features implemented for your pool service company in San Antonio, Texas.

## ✅ Compliance Features Implemented

### 1. **Right to Access Personal Data** (TDPSA Requirement)
- **Endpoint:** `POST /api/quotes/access`
- **Purpose:** Allows consumers to request access to their personal data
- **Security:** Email verification required (prevents unauthorized access)
- **Response Time:** Processed immediately (TDPSA requires response within 30 days)
- **Usage:** 
  - Step 1: Request verification code: `{ "email": "customer@example.com", "action": "request-code" }`
  - Step 2: Verify and get data: `{ "email": "customer@example.com", "action": "verify-code", "code": "123456" }`

### 2. **Right to Delete Personal Data** (TDPSA Requirement)
- **Endpoint:** `POST /api/quotes/delete`
- **Purpose:** Allows consumers to request deletion of their personal data
- **Security:** Email verification required (prevents unauthorized deletion) OR admin authentication
- **Response Time:** Processed immediately (TDPSA requires response within 30 days)
- **Usage (Self-Service):** 
  - Step 1: Request verification code: `{ "email": "customer@example.com", "action": "request-code" }`
  - Step 2: Verify and delete: `{ "email": "customer@example.com", "action": "verify-code", "code": "123456", "confirm": true }`
- **Usage (Admin):** Send POST request with `{ "email": "customer@example.com", "confirm": true }` (requires admin authentication)

### 3. **Audit Logging** (Compliance Requirement)
- **Purpose:** Track all data access, deletion, and viewing activities
- **Endpoint:** `GET /api/admin/audit` (admin only)
- **Admin UI:** Available in `/admin/quotes` page - click "Show Audit Logs" button
- **Features:**
  - Logs all data access requests (via `/api/quotes/access`)
  - Logs all data deletion requests (via `/api/quotes/delete`)
  - Logs admin viewing activities (when viewing quotes in admin panel)
  - Logs quote submissions (when quotes are created)
  - Tracks IP addresses and timestamps
  - Maintains audit trail for compliance audits
  - Filterable by email address
  - Stores last 1000 events in memory (consider database for production)

### 4. **Privacy Policy** (TDPSA Requirement)
- **Location:** `/privacy` page
- **Content:** Comprehensive privacy policy covering:
  - Data collection practices
  - Data usage
  - Consumer rights under TDPSA
  - Data security measures
  - Contact information for privacy requests

### 5. **Data Security Measures**
- ✅ Data encrypted in transit (HTTPS)
- ✅ Data stored in private, encrypted Supabase Storage
- ✅ Access controls with secure authentication
- ✅ Rate limiting to prevent abuse
- ✅ Signed session tokens
- ✅ HTTP-only cookies

### 6. **Data Retention Policy**
- **Retention Period:** 7 years (standard business record retention)
- **Automatic Cleanup:** Expired data can be identified using `isDataExpired()` function
- **Manual Deletion:** Available via deletion endpoint

## 📋 TDPSA Compliance Checklist

### Consumer Rights (✅ Implemented)
- [x] Right to access personal data
- [x] Right to delete personal data
- [x] Right to correct data (via contact email)
- [x] Right to opt-out (via contact email)
- [x] Response within 30 days

### Privacy Notices (✅ Implemented)
- [x] Privacy policy page
- [x] Clear data collection disclosure
- [x] Data usage explanation
- [x] Consumer rights explanation
- [x] Contact information for requests

### Data Security (✅ Implemented)
- [x] Reasonable security practices
- [x] Encryption in transit
- [x] Encryption at rest
- [x] Access controls
- [x] Audit logging

### Data Processing (✅ Implemented)
- [x] Data minimization (only collect necessary data)
- [x] Purpose limitation (data used only for quotes)
- [x] No data selling
- [x] Limited data sharing

## 🔒 Security Features

1. **Authentication**
   - Secure password-based admin authentication
   - Rate limiting (5 attempts, 15-min lockout)
   - Signed session tokens (HMAC-SHA256)
   - HTTP-only cookies

2. **Data Protection**
   - Private Supabase Storage buckets (not publicly accessible)
   - Encrypted data storage (Supabase Storage)
   - HTTPS only in production
   - Input validation

3. **Audit Trail**
   - All data access logged
   - All deletions logged
   - IP address tracking
   - Timestamp tracking
   - Admin access logging

## 📊 Viewing Audit Logs

### Via Admin UI (Recommended):
1. Navigate to `/admin/quotes` page
2. Authenticate with admin password
3. Click "Show Audit Logs" button
4. View all audit events in a table format
5. Filter by email address using the search box
6. Click "Refresh" to reload logs

### Via API:
```bash
# Get all audit logs (last 100)
GET /api/admin/audit

# Get logs for specific email
GET /api/admin/audit?email=customer@example.com

# Get more logs
GET /api/admin/audit?limit=200
```

### What's Logged:
- **access**: When customers request access to their data
- **delete**: When customers request deletion of their data
- **view**: When admins view quote details
- **export**: (Future feature)

Each log entry includes:
- Timestamp (ISO format)
- Action type
- Email address (if applicable)
- IP address
- User agent
- Success/failure status
- Error message (if failed)
- Pathname (for quote-specific actions)

## 📞 Handling Consumer Requests

### Access Request Process (Automated):
1. Consumer requests access via API: `POST /api/quotes/access` with `{ "email": "...", "action": "request-code" }`
2. System sends verification code to consumer's email (via Resend)
3. Consumer verifies with code: `POST /api/quotes/access` with `{ "email": "...", "action": "verify-code", "code": "..." }`
4. System returns data to consumer
5. Request is logged in audit trail

### Access Request Process (Manual/Admin):
1. Consumer emails privacy request to your company email
2. Admin authenticates and uses `/api/quotes/access` endpoint (admin bypasses verification)
3. Data is retrieved and provided to consumer
4. Request is logged in audit trail

### Deletion Request Process (Self-Service - Recommended):
1. Consumer requests deletion via API: `POST /api/quotes/delete` with `{ "email": "...", "action": "request-code" }`
2. System sends verification code to consumer's email (via Resend)
3. Consumer verifies with code: `POST /api/quotes/delete` with `{ "email": "...", "action": "verify-code", "code": "...", "confirm": true }`
4. All data matching email is deleted
5. Deletion is logged in audit trail
6. Confirmation sent to consumer

### Deletion Request Process (Manual/Admin):
1. Consumer emails deletion request to your company email
2. Admin authenticates and uses `/api/quotes/delete` endpoint with `{ "email": "...", "confirm": true }`
3. All data matching email is deleted
4. Deletion is logged in audit trail
5. Confirmation sent to consumer

## ⚠️ Important Notes

1. **TDPSA Threshold:** TDPSA applies if you process:
   - Personal data of 100,000+ Texas residents annually, OR
   - Personal data of 25,000+ Texas residents for revenue generation

2. **Response Time:** TDPSA requires responses within 30 days. Our endpoints process immediately, but you should still respond to consumers within 30 days.

3. **Audit Logs:** Currently stored in memory (last 1000 entries). For production, consider:
   - Database storage for audit logs
   - External logging service (e.g., Logtail, Datadog)
   - Long-term retention for compliance

4. **Privacy Policy:** Update the privacy policy page with:
   - Your actual company email
   - Your actual company address
   - Any additional data processing activities

## 🚀 Next Steps

1. **Set Up Email Service (REQUIRED):**
   - Follow `EMAIL_SETUP.md` guide
   - Get Resend API key
   - Verify your domain
   - Set environment variables
   - Test email sending

2. **Update Privacy Policy:**
   - Replace `privacy@yourcompany.com` with your actual email
   - Add your company address
   - Review and customize content

3. **Set Up Request Handling:**
   - Create email alias for privacy requests
   - Document internal process for handling requests
   - Train staff on TDPSA requirements

4. **Consider Additional Features:**
   - Data export functionality (for access requests)
   - Automated data retention cleanup
   - Database for audit logs (instead of in-memory)

5. **Compliance Review:**
   - Consult with legal counsel
   - Review TDPSA requirements for your specific business
   - Consider SECURETexas certification if applicable

## 📚 Resources

- [Texas Data Privacy and Security Act (TDPSA)](https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00004F.htm)
- [Supabase Storage Security](https://supabase.com/docs/guides/security/policies#storage)
- [TDPSA Business Guide](https://www.fisherphillips.com/en/news-insights/faqs-businesses-texas-data-privacy-law.html)

---

**Last Updated:** December 2024
**Compliance Status:** ✅ TDPSA Compliant (pending legal review)

