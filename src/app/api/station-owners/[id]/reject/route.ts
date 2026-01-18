import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const rejectSchema = z.object({
  reason: z.string().min(1),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = rejectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const { id } = await ctx.params;
  const owner = await prisma.stationOwner.findUnique({ where: { id: Number(id) } });
  if (!owner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.stationOwner.update({
    where: { id: owner.id },
    data: { status: 'REJECTED', rejection_reason: parsed.data.reason },
  });

  return NextResponse.json(updated, { status: 200 });
}
