import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientSendTime = req.nextUrl.searchParams.get('t');
  const serverTime = Date.now();

  return NextResponse.json({
    status: 'ok',
    clientSendTime: clientSendTime ? parseInt(clientSendTime, 10) : null,
    serverTime,
  });
}

