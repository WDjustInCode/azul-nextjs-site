# Azul Pool Services - Complete Documentation

This comprehensive documentation covers everything you need to know about running, understanding, and maintaining the Azul Pool Services web application.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Application Overview](#application-overview)
3. [Quote Flow](#quote-flow)
4. [Pricing & Calculations](#pricing--calculations)
5. [Security & Compliance](#security--compliance)
6. [API Reference](#api-reference)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Vercel account** (for deployment)
- **Supabase project** (for Storage)
- **Resend account** (for email functionality - see [EMAIL_SETUP.md](./EMAIL_SETUP.md))

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd azul-nextjs-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory with the following variables:
   ```bash
   # Supabase Storage (required)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_QUOTES_BUCKET=quotes
   SUPABASE_AUDIT_BUCKET=audit-logs
   
   # Email Service (required for production)
   RESEND_API_KEY=re_your_resend_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   COMPANY_NAME=Azul Pool Services
   
   # Admin Authentication (required)
   ADMIN_PASSWORD=your_secure_admin_password
   SESSION_SECRET=your_random_session_secret
   
   # Optional: Service Area Configuration
   SERVICE_AREA_CITY=San Antonio
   SERVICE_AREA_STATE=TX
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### First-Time Setup Checklist

- [ ] Install Node.js dependencies
- [ ] Set up Supabase Storage buckets (`quotes`, `audit-logs`)
- [ ] Set up Resend account and configure email (see [EMAIL_SETUP.md](./EMAIL_SETUP.md))
- [ ] Configure environment variables
- [ ] Test quote submission flow
- [ ] Test admin authentication
- [ ] Review and customize privacy policy page

---

## Application Overview

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19
- **Storage**: Supabase Storage (private buckets)
- **Email**: Resend
- **Deployment**: Vercel (recommended)

### Application Structure

```
azul-nextjs-site/
├── app/
│   ├── api/                    # API routes
│   │   ├── admin/              # Admin endpoints (auth, audit)
│   │   └── quotes/            # Quote management endpoints
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # Authentication logic
│   │   ├── compliance.ts     # Compliance & audit logging
│   │   └── email.ts          # Email service integration
│   ├── quote/                # Quote wizard pages & components
│   ├── privacy/              # Privacy policy & data access pages
│   ├── admin/                # Admin dashboard
│   │   └── quotes/
│   │       └── page.tsx      # Admin quotes management & pricing config
│   ├── api/
│   │   └── admin/
│   │       └── pricing/      # Pricing configuration API endpoints
│   └── utils/                # Utility functions
│       ├── pricing.ts        # Pricing calculation engine (with config support)
│       └── serviceArea.ts   # Service area validation
├── public/                   # Static assets
└── types/                    # TypeScript type definitions
```

### Key Features

1. **Multi-Step Quote Wizard**: Guided flow for collecting customer information
2. **Dynamic Pricing Engine**: Real-time price calculation based on service type, pool size, and special conditions
3. **Residential & Commercial Support**: Separate flows for different customer segments
4. **TDPSA Compliance**: Full implementation of Texas Data Privacy and Security Act requirements
5. **Admin Dashboard**: Secure admin interface for managing quotes
6. **Audit Logging**: Comprehensive logging for compliance and security
7. **Data Access & Deletion**: Self-service tools for customer data management

---

## Quote Flow

### Overview

The quote flow is a multi-step wizard that collects customer information and service preferences to generate a personalized quote. The flow adapts based on customer selections, creating different paths for residential vs. commercial, and different service types.

### Flow Diagram

```
START
  ↓
[Address Entry] → Manual Address Entry (optional)
  ↓
[Contact Info] → First Name, Last Name, Email, Phone
  ↓
[Residential or Commercial?]
  ├─→ Commercial → [Commercial Form] → Submit → Thank You
  └─→ Residential → [Service Type Selection]
                      ├─→ Regular Service
                      │     ↓
                      │   [Pool Type] → Pool Only / Pool+Spa / Hot Tub / Other
                      │     ↓
                      │   [Special Flags] → Above Ground / Saltwater / Trees Over Pool
                      │     ↓
                      │   [Pool Size] → Small / Medium / Large
                      │     ↓
                      │   [Email Capture] → Submit → Thank You
                      │
                      ├─→ Equipment Service
                      │     ↓
                      │   [Equipment Options] → Select equipment types
                      │     ↓
                      │   [Pool Type] → [Special Flags] → [Pool Size] → [Email] → Submit
                      │
                      ├─→ Filter/Salt Cell Service
                      │     ↓
                      │   [Pool Type] → [Special Flags] → [Pool Size] → [Email] → Submit
                      │
                      ├─→ Green to Clean
                      │     ↓
                      │   [Email Capture] → Submit (requires on-site visit)
                      │
                      └─→ Other Service
                            ↓
                          [Pool Type] → [Pool Size] → [Email] → Submit
```

### Step-by-Step Flow Details

#### 1. Address Entry (`address-entry`)

**Purpose**: Collect customer's service address

**Features**:
- Google Places Autocomplete integration
- Manual address entry option
- Address validation
- URL parameter support (`?address=...`)

**User Actions**:
- Enter address using autocomplete
- Or click "Enter address manually"

**Next Steps**:
- If address entered → `contact-info`
- If manual entry → `manual-address-entry`

#### 2. Manual Address Entry (`manual-address-entry`)

**Purpose**: Allow users to enter address without autocomplete

**Fields**:
- Street Address
- City
- State
- ZIP Code

**Next Step**: `contact-info`

#### 3. Contact Information (`contact-info`)

**Purpose**: Collect customer contact details

**Fields**:
- First Name (required)
- Last Name (required)
- Email (required)
- Phone (optional)

**Validation**:
- Email format validation
- Required field validation

**Next Step**: `res-or-comm`

#### 4. Residential or Commercial (`res-or-comm`)

**Purpose**: Determine customer segment

**Options**:
- Residential
- Commercial

**Next Steps**:
- Residential → `res-service-type`
- Commercial → `commercial-form`

#### 5. Residential Service Type (`res-service-type`)

**Purpose**: Select type of service needed

**Options**:
- **Regular**: Full-service pool maintenance
- **Equipment**: Equipment repair/replacement
- **Filter**: Filter or salt cell cleaning
- **Green**: Green-to-clean rescue service
- **Other**: Other service types

**Next Steps** (varies by selection):
- Regular → `res-regular-pool-type`
- Equipment → `res-equipment-options`
- Filter → `res-filter-pool-type`
- Green → `res-green-email`
- Other → `res-other-pool-type`

#### 6. Regular Service Flow

**6a. Pool Type (`res-regular-pool-type`)**
- Pool Only
- Pool + Spa
- Hot Tub Only
- Other

**6b. Special Flags (`res-regular-flags`)**
- Above Ground Pool
- Saltwater Pool
- Trees Over Pool

**6c. Pool Size (`res-regular-size`)**
- Small (≤15,000 gallons)
- Medium (15,000-25,000 gallons)
- Large (≥25,000 gallons)

**6d. Email Capture (`res-regular-email`)**
- Final email confirmation
- Submit quote

**Special Cases**:
- Hot Tub Only → Skips flags and size, goes directly to email
- Above Ground Pool → Shows notice, then email capture

#### 7. Equipment Service Flow

**7a. Equipment Options (`res-equipment-options`)**
- Pool Pump
- Pool Filter
- Pool Heater
- Salt System
- Automation System
- Other / Not Sure

**7b-7d. Pool Type → Flags → Size → Email**
(Same as Regular Service flow)

#### 8. Filter/Salt Cell Service Flow

**8a. Pool Type** → **8b. Special Flags** → **8c. Pool Size** → **8d. Email**

**Note**: Above-ground pools show notice and skip to email.

#### 9. Green to Clean Flow

**Purpose**: Special service requiring on-site visit

**Flow**: Direct to email capture with special messaging

**Message**: "We need to see your pool in person. Share your email and we'll reach out to schedule an on-site visit."

#### 10. Commercial Form (`commercial-form`)

**Purpose**: Collect commercial customer information

**Fields**:
- Company Name
- Email
- Message/Details

**Next Step**: Submit → Thank You

#### 11. Above Ground Notice (`above-ground-notice`)

**Purpose**: Inform customers that above-ground pools have limited service options

**Message**: Explains that above-ground pools typically receive chemical-only service (no cleaning)

**Next Step**: Email capture → Submit

#### 12. Thank You (`thank-you`)

**Purpose**: Confirmation page after quote submission

**Features**:
- Displays customer's address
- Confirms quote submission
- Provides next steps information

### State Management

The quote flow uses React state to track all user inputs:

```typescript
interface QuoteState {
  address?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  segment: "residential" | "commercial" | null;
  serviceCategory: ServiceCategory | null;
  poolType?: "pool-only" | "pool-spa" | "hot-tub" | "other";
  equipmentSelections: string[];
  specialFlags: {
    aboveGroundPool: boolean;
    saltwaterPool: boolean;
    treesOverPool: boolean;
  };
  poolSize?: "small" | "medium" | "large";
  commercial?: {
    email: string;
    company: string;
    message: string;
  };
  // ... pricing and metadata added server-side
}
```

### Quote Submission Process

When a user completes the flow:

1. **Client-Side Validation**:
   - Email is required (for compliance)
   - All required fields validated

2. **Price Calculation**:
   - Pricing engine calculates quote based on selections
   - Breakdown generated for display

3. **API Submission**:
   - Quote data sent to `/api/quotes` endpoint
   - Server validates data
   - Rate limiting applied (5 requests/minute per IP)

4. **Storage**:
   - Quote stored in Supabase Storage (private bucket)
   - Unique filename: `quotes/quote-{timestamp}.json`
   - Pricing breakdown included in stored data

5. **Audit Logging**:
   - Submission logged for compliance
   - IP address and timestamp recorded

6. **Response**:
   - Success confirmation returned
   - User redirected to Thank You page

### URL Parameters

The quote flow supports URL parameters for deep linking:

- `?address=123 Main St, San Antonio, TX 78201` - Pre-fill address
- `?step=manual-address-entry` - Start at specific step

---

## Pricing & Calculations

### Overview

The pricing engine (`app/utils/pricing.ts`) calculates service prices dynamically based on multiple factors. Prices are calibrated for the San Antonio, TX market and are competitive with local pool service providers.

### Base Pricing Structure

#### Service Category Base Prices

| Service Category | Base Price | Notes |
|-----------------|------------|-------|
| **Regular** | $210/month | Weekly full-service maintenance, medium in-ground pool |
| **Equipment** | $150 | Base job anchor (trip + first hour) |
| **Filter** | $150/month | Weekly chemical-only/light service, medium pool |
| **Green** | $350 | One-time green-to-clean baseline (small/medium scenario) |
| **Other** | $210 | Defaults to regular pricing |

**Note**: Regular, Filter, and Other are **recurring services** (monthly). Equipment and Green are **one-time services**.

### Size Multipliers

Pool size affects the base price:

| Pool Size | Multiplier | Gallons | Example (Regular Service) |
|-----------|------------|---------|---------------------------|
| **Small** | 0.90 | ≤15,000 | ~$190/month |
| **Medium** | 1.0 | 15,000-25,000 | $210/month (baseline) |
| **Large** | 1.095 | ≥25,000 | ~$230/month |

**Calculation**: `adjustedPrice = basePrice × sizeMultiplier`

### Pool Type Adjustments

Pool type affects pricing:

| Pool Type | Multiplier | Notes |
|-----------|------------|-------|
| **Pool Only** | 1.0 | Standard pricing |
| **Pool + Spa** | 1.15 | 15% premium for combo |
| **Hot Tub Only** | 0.6 | 40% discount (smaller volume) |
| **Other** | 1.0 | Standard pricing |

**Calculation**: `adjustedPrice = adjustedPrice × poolTypeMultiplier`

### Special Condition Fees

Additional fees for special conditions (recurring services only):

| Condition | Monthly Fee | Notes |
|-----------|-------------|-------|
| **Saltwater Pool** | $0 | Neutral (cost difference in salt-cell maintenance) |
| **Trees Over Pool** | +$20/month | Extra time/chemicals for heavy debris |
| **Above Ground Pool** | -$20/month | Discount vs. in-ground baseline |

**Note**: These fees are added/subtracted from the monthly total for recurring services.

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

**Calculation**: `equipmentTotal = sum of selected equipment prices`

### Frequency Variants (Recurring Services Only)

For recurring services (Regular, Filter, Other), the system calculates alternative frequencies:

| Frequency | Calculation | Notes |
|-----------|-------------|-------|
| **Weekly** | Base monthly price | Standard service |
| **Bi-Weekly** | Monthly × 0.65 | Every other week estimate |
| **Monthly** | Monthly × 0.4 | Once per month estimate |

**Note**: These are display-only estimates. The primary price shown is for weekly service.

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

The pricing engine generates a detailed breakdown array:

```typescript
[
  "Base regular service (weekly, medium pool): $210.00",
  "Pool size (large): +$19.95",
  "Pool type (pool-spa): +$34.50",
  "Trees over pool: +$20.00/month",
  "---",
  "Standard weekly service: $284.50/month",
  "If serviced every other week: ~$184.93/month",
  "If serviced once per month: ~$113.80/month"
]
```

### Pricing Display

- **Recurring Services**: `$X.XX/month (weekly service)`
- **One-Time Services**: `$X.XX (one-time estimate)`

### Market Calibration Notes

Prices are calibrated based on:
- San Antonio, TX market research
- Competitive analysis of local pool service providers
- Weekly full-service, medium in-ground pool: ~$210/month baseline
- Size multipliers tuned to land near $190/$210/$230 for small/medium/large

### Customization

#### Admin Dashboard Configuration (Recommended)

Pricing can be adjusted directly from the admin dashboard without code changes:

1. **Access Admin Dashboard**: Navigate to `/admin/quotes` and log in
2. **Open Pricing Config**: Click "Show Pricing Config" button
3. **Edit Values**: Modify any pricing parameters:
   - Base prices for each service category
   - Size multipliers (small, medium, large)
   - Pool type multipliers (pool-only, pool-spa, hot-tub, other)
   - Special condition fees (saltwater, trees, above-ground)
   - Equipment prices (pump, filter, heater, etc.)
   - Frequency multipliers (bi-weekly, monthly)
4. **Save**: Click "Save Config" to persist changes
5. **Automatic Updates**: Changes take effect immediately for new quotes

**Storage**: Configuration is stored in Supabase Storage at `config/pricing-config.json` in the quotes bucket. The system uses cached configuration for performance and falls back to defaults if no custom configuration exists.

#### Code-Based Customization (Legacy)

For developers, pricing can also be adjusted in code:

1. **Base Prices**: Edit `DEFAULT_BASE_PRICES` in `app/utils/pricing.ts`
2. **Size Multipliers**: Edit `DEFAULT_SIZE_MULTIPLIERS`
3. **Pool Type Multipliers**: Edit `DEFAULT_POOL_TYPE_MULTIPLIERS`
4. **Special Fees**: Edit `DEFAULT_SPECIAL_CONDITION_FEES`
5. **Equipment Prices**: Edit `DEFAULT_EQUIPMENT_PRICES`

**Note**: Admin dashboard changes override code defaults. To reset to code defaults, delete the pricing config file from Supabase Storage.

---

## Security & Compliance

### Overview

The application implements comprehensive security measures and full compliance with the **Texas Data Privacy and Security Act (TDPSA)**. See [COMPLIANCE.md](./COMPLIANCE.md) for detailed compliance documentation.

### Security Features

#### 1. Authentication & Authorization

**Admin Authentication**:
- Password-based authentication
- Secure session tokens (HMAC-SHA256 signed)
- HTTP-only cookies
- Session expiration (24 hours)
- Rate limiting (5 attempts, 15-minute lockout)

**Implementation**: `app/lib/auth.ts`

**Usage**:
```typescript
// Validate session in API routes
const isAuthenticated = await validateSession(request.cookies);
if (!isAuthenticated) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

#### 2. Rate Limiting

**API Rate Limiting**:
- 5 requests per minute per IP address
- Applied to quote submission endpoint
- Prevents abuse and DDoS attacks

**Implementation**: `app/api/quotes/route.ts`

**Response**: HTTP 429 (Too Many Requests) when limit exceeded

#### 3. Input Validation

**Quote Data Validation**:
- Email format validation (regex)
- Required field validation
- Type checking
- Segment validation (residential/commercial)
- Service category validation

**Implementation**: `app/api/quotes/route.ts` - `validateQuoteData()`

#### 4. Data Storage Security

**Supabase Storage (private buckets)**:
- Encrypted at rest
- Private access (no public URLs exposed)
- Unique timestamped filenames
- Access only via authenticated server APIs

**File Naming**: `quotes/quote-{ISO-timestamp}.json`

#### 5. Email Verification

**Two-Factor Verification**:
- 6-digit verification codes
- 15-minute expiration
- Single-use codes
- Maximum 5 verification attempts
- Codes sent via email only (never in API responses)

**Implementation**: `app/lib/compliance.ts`

#### 6. HTTPS Enforcement

- All production traffic over HTTPS
- Vercel automatically enforces HTTPS
- Secure cookie transmission

### TDPSA Compliance

#### Consumer Rights Implementation

**1. Right to Access Personal Data**

- **Endpoint**: `POST /api/quotes/access`
- **Process**: Two-step email verification
- **Response Time**: Immediate (TDPSA requires within 30 days)
- **UI**: Available at `/privacy` page

**Usage**:
```bash
# Step 1: Request verification code
POST /api/quotes/access
{
  "email": "customer@example.com",
  "action": "request-code"
}

# Step 2: Verify and get data
POST /api/quotes/access
{
  "email": "customer@example.com",
  "action": "verify-code",
  "code": "123456"
}
```

**2. Right to Delete Personal Data**

- **Endpoint**: `POST /api/quotes/delete`
- **Process**: Two-step email verification with confirmation
- **Response Time**: Immediate (TDPSA requires within 30 days)
- **UI**: Available at `/privacy` page

**Usage**:
```bash
# Step 1: Request verification code
POST /api/quotes/delete
{
  "email": "customer@example.com",
  "action": "request-code"
}

# Step 2: Verify and delete
POST /api/quotes/delete
{
  "email": "customer@example.com",
  "action": "verify-code",
  "code": "123456",
  "confirm": true
}
```

**3. Right to Correct Data**

- Available via contact email
- Manual process (contact support)

**4. Right to Opt-Out**

- Available via contact email
- Manual process (contact support)

#### Privacy Policy

- **Location**: `/privacy` page
- **Content**: Comprehensive privacy policy covering:
  - Data collection practices
  - Data usage
  - Consumer rights under TDPSA
  - Data security measures
  - Contact information for privacy requests

**Update Required**: Replace placeholder email addresses with actual company contact information.

#### Audit Logging

**Purpose**: Track all data access, deletion, and viewing activities for compliance audits.

**Implementation**: `app/lib/compliance.ts`

**Logged Events**:
- `access`: Data access requests
- `delete`: Data deletion requests
- `view`: Admin viewing activities
- `export`: (Future feature)

**Log Data Includes**:
- Timestamp (ISO format)
- Action type
- Email address (if applicable)
- IP address
- User agent
- Success/failure status
- Error messages (if failed)
- Pathname (for quote-specific actions)

**Storage**:
- In-memory cache (last 1000 events)
- Persisted to Supabase Storage (private bucket)
- Filename: `audit-logs/{timestamp}-{timestamp}.json`

**Viewing Audit Logs**:

**Via Admin UI**:
1. Navigate to `/admin/quotes`
2. Authenticate with admin password
3. Click "Show Audit Logs" button
4. Filter by email address (optional)

**Via API**:
```bash
# Get all audit logs (last 100)
GET /api/admin/audit

# Get logs for specific email
GET /api/admin/audit?email=customer@example.com

# Get more logs
GET /api/admin/audit?limit=200
```

#### Data Retention Policy

- **Retention Period**: 7 years (standard business record retention)
- **Expiration Check**: `isDataExpired()` function in `app/lib/compliance.ts`
- **Automatic Cleanup**: Manual process (consider automation)

**Implementation**:
```typescript
const DATA_RETENTION_DAYS = 7 * 365; // 7 years

export function isDataExpired(uploadedAt: string): boolean {
  const uploadDate = new Date(uploadedAt);
  const expirationDate = new Date(uploadDate);
  expirationDate.setDate(expirationDate.getDate() + DATA_RETENTION_DAYS);
  return new Date() > expirationDate;
}
```

### Security Best Practices

#### Environment Variables

**Never commit sensitive data**:
- Use `.env.local` for local development
- Use Vercel Environment Variables for production
- Add `.env.local` to `.gitignore`

**Required Secrets**:
- `ADMIN_PASSWORD`: Strong password for admin access
- `SESSION_SECRET`: Random string for session signing
- `RESEND_API_KEY`: Email service API key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `SUPABASE_QUOTES_BUCKET`: Quotes bucket name (default `quotes`)
- `SUPABASE_AUDIT_BUCKET`: Audit bucket name (default `audit-logs`)

#### Session Security

- Sessions expire after 24 hours
- Signed with HMAC-SHA256
- HTTP-only cookies (prevents XSS)
- Timing-safe comparison (prevents timing attacks)

#### Data Minimization

- Only collect necessary data for quotes
- Email required for compliance (data deletion requests)
- No unnecessary personal information collected

#### Error Handling

- Generic error messages to clients (no sensitive data exposure)
- Detailed errors logged server-side only
- Rate limit errors user-friendly

### Compliance Checklist

- [x] Right to access personal data
- [x] Right to delete personal data
- [x] Right to correct data (via contact)
- [x] Right to opt-out (via contact)
- [x] Response within 30 days (immediate processing)
- [x] Privacy policy page
- [x] Clear data collection disclosure
- [x] Data usage explanation
- [x] Consumer rights explanation
- [x] Contact information for requests
- [x] Encryption in transit (HTTPS)
- [x] Encryption at rest (Supabase Storage)
- [x] Access controls
- [x] Audit logging
- [x] Data minimization
- [x] Purpose limitation
- [x] No data selling

### Important Notes

1. **TDPSA Threshold**: TDPSA applies if you process:
   - Personal data of 100,000+ Texas residents annually, OR
   - Personal data of 25,000+ Texas residents for revenue generation

2. **Legal Review**: Consult with legal counsel to ensure full compliance for your specific business.

3. **Email Service**: Required for compliance features. See [EMAIL_SETUP.md](./EMAIL_SETUP.md).

4. **Audit Log Storage**: Currently in-memory (last 1000) + Supabase Storage. For production at scale, consider:
   - Database storage for audit logs
   - External logging service (e.g., Logtail, Datadog)
   - Long-term retention for compliance

---

## API Reference

### Quote Endpoints

#### `POST /api/quotes`

Submit a new quote.

**Request Body**:
```typescript
{
  address?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string; // Required
  segment: "residential" | "commercial" | null;
  serviceCategory: "regular" | "equipment" | "filter" | "green" | "other" | null;
  poolType?: "pool-only" | "pool-spa" | "hot-tub" | "other";
  equipmentSelections?: string[];
  specialFlags: {
    aboveGroundPool: boolean;
    saltwaterPool: boolean;
    treesOverPool: boolean;
  };
  poolSize?: "small" | "medium" | "large";
  commercial?: {
    email: string;
    company: string;
    message: string;
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

**Rate Limit**: 5 requests/minute per IP

#### `POST /api/quotes/accept`

Accept a quote (admin only).

**Authentication**: Required (admin session)

**Request Body**:
```typescript
{
  pathname: string; // Storage object path
  pricing?: QuotePricing; // Optional pricing override
}
```

**Response**:
```typescript
{
  success: boolean;
  data?: QuoteState;
  error?: string;
}
```

**Actions**:
- Updates quote status to "accepted"
- Sends quote email to customer
- Logs audit event

#### `POST /api/quotes/access`

Request access to personal data (TDPSA compliance).

**Request Body** (Step 1):
```typescript
{
  email: string;
  action: "request-code";
}
```

**Request Body** (Step 2):
```typescript
{
  email: string;
  action: "verify-code";
  code: string;
}
```

**Response** (Step 1):
```typescript
{
  success: boolean;
  message: string;
  nextStep?: string;
  verificationCode?: string; // Only in development
}
```

**Response** (Step 2):
```typescript
{
  success: boolean;
  email: string;
  count: number;
  quotes: Array<{
    pathname: string;
    uploadedAt: string;
    data: QuoteState;
  }>;
  message: string;
}
```

#### `POST /api/quotes/delete`

Request deletion of personal data (TDPSA compliance).

**Request Body** (Step 1):
```typescript
{
  email: string;
  action: "request-code";
}
```

**Request Body** (Step 2):
```typescript
{
  email: string;
  action: "verify-code";
  code: string;
  confirm: true; // Required
}
```

**Admin Request** (bypasses verification):
```typescript
{
  email: string;
  confirm: true;
}
```

**Response**:
```typescript
{
  success: boolean;
  email: string;
  deletedCount: number;
  deletedQuotes: string[];
  errors?: string[];
  message: string;
}
```

### Admin Endpoints

#### `GET /api/admin/pricing`

Get current pricing configuration (admin only).

**Authentication**: Required (admin session cookie)

**Response**:
```typescript
{
  success: boolean;
  config?: {
    basePrices: {
      regular: number;
      equipment: number;
      filter: number;
      green: number;
      other: number;
    };
    sizeMultipliers: {
      small: number;
      medium: number;
      large: number;
    };
    poolTypeMultipliers: {
      "pool-only": number;
      "pool-spa": number;
      "hot-tub": number;
      other: number;
    };
    specialConditionFees: {
      saltwaterPool: number;
      treesOverPool: number;
      aboveGroundPool: number;
    };
    equipmentPrices: {
      "Pool pump": number;
      "Pool filter": number;
      "Pool heater": number;
      "Salt system": number;
      "Automation system": number;
      "I'm not sure / something else": number;
    };
    frequencyMultipliers: {
      biWeekly: number;
      monthly: number;
    };
  };
  defaults?: PricingConfig; // Default values for reference
  error?: string;
}
```

**Note**: Returns merged configuration (custom values + defaults). If no custom configuration exists, returns defaults.

#### `POST /api/admin/pricing`

Update pricing configuration (admin only).

**Authentication**: Required (admin session cookie)

**Request Body**:
```typescript
{
  config: {
    basePrices?: Partial<Record<ServiceCategory, number>>;
    sizeMultipliers?: Partial<Record<PoolSize, number>>;
    poolTypeMultipliers?: Partial<Record<string, number>>;
    specialConditionFees?: Partial<Record<"saltwaterPool" | "treesOverPool" | "aboveGroundPool", number>>;
    equipmentPrices?: Partial<Record<string, number>>;
    frequencyMultipliers?: Partial<{ biWeekly: number; monthly: number }>;
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  config?: PricingConfig; // Full merged configuration
  message?: string;
  error?: string;
}
```

**Storage**: Configuration is saved to Supabase Storage at `config/pricing-config.json` in the quotes bucket. Changes take effect immediately for new quotes.

#### `POST /api/admin/auth`

Authenticate as admin.

**Request Body**:
```typescript
{
  password: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Sets**: HTTP-only cookie `admin-auth`

#### `GET /api/admin/audit`

Get audit logs (admin only).

**Query Parameters**:
- `email?`: Filter by email address
- `limit?`: Number of logs to return (default: 100)

**Response**:
```typescript
{
  success: boolean;
  logs: AuditLog[];
  error?: string;
}
```

### Data Types

#### `QuoteState`
```typescript
interface QuoteState {
  address?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  segment: "residential" | "commercial" | null;
  serviceCategory: ServiceCategory | null;
  poolType?: "pool-only" | "pool-spa" | "hot-tub" | "other";
  equipmentSelections: string[];
  specialFlags: {
    aboveGroundPool: boolean;
    saltwaterPool: boolean;
    treesOverPool: boolean;
  };
  poolSize?: "small" | "medium" | "large";
  commercial?: {
    email: string;
    company: string;
    message: string;
  };
  pricing?: QuotePricing;
  status?: "pending" | "updated" | "accepted";
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
}
```

#### `QuotePricing`
```typescript
interface QuotePricing {
  basePrice: number;
  sizeAdjustment: number;
  poolTypeAdjustment: number;
  specialConditionFees: number;
  equipmentFees: number;
  subtotal: number;
  monthlyTotal: number;
  isOneTime: boolean;
  frequencyVariants: {
    weekly: number | null;
    biWeekly: number | null;
    monthly: number | null;
  };
  breakdown: string[];
}
```

---

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard

2. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all required variables (see [Getting Started](#getting-started))

3. **Deploy**:
   - Vercel automatically deploys on git push
   - Or trigger manual deployment from dashboard

### Environment Variables for Production

Set these in Vercel dashboard:

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
NODE_ENV=production
```

### Custom Domain Setup

1. Add domain in Vercel project settings
2. Configure DNS records as instructed
3. SSL certificate automatically provisioned

### Performance Optimization

- **Next.js Automatic Optimizations**:
  - Image optimization
  - Code splitting
  - Static generation where possible
  - React Server Components

- **Vercel Edge Network**:
  - Global CDN
  - Automatic HTTPS
  - DDoS protection

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Check Vercel logs
- **Audit Logs**: Review via admin dashboard

---

## Troubleshooting

### Common Issues

#### 1. Quote Submission Fails

**Symptoms**: Error when submitting quote

**Solutions**:
- Check email is provided (required)
- Verify Supabase env vars are set and buckets exist
- Check rate limiting (wait 1 minute)
- Review browser console for errors
- Check server logs in Vercel dashboard

#### 2. Email Not Sending

**Symptoms**: Verification codes not received

**Solutions**:
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for errors
- Verify domain is verified in Resend
- Check spam folder
- In development, check console for code

#### 3. Admin Authentication Fails

**Symptoms**: Cannot log in to admin dashboard

**Solutions**:
- Verify `ADMIN_PASSWORD` is set correctly
- Check `SESSION_SECRET` is set
- Clear browser cookies
- Check server logs for errors

#### 4. Pricing Calculation Errors

**Symptoms**: Incorrect prices displayed

**Solutions**:
- Verify all required fields in quote state
- Check pricing constants in `app/utils/pricing.ts`
- Review calculation logic
- Check browser console for errors

#### 5. Data Access/Deletion Not Working

**Symptoms**: Cannot access or delete data

**Solutions**:
- Verify email service is configured
- Check verification code expiration (15 minutes)
- Verify email matches exactly (case-insensitive)
- Check audit logs for errors
- Review server logs

### Debug Mode

In development, additional logging is available:

- Verification codes logged to console (if email not configured)
- Detailed error messages in console
- Server-side logging in terminal

### Getting Help

1. **Check Logs**:
   - Browser console (client-side errors)
   - Vercel logs (server-side errors)
   - Audit logs (compliance actions)

2. **Review Documentation**:
   - [COMPLIANCE.md](./COMPLIANCE.md) - Compliance details
   - [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Email configuration

3. **Common Files to Check**:
   - `app/utils/pricing.ts` - Pricing logic
   - `app/lib/compliance.ts` - Compliance features
   - `app/lib/auth.ts` - Authentication
   - `app/api/quotes/route.ts` - Quote submission

---

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Storage**: https://supabase.com/docs/guides/storage
- **Resend Documentation**: https://resend.com/docs
- **TDPSA Information**: https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00004F.htm

---

**Last Updated**: December 2024  
**Version**: 1.0.0

