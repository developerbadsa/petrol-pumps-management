import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const [verified, unverified, total] = await Promise.all([
    prisma.stationOwner.count({ where: { status: 'APPROVED' } }),
    prisma.stationOwner.count({ where: { status: 'PENDING' } }),
    prisma.stationOwner.count(),
  ]);

  return NextResponse.json(
    {
      total_verified_station_owners: verified,
      total_unverified_station_owners: unverified,
      total_station_owners: total,
    },
    { status: 200 }
  );
}
