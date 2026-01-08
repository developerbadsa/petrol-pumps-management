'use client';

import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import MeshCorners from '@/components/ui/MeshCorners';

type ApiStationLocation = {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
};

type ApiNonMemberStation = {
  station_name?: string;
  station_owner_id?: number;
  verification_status?: string;
  location?: ApiStationLocation | null;
};

type ApiNonMemberOwner = {
  id?: number;
  full_name?: string;
  verification_status?: string;
  gas_stations?: ApiNonMemberStation[];
  station_name?: string;
  station_owner_id?: number;
  location?: ApiStationLocation | null;
};

type ApiNonMemberResponse = {
  current_page?: number;
  from?: number | null;
  data?: ApiNonMemberOwner[];
};

type NonMemberRow = {
  sl: number;
  stationName: string;
  ownerId: string;
  status: string;
  zone: string;
  district: string;
  upazila: string;
};

const fetchNonMembers = async () => {
  const res = await fetch('/api/public/station-owners/list');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? 'Failed to load non-member stations');
  }
  return data as ApiNonMemberResponse;
};

function StatusBadge({status}: {status: string}) {
  const normalized = status.toUpperCase();
  const isPending = normalized === 'PENDING' || normalized === 'UNVERIFIED';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 text-[9px] font-semibold ${
        isPending ? 'bg-[#FFF3D1] text-[#8B5D00]' : 'bg-[#EAF7EA] text-[#2D8A2D]'
      }`}>
      {normalized || 'UNKNOWN'}
    </span>
  );
}

export default function NonMembersSection() {
  const nonMembersQ = useQuery({
    queryKey: ['public', 'station-owners', 'list', 'non-members'],
    queryFn: fetchNonMembers,
  });

  const rows = useMemo<NonMemberRow[]>(() => {
    const items = nonMembersQ.data?.data ?? [];
    const start = nonMembersQ.data?.from ?? 1;
    const normalized = items.map((item) => {
      const firstStation = item.gas_stations?.[0];
      const status = (firstStation?.verification_status ?? item.verification_status ?? 'UNVERIFIED').toString();
      const location = item.location ?? firstStation?.location ?? null;
      return {
        stationName: item.station_name ?? firstStation?.station_name ?? '-',
        ownerId: item.station_owner_id ?? item.id,
        status,
        zone: location?.division ?? '',
        district: location?.district ?? '',
        upazila: location?.upazila ?? '',
      };
    });
    const filtered = normalized.filter((item) => item.status.toUpperCase() !== 'APPROVED');
    return filtered.map((station, index) => ({
      sl: start + index,
      stationName: station.stationName,
      ownerId: station.ownerId ? String(station.ownerId) : '-',
      status: station.status,
      zone: station.zone,
      district: station.district,
      upazila: station.upazila,
    }));
  }, [nonMembersQ.data]);

  const columns = useMemo<ColumnDef<NonMemberRow>[]>(() => [
    {
      id: 'sl',
      header: '#',
      sortable: true,
      sortValue: (r) => r.sl,
      csvHeader: 'SL',
      csvValue: (r) => r.sl,
      headerClassName: 'w-[70px]',
      minWidth: 70,
      cell: (r) => String(r.sl).padStart(2, '0'),
    },
    {
      id: 'stationName',
      header: 'Station Name',
      sortable: true,
      sortValue: (r) => r.stationName,
      csvHeader: 'Station Name',
      csvValue: (r) => r.stationName,
      minWidth: 320,
      cell: (r) => <span className="text-inherit">{r.stationName}</span>,
    },
    {
      id: 'ownerId',
      header: 'Owner ID',
      sortable: true,
      sortValue: (r) => r.ownerId,
      csvHeader: 'Owner ID',
      csvValue: (r) => r.ownerId,
      minWidth: 140,
      cell: (r) => <span className="text-inherit">{r.ownerId}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      csvHeader: 'Status',
      csvValue: (r) => r.status,
      minWidth: 140,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      id: 'zone',
      header: 'Zone',
      sortable: true,
      sortValue: (r) => r.zone,
      csvHeader: 'Zone',
      csvValue: (r) => r.zone,
      minWidth: 130,
      cell: (r) => <span className="text-inherit">{r.zone}</span>,
    },
    {
      id: 'district',
      header: 'District',
      sortable: true,
      sortValue: (r) => r.district,
      csvHeader: 'District',
      csvValue: (r) => r.district,
      minWidth: 170,
      cell: (r) => <span className="text-inherit">{r.district}</span>,
    },
    {
      id: 'upazila',
      header: 'Upazila',
      sortable: true,
      sortValue: (r) => r.upazila,
      csvHeader: 'Upazila',
      csvValue: (r) => r.upazila,
      minWidth: 140,
      cell: (r) => <span className="text-inherit">{r.upazila}</span>,
    },
  ], []);

  const statusMessage = nonMembersQ.isLoading
    ? 'Loading non-member stations...'
    : nonMembersQ.isError
      ? 'Unable to load non-member stations right now.'
      : null;

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <MeshCorners className="z-0" color="#2D8A2D" opacity={0.18} width={620} height={420} strokeWidth={1} />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <div className="mx-auto max-w-[860px] text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-[#133374] md:text-[36px]">
            List of Non-Member Stations
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Lorem ipsum dolor sit amet consectetur. Semper id ipsum adipiscing dictum dictum ullamcorper est arcu.
            Lobortis in pellentesque mi.
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
            exportFileName="non-member-stations.csv"
            totalLabel={(total) => (
              <div className="text-[14px] font-semibold text-[#2D8A2D]">
                Total Stations : <span className="text-[#133374]">{total}</span>
              </div>
            )}
            searchText={(r) => [r.stationName, r.ownerId, r.status, r.zone, r.district, r.upazila].join(' ')}
          />
        </div>
      </div>
    </section>
  );
}
