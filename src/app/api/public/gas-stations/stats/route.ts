import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const [verified, unverified, total] = await Promise.all([
    prisma.gasStation.count({ where: { verification_status: 'APPROVED' } }),
    prisma.gasStation.count({ where: { verification_status: 'PENDING' } }),
    prisma.gasStation.count(),
  ]);

  return NextResponse.json(
    {
      total_verified_gas_stations: verified,
      total_unverified_gas_stations: unverified,
      total_gas_stations: total,
    },
    { status: 200 }
  );
}
