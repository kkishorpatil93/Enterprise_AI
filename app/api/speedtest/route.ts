import { NextRequest, NextResponse } from 'next/server';

// Generate chunk of data for download speed test (e.g. 1MB or customizable)
export async function GET(req: NextRequest) {
  const sizeKb = Math.min(2048, Math.max(64, parseInt(req.nextUrl.searchParams.get('kb') || '512', 10)));
  const buffer = Buffer.alloc(sizeKb * 1024, 'a');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(buffer.length),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

// Accept upload payload for upload speed test
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const blob = await req.blob();
  const durationMs = Math.max(1, Date.now() - startTime);

  return NextResponse.json({
    bytesReceived: blob.size,
    durationMs,
    throughputMbps: Math.round(((blob.size * 8) / (durationMs / 1000) / 1000000) * 10) / 10,
  });
}

