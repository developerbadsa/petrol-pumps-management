import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const feeSchema = z.object({
  amount: z.coerce.number().positive(),
  status: z.enum(['active', 'inactive']),
});

export async function GET() {
  const fees = await prisma.membershipFee.findMany({ orderBy: { created_at: 'desc' } });
  return NextResponse.json(fees, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = feeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const fee = await prisma.membershipFee.create({
    data: {
      amount: parsed.data.amount,
      status: parsed.data.status,
    },
  });

  return NextResponse.json(fee, { status: 200 });
}
