import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const divisionId = url.searchParams.get('division_id');
  if (!divisionId) {
    return NextResponse.json(
      { message: 'Validation error', errors: { division_id: ['The division_id field is required.'] } },
      { status: 422 }
    );
  }

  const division = await prisma.division.findUnique({ where: { id: Number(divisionId) } });
  if (!division) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const districts = await prisma.district.findMany({
    where: { division_id: division.id },
    select: { name: true },
    orderBy: { name: 'asc' },
  });

  const members = await prisma.zonalCommittee.findMany({
    where: { division_id: division.id },
    orderBy: [{ position_order: 'asc' }, { created_at: 'desc' }],
  });

  return NextResponse.json(
    {
      districts: districts.map((district) => district.name),
      members,
    },
    { status: 200 }
  );
}
