import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const districtSchema = z.object({
  division_id: z.coerce.number().int(),
  name: z.string().min(1),
  is_active: z.coerce.boolean().optional(),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const divisionId = searchParams.get('division_id');

  const districts = await prisma.district.findMany({
    where: divisionId ? { division_id: Number(divisionId) } : undefined,
    include: { division: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(districts, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = districtSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const division = await prisma.division.findUnique({ where: { id: parsed.data.division_id } });
  if (!division) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const district = await prisma.district.create({
    data: {
      division_id: division.id,
      name: parsed.data.name,
      is_active: parsed.data.is_active ?? true,
    },
  });

  return NextResponse.json(district, { status: 200 });
}
