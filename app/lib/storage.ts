import { getSupabaseServiceClient } from './supabase';

const QUOTES_BUCKET = process.env.SUPABASE_QUOTES_BUCKET || 'quotes';
const AUDIT_BUCKET = process.env.SUPABASE_AUDIT_BUCKET || 'audit-logs';
const QUOTE_PREFIX = 'quotes';
const AUDIT_PREFIX = 'audit-logs';

type StoredObject = {
  pathname: string;
  size: number;
  uploadedAt?: string;
};

async function uploadJson(bucket: string, path: string, data: object, upsert = false) {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.storage.from(bucket).upload(path, JSON.stringify(data, null, 2), {
    contentType: 'application/json',
    upsert,
  });
  if (error) throw error;
}

async function downloadJson<T>(bucket: string, path: string): Promise<T> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error) throw error;
  const text = await data.text();
  return JSON.parse(text) as T;
}

async function listObjects(bucket: string, prefix: string): Promise<StoredObject[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) throw error;
  return (
    data?.map((item) => ({
      pathname: `${prefix}/${item.name}`,
      size: item.metadata?.size ?? 0,
      uploadedAt: item.created_at || item.updated_at || undefined,
    })) || []
  );
}

async function removeObject(bucket: string, path: string) {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export async function uploadQuote(path: string, quote: object, upsert = false) {
  return uploadJson(QUOTES_BUCKET, path, quote, upsert);
}

export async function downloadQuote<T>(path: string): Promise<T> {
  return downloadJson<T>(QUOTES_BUCKET, path);
}

export async function listQuotes(): Promise<StoredObject[]> {
  return listObjects(QUOTES_BUCKET, QUOTE_PREFIX);
}

export async function deleteQuote(path: string) {
  return removeObject(QUOTES_BUCKET, path);
}

export async function uploadAuditLog(path: string, log: object) {
  return uploadJson(AUDIT_BUCKET, path, log);
}

export async function listAuditLogs(): Promise<StoredObject[]> {
  return listObjects(AUDIT_BUCKET, AUDIT_PREFIX);
}

export async function downloadAuditLog<T>(path: string): Promise<T> {
  return downloadJson<T>(AUDIT_BUCKET, path);
}

// Pricing configuration storage
const PRICING_CONFIG_PATH = 'config/pricing-config.json';

export async function getPricingConfig<T>(): Promise<T | null> {
  try {
    return await downloadJson<T>(QUOTES_BUCKET, PRICING_CONFIG_PATH);
  } catch (error: any) {
    // If file doesn't exist, return null (will use defaults)
    if (
      error?.statusCode === 404 || 
      error?.statusCode === '404' ||
      error?.message?.includes('not found') ||
      error?.message?.includes('Not Found') ||
      error?.error?.message?.includes('not found') ||
      error?.error?.message?.includes('Not Found')
    ) {
      return null;
    }
    // Log the error for debugging but don't expose it to the client
    console.error('Error loading pricing config:', error);
    throw error;
  }
}

export async function savePricingConfig(config: object) {
  return uploadJson(QUOTES_BUCKET, PRICING_CONFIG_PATH, config, true);
}

