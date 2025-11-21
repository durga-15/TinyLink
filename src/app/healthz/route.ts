import { NextResponse } from 'next/server';

import { appConfig } from '@/lib/env';

export function GET() {
  return NextResponse.json({
    ok: true,
    version: appConfig.version,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

