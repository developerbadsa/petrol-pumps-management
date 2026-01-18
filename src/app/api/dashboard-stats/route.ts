import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const [totalStations, totalStationOwners, unreadMessages, activeNotices] = await Promise.all([
    prisma.gasStation.count(),
    prisma.stationOwner.count(),
    prisma.contactMessage.count({ where: { is_read: false } }),
    prisma.notice.count({ where: { publish_date: { lte: new Date() } } }),
  ]);

  return NextResponse.json(
    {
      total_stations: totalStations,
      total_station_owners: totalStationOwners,
      unread_messages: unreadMessages,
      active_notices: activeNotices,
    },
    { status: 200 }
  );
}
