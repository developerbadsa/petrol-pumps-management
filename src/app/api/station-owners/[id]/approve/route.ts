import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const owner = await prisma.stationOwner.findUnique({ where: { id: Number(id) } });
  if (!owner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.stationOwner.update({
    where: { id: owner.id },
    data: { status: 'APPROVED', rejection_reason: null },
  });

  return NextResponse.json(updated, { status: 200 });
}
