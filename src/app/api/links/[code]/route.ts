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

  return NextResponse.json({ link });
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const { code } = await params;
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.link.delete({ where: { code } });

  return new NextResponse(null, { status: 204 });
}

