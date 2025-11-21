import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { generateCode } from '@/lib/utils';
import { createLinkSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search')?.trim();

  const links = await prisma.link.findMany({
    where: search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = createLinkSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const desiredCode = parsed.data.code;

  if (desiredCode) {
    const existing = await prisma.link.findUnique({ where: { code: desiredCode } });
    if (existing) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
    }
  }

  let code = desiredCode ?? generateCode(6);
  if (!desiredCode) {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts && (await prisma.link.findUnique({ where: { code } }))) {
      attempts += 1;
      code = generateCode(6 + (attempts % 3)); // expand length to keep unique
    }
    if (attempts === maxAttempts) {
      return NextResponse.json(
        { error: 'Unable to generate a unique code, please try again' },
        { status: 500 },
      );
    }
  }

  const link = await prisma.link.create({
    data: {
      code,
      url: parsed.data.url,
    },
  });

  return NextResponse.json({ link }, { status: 201 });
}

