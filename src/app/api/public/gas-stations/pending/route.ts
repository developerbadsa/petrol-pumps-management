import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildPagination } from '@/lib/pagination';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const perPage = Number(url.searchParams.get('per_page') ?? '20');
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePerPage = Number.isNaN(perPage) || perPage < 1 ? 20 : perPage;

  const total = await prisma.gasStation.count({ where: { verification_status: 'PENDING' } });
  const stations = await prisma.gasStation.findMany({
    where: { verification_status: 'PENDING' },
    include: { division: true, district: true, upazila: true },
    orderBy: { created_at: 'desc' },
    skip: (safePage - 1) * safePerPage,
    take: safePerPage,
  });

  const data = stations.map((station) => ({
    id: station.id,
    station_name: station.station_name,
    oil_company_name: station.oil_company_name,
    verification_status: station.verification_status,
    location: {
      division: station.division.name,
      district: station.district.name,
      upazila: station.upazila.name,
    },
  }));

  const pagination = buildPagination(data, total, safePage, safePerPage, `${url.origin}/api/public/gas-stations/pending`);
  return NextResponse.json(pagination, { status: 200 });
}
