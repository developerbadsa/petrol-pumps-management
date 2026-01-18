import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const upazilaSchema = z.object({
  district_id: z.coerce.number().int(),
  name: z.string().min(1),
  is_active: z.coerce.boolean().optional(),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const districtId = searchParams.get('district_id');

  const upazilas = await prisma.upazila.findMany({
    where: districtId ? { district_id: Number(districtId) } : undefined,
    include: { district: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(upazilas, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = upazilaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const district = await prisma.district.findUnique({ where: { id: parsed.data.district_id } });
  if (!district) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const upazila = await prisma.upazila.create({
    data: {
      district_id: district.id,
      name: parsed.data.name,
      is_active: parsed.data.is_active ?? true,
    },
  });

  return NextResponse.json(upazila, { status: 200 });
}
