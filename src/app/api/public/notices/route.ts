import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const notices = await prisma.notice.findMany({
    include: { attachments: true },
    orderBy: { publish_date: 'desc' },
  });
  return NextResponse.json(notices, { status: 200 });
}
