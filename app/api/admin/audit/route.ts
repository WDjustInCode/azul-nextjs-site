import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';
import { getAuditLogs } from '../../../lib/compliance';

/**
 * Admin endpoint to view audit logs for compliance
 */
export async function GET(request: NextRequest) {
  // Require admin authentication - pass request cookies to read from request
  const isAuthenticated = await validateSession(request.cookies);
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email') || undefined;
  const limit = parseInt(searchParams.get('limit') || '100', 10);

  const logs = await getAuditLogs(email, limit);

  return NextResponse.json(
    {
      success: true,
      count: logs.length,
      logs,
    },
    { status: 200 }
  );
}

