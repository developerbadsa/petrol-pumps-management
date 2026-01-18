import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const businessSchema = z.object({
  name: z.string().min(1),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const businesses = await prisma.otherBusiness.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(businesses, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = businessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const exists = await prisma.otherBusiness.findUnique({ where: { name: parsed.data.name } });
  if (exists) {
    return NextResponse.json(
      { message: 'Validation error', errors: { name: ['The name has already been taken.'] } },
      { status: 422 }
    );
  }

  const business = await prisma.otherBusiness.create({ data: parsed.data });
  return NextResponse.json(business, { status: 200 });
}
