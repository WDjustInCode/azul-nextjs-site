import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';
import { isDataExpired } from '../../../lib/compliance';
import { deleteQuote, listQuotes } from '../../../lib/storage';

export async function GET(request: NextRequest) {
  // Check authentication - pass request cookies to read from request
  const isAuthenticated = await validateSession(request.cookies);
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // List all quotes in storage
    const objects = await listQuotes();

    // Enforce retention: delete expired objects before returning list
    await Promise.all(
      objects.map(async (obj) => {
        if (obj.uploadedAt && isDataExpired(obj.uploadedAt)) {
          try {
            await deleteQuote(obj.pathname);
          } catch (error) {
            console.error(`[LIST] Failed to delete expired object ${obj.pathname}:`, error);
          }
        }
      })
    );

    // Sort by upload date (newest first)
    const sortedObjects = objects.sort((a, b) => {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(
      {
        success: true,
        count: sortedObjects.length,
        objects: sortedObjects.map((obj) => ({
          pathname: obj.pathname,
          size: obj.size,
          uploadedAt: obj.uploadedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing storage objects:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

