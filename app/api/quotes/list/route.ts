import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';

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
    // List all blobs with the 'quotes/' prefix
    const { blobs } = await list({
      prefix: 'quotes/',
      limit: 1000, // Adjust as needed
    });

    // Sort by upload date (newest first)
    const sortedBlobs = blobs.sort((a, b) => {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(
      {
        success: true,
        count: sortedBlobs.length,
        blobs: sortedBlobs.map((blob) => ({
          pathname: blob.pathname,
          url: blob.url,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing blobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

