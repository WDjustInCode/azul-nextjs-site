// Compliance logging and audit trail
import { downloadAuditLog, listAuditLogs, uploadAuditLog } from './storage';

interface AuditLog {
  timestamp: string;
  action: 'access' | 'delete' | 'export' | 'view';
  email?: string;
  pathname?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
}

// Email verification codes for data access requests
interface VerificationCode {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
}

// In-memory cache for quick access (also persisted to Supabase Storage)
const auditLogsCache: AuditLog[] = [];
const CACHE_SIZE = 1000; // Keep last 1000 in memory

// Email verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, VerificationCode>(); // email -> code data
const CODE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Log an audit event - persists to Supabase Storage for compliance
 */
export async function logAuditEvent(
  action: AuditLog['action'],
  details: {
    email?: string;
    pathname?: string;
    ip?: string;
    userAgent?: string;
    success: boolean;
    error?: string;
  }
): Promise<void> {
  const log: AuditLog = {
    timestamp: new Date().toISOString(),
    action,
    ...details,
  };
  
  // Add to in-memory cache for quick access
  auditLogsCache.push(log);
  if (auditLogsCache.length > CACHE_SIZE) {
    auditLogsCache.shift();
  }
  
  // Persist to Supabase Storage
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `audit-logs/${timestamp}-${Date.now()}.json`;
    
    await uploadAuditLog(filename, log);
  } catch (error) {
    // Log error but don't fail - audit logging should be non-blocking
    console.error('[AUDIT] Failed to persist to storage:', error);
  }
  
  // Also log to console for production monitoring
  console.log('[AUDIT]', JSON.stringify(log));
}

/**
 * Get audit logs - combines in-memory cache with persisted logs from Supabase Storage
 */
export async function getAuditLogs(email?: string, limit: number = 100): Promise<AuditLog[]> {
  const allLogs: AuditLog[] = [];
  
  // Start with in-memory cache (most recent)
  allLogs.push(...auditLogsCache);
  
  // Fetch from Supabase Storage
  try {
    const objects = await listAuditLogs();
    
    // Fetch and parse all stored audit objects
    const objectLogs = await Promise.all(
      objects.map(async (obj) => {
        try {
          return await downloadAuditLog<AuditLog>(obj.pathname);
        } catch (error) {
          console.error(`[AUDIT] Failed to read log ${obj.pathname}:`, error);
          return null;
        }
      })
    );
    
    // Filter out nulls and add to allLogs
    const validObjectLogs = objectLogs.filter((log): log is AuditLog => log !== null);
    allLogs.push(...validObjectLogs);
  } catch (error) {
    console.error('[AUDIT] Failed to fetch logs from storage:', error);
    // Continue with just in-memory cache if storage fetch fails
  }
  
  // Sort by timestamp (most recent first) and deduplicate
  const uniqueLogs = new Map<string, AuditLog>();
  allLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .forEach(log => {
      // Use timestamp + action + email as unique key to avoid duplicates
      const key = `${log.timestamp}-${log.action}-${log.email || ''}`;
      if (!uniqueLogs.has(key)) {
        uniqueLogs.set(key, log);
      }
    });
  
  let logs = Array.from(uniqueLogs.values());
  
  // Filter by email if provided
  if (email) {
    logs = logs.filter(log => 
      log.email?.toLowerCase() === email.toLowerCase()
    );
  }
  
  return logs.slice(0, limit);
}

// Generate and store verification code for email
export function generateVerificationCode(email: string): string {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + CODE_EXPIRY;
  
  verificationCodes.set(email.toLowerCase(), {
    code,
    email: email.toLowerCase(),
    expiresAt,
    attempts: 0,
  });
  
  // Clean up expired codes periodically
  setTimeout(() => {
    const codeData = verificationCodes.get(email.toLowerCase());
    if (codeData && codeData.expiresAt < Date.now()) {
      verificationCodes.delete(email.toLowerCase());
    }
  }, CODE_EXPIRY);
  
  return code;
}

// Verify code for email
export function verifyCode(email: string, code: string): boolean {
  const emailLower = email.toLowerCase();
  const codeData = verificationCodes.get(emailLower);
  
  if (!codeData) {
    return false; // No code exists for this email
  }
  
  if (codeData.expiresAt < Date.now()) {
    verificationCodes.delete(emailLower);
    return false; // Code expired
  }
  
  if (codeData.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    verificationCodes.delete(emailLower);
    return false; // Too many failed attempts
  }
  
  if (codeData.code !== code) {
    codeData.attempts++;
    return false; // Wrong code
  }
  
  // Code is valid - remove it (one-time use)
  verificationCodes.delete(emailLower);
  return true;
}

// Data retention policy: 7 years for business records (common requirement)
export const DATA_RETENTION_DAYS = 7 * 365; // 7 years

export function isDataExpired(uploadedAt: string): boolean {
  const uploadDate = new Date(uploadedAt);
  const expirationDate = new Date(uploadDate);
  expirationDate.setDate(expirationDate.getDate() + DATA_RETENTION_DAYS);
  return new Date() > expirationDate;
}

