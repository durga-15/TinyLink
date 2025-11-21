import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { code } = await params;
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.link.update({
    where: { code },
    data: {
      clickCount: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  return NextResponse.redirect(link.url, { status: 302 });
}

