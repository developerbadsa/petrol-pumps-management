'use client';

import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';

type ApiStationLocation = {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
};

type ApiStationOwner = {
  id: number;
  full_name: string;
  profile_image: string | null;
  gas_stations?: {
    station_name: string;
    location?: ApiStationLocation | null;
  }[];
};

type ApiStationOwnerResponse = {
  current_page: number;
  from: number | null;
  data: ApiStationOwner[];
};

type Member = {
  sl: number;
  photoUrl: string;
  ownerName: string;
  memberId: string;
  stations: string[];
  zone: string;
  district: string;
  upazila: string;
};

const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=133374&color=ffffff`;

const fetchPublicOwners = async () => {
  const res = await fetch('/api/public/station-owners/list');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? 'Failed to load members');
  }
  return data as ApiStationOwnerResponse;
};

export default function MembersOverviewSection() {
  const ownersQ = useQuery({
    queryKey: ['public', 'station-owners', 'list'],
    queryFn: fetchPublicOwners,
  });

  const rows = useMemo<Member[]>(() => {
    const items = ownersQ.data?.data ?? [];
    const start = ownersQ.data?.from ?? 1;
    return items.map((owner, index) => {
      const stations = owner.gas_stations?.map((station) => station.station_name) ?? [];
      const location = owner.gas_stations?.[0]?.location ?? null;
      return {
        sl: start + index,
        photoUrl: owner.profile_image ?? fallbackAvatar(owner.full_name),
        ownerName: owner.full_name,
        memberId: String(owner.id),
        stations,
        zone: location?.division ?? '',
        district: location?.district ?? '',
        upazila: location?.upazila ?? '',
      };
    });
  }, [ownersQ.data]);

  const columns = useMemo<ColumnDef<Member>[]>(() => [
    {
      id: 'sl',
      header: 'SL#',
      sortable: true,
      sortValue: (r) => r.sl,
      csvHeader: 'SL',
      csvValue: (r) => r.sl,
      headerClassName: 'w-[70px]',
      minWidth: 70,
      cell: (r) => String(r.sl).padStart(2, '0'),
    },
    {
      id: 'photo',
      header: 'Photo',
      sortable: false,
      csvHeader: 'Photo',
      csvValue: () => '',
      headerClassName: 'w-[90px]',
      minWidth: 90,
      cell: (r) => (
        <div className="h-9 w-9 overflow-hidden rounded-[12px] bg-black/7 ring-1 ring-black/10">
          <img
            src={r.photoUrl}
            alt={r.ownerName}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ),
    },
    {
      id: 'ownerName',
      header: 'Owner Name',
      sortable: true,
      sortValue: (r) => r.ownerName,
      csvHeader: 'Owner Name',
      csvValue: (r) => r.ownerName,
      cell: (r) => <span className="text-inherit">{r.ownerName}</span>,
    },
    {
      id: 'memberId',
      header: 'ID',
      sortable: true,
      sortValue: (r) => r.memberId,
      csvHeader: 'ID',
      csvValue: (r) => r.memberId,
      minWidth: 120,
      cell: (r) => <span className="text-inherit">{r.memberId}</span>,
    },
    {
      id: 'stations',
      header: 'Station Name',
      sortable: true,
      sortValue: (r) => (r.stations ?? []).join(' '),
      csvHeader: 'Station Name',
      csvValue: (r) => (r.stations ?? []).join(' | '),
      cell: (r) => (
        <div className="space-y-1 leading-[1.25]">
          {(r.stations ?? []).map((s, idx) => (
            <div key={idx} className="text-inherit">
              {s}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'zone',
      header: 'Zone',
      sortable: true,
      sortValue: (r) => r.zone,
      csvHeader: 'Zone',
      csvValue: (r) => r.zone,
      cell: (r) => <span className="text-inherit">{r.zone}</span>,
    },
    {
      id: 'district',
      header: 'District',
      sortable: true,
      sortValue: (r) => r.district,
      csvHeader: 'District',
      csvValue: (r) => r.district,
      cell: (r) => <span className="text-inherit">{r.district}</span>,
    },
    {
      id: 'upazila',
      header: 'Upazila',
      sortable: true,
      sortValue: (r) => r.upazila,
      csvHeader: 'Upazila',
      csvValue: (r) => r.upazila,
      cell: (r) => <span className="text-inherit">{r.upazila}</span>,
    },
  ], []);

  const statusMessage = ownersQ.isLoading
    ? 'Loading members...'
    : ownersQ.isError
      ? 'Unable to load members right now.'
      : null;

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <div className="lpg-container relative">
        <div className="mx-auto max-w-[860px] text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-[#133374] md:text-[36px]">
            Member List
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Welcome to the Members Page of the Bangladesh Petroleum Dealers’, Distributor’s Agents’ & Petrol Pump
            Owners’ Association. Our members are the backbone of the petroleum distribution and retail network of
            Bangladesh.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Collective strength of petrol pump owners, dealers, and distributors across Bangladesh.
          </p>
          {statusMessage ? (
            <p className="mt-3 text-[11px] font-medium text-[#FC7160] md:text-[12px]">{statusMessage}</p>
          ) : null}
        </div>

        <div className="mt-10">
          <TablePanel
            rows={rows}
            columns={columns}
            getRowKey={(r) => String(r.sl)}
            exportFileName="members-export.csv"
            searchText={(m) =>
              [m.ownerName, m.memberId, m.zone, m.district, m.upazila, ...(m.stations ?? [])].join(' ')
            }
          />
        </div>
      </div>
    </section>
  );
}
