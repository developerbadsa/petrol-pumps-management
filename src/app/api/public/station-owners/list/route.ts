import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

function buildLaravelLinks(path: string, page: number, lastPage: number, perPage: number) {
  const links = [] as Array<{ url: string | null; label: string; active: boolean }>;
  links.push({
    url: page > 1 ? `${path}?page=${page - 1}&per_page=${perPage}` : null,
    label: '&laquo; Previous',
    active: false,
  });
  for (let i = 1; i <= lastPage; i += 1) {
    links.push({
      url: `${path}?page=${i}&per_page=${perPage}`,
      label: String(i),
      active: i === page,
    });
  }
  links.push({
    url: page < lastPage ? `${path}?page=${page + 1}&per_page=${perPage}` : null,
    label: 'Next &raquo;',
    active: false,
  });
  return links;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const perPage = Number(url.searchParams.get('per_page') ?? '20');
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePerPage = Number.isNaN(perPage) || perPage < 1 ? 20 : perPage;

  const total = await prisma.stationOwner.count({ where: { status: 'APPROVED' } });
  const owners = await prisma.stationOwner.findMany({
    where: { status: 'APPROVED' },
    include: {
      gasStations: {
        include: { division: true, district: true, upazila: true },
      },
    },
    orderBy: { created_at: 'desc' },
    skip: (safePage - 1) * safePerPage,
    take: safePerPage,
  });

  const data = owners.map((owner) => ({
    id: owner.id,
    full_name: owner.full_name,
    profile_image: owner.profile_image_url,
    gas_stations: owner.gasStations.map((station) => ({
      station_name: station.station_name,
      location: {
        division: station.division.name,
        district: station.district.name,
        upazila: station.upazila.name,
      },
    })),
  }));

  const lastPage = Math.max(1, Math.ceil(total / safePerPage));
  const path = `${url.origin}/api/public/station-owners/list`;
  const from = total === 0 ? null : (safePage - 1) * safePerPage + 1;
  const to = total === 0 ? null : Math.min(safePage * safePerPage, total);

  return NextResponse.json(
    {
      current_page: safePage,
      data,
      first_page_url: `${path}?page=1&per_page=${safePerPage}`,
      from,
      last_page: lastPage,
      last_page_url: `${path}?page=${lastPage}&per_page=${safePerPage}`,
      links: buildLaravelLinks(path, safePage, lastPage, safePerPage),
      next_page_url:
        safePage < lastPage ? `${path}?page=${safePage + 1}&per_page=${safePerPage}` : null,
      path,
      per_page: safePerPage,
      prev_page_url:
        safePage > 1 ? `${path}?page=${safePage - 1}&per_page=${safePerPage}` : null,
      to,
      total,
    },
    { status: 200 }
  );
}
