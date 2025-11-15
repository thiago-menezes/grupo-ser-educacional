import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const mediaPath = `/${path.join('/')}`;

  try {
    const strapiBaseUrl = process.env.STRAPI_URL;
    const strapiMediaUrl = `${strapiBaseUrl}${mediaPath}`;

    const response = await fetch(strapiMediaUrl, {
      method: 'GET',
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch media' },
        { status: response.status },
      );
    }

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching media from Strapi:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch media',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
