import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const stations = await prisma.gasStation.findMany({
    where: { verification_status: 'PENDING' },
    include: {
      stationOwner: true,
      division: true,
      district: true,
      upazila: true,
      otherBusinesses: { include: { otherBusiness: true } },
      documents: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(stations, { status: 200 });
}
