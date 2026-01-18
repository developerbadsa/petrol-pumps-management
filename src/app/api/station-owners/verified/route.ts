import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const owners = await prisma.stationOwner.findMany({
    where: { status: 'APPROVED' },
    include: { gasStations: true },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(owners, { status: 200 });
}
