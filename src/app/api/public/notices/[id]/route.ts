import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const notice = await prisma.notice.findUnique({
    where: { id: Number(id) },
    include: { attachments: true },
  });
  if (!notice) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(notice, { status: 200 });
}
