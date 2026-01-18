import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const districtId = searchParams.get('district_id');

  const upazilas = await prisma.upazila.findMany({
    where: districtId ? { district_id: Number(districtId) } : undefined,
    select: { id: true, name: true, district_id: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(upazilas, { status: 200 });
}
