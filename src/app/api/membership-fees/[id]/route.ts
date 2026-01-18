import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const fee = await prisma.membershipFee.findUnique({ where: { id: Number(id) } });
  if (!fee) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(fee, { status: 200 });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (resolveMethod(req) !== 'PUT') {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const { id } = await ctx.params;
  const fee = await prisma.membershipFee.findUnique({ where: { id: Number(id) } });
  if (!fee) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.membershipFee.update({
    where: { id: fee.id },
    data: {
      amount: parsed.data.amount,
      status: parsed.data.status,
    },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const fee = await prisma.membershipFee.findUnique({ where: { id: Number(id) } });
  if (!fee) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.membershipFee.delete({ where: { id: fee.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
