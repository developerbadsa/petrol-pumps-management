import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const divisionId = searchParams.get('division_id');

  const districts = await prisma.district.findMany({
    where: divisionId ? { division_id: Number(divisionId) } : undefined,
    select: { id: true, name: true, division_id: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(districts, { status: 200 });
}
