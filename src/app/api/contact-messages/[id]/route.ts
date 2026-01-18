import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const message = await prisma.contactMessage.findUnique({ where: { id: Number(id) } });
  if (!message) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.contactMessage.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
