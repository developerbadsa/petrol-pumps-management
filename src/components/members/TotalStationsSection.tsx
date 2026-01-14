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

type ApiGasStation = {
  id: number;
  station_name: string;
  station_owner_id?: number;
  verification_status?: string;
  location?: ApiStationLocation | null;
};

type ApiGasStationResponse = {
  data?: ApiGasStation[];
};

type TotalStationRow = {
  sl: number;
  stationName: string;
  status: string;
  zone: string;
  district: string;
  upazila: string;
};

const fetchTotalStations = async () => {
  const res = await fetch('/api/public/gas-stations/total');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? 'Failed to load total stations');
  }
  return data as ApiGasStationResponse;
};

function StatusBadge({status}: {status: string}) {
  const normalized = status.toUpperCase();
  const isApproved = normalized === 'APPROVED';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 text-[9px] font-semibold ${
        isApproved ? 'bg-[#EAF7EA] text-[#2D8A2D]' : 'bg-[#FFF3D1] text-[#8B5D00]'
      }`}>
      {normalized || 'UNKNOWN'}
    </span>
  );
}

export default function TotalStationsSection() {
  const totalQ = useQuery({
    queryKey: ['public', 'gas-stations', 'total'],
    queryFn: fetchTotalStations,
  });

  const rows = useMemo<TotalStationRow[]>(() => {
    const items = totalQ.data?.data ?? [];
    return items.map((station, index) => ({
      sl: index + 1,
      stationName: station.station_name,
      status: station.verification_status ?? 'UNKNOWN',
      zone: station.location?.division ?? '',
      district: station.location?.district ?? '',
      upazila: station.location?.upazila ?? '',
    }));
  }, [totalQ.data]);

  const columns = useMemo<ColumnDef<TotalStationRow>[]>(() => [
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

  const statusMessage = totalQ.isLoading
    ? 'Loading total stations...'
    : totalQ.isError
      ? 'Unable to load total stations right now.'
      : null;

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <MeshCorners className="z-0" color="#2D8A2D" opacity={0.18} width={620} height={420} strokeWidth={1} />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <div className="mx-auto max-w-[860px] text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-[#133374] md:text-[36px]">
            Total Station List
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Comprehensive list of all registered petrol stations across Bangladesh.
          </p>
          <h3 className="mt-4 text-[18px] font-semibold text-[#133374] md:text-[20px]">
            Total Petrol Pump Station List
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Comprehensive list of all registered petrol stations across Bangladesh.
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
            exportFileName="total-stations.csv"
            totalLabel={(total) => (
              <div className="text-[14px] font-semibold text-[#2D8A2D]">
                Total Stations : <span className="text-[#133374]">{total}</span>
              </div>
            )}
            searchText={(r) => [r.stationName, r.status, r.zone, r.district, r.upazila].join(' ')}
          />
        </div>
      </div>
    </section>
  );
}
