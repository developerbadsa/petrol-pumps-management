import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const allowedDivisions = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Sylhet',
] as const;

const divisionSchema = z.object({
  name: z.enum(allowedDivisions),
  is_active: z.coerce.boolean().optional(),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const divisions = await prisma.division.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(divisions, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = divisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const exists = await prisma.division.findUnique({ where: { name: parsed.data.name } });
  if (exists) {
    return NextResponse.json(
      { message: 'Validation error', errors: { name: ['The name has already been taken.'] } },
      { status: 422 }
    );
  }

  const division = await prisma.division.create({
    data: {
      name: parsed.data.name,
      is_active: parsed.data.is_active ?? true,
    },
  });

  return NextResponse.json(division, { status: 200 });
}
