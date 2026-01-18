import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const station = await prisma.gasStation.findUnique({
    where: { id: Number(id) },
    include: { stationOwner: true },
  });
  if (!station) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const [updatedStation] = await prisma.$transaction([
    prisma.gasStation.update({
      where: { id: station.id },
      data: {
        verification_status: 'APPROVED',
        verified_by: auth.user.id,
        verified_at: new Date(),
        rejection_reason: null,
      },
      include: {
        stationOwner: true,
        division: true,
        district: true,
        upazila: true,
        otherBusinesses: { include: { otherBusiness: true } },
        documents: true,
      },
    }),
    prisma.stationOwner.update({
      where: { id: station.station_owner_id },
      data: { status: 'APPROVED', rejection_reason: null },
    }),
  ]);

  return NextResponse.json(updatedStation, { status: 200 });
}
