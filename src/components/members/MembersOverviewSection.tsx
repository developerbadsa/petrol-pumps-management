'use client';

import { useMemo } from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import { MOCK_MEMBERS, type Member } from './mockMembers';

export default function MembersOverviewSection() {


  
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

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <div className="lpg-container relative">
        <div className="mx-auto max-w-[860px] text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-[#133374] md:text-[36px]">
            Overview of All Members
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Lorem ipsum dolor sit amet consectetur. Vitae ornare cursus justo libero venenatis donec.
          </p>
        </div>

        <div className="mt-10">
          <TablePanel
            rows={MOCK_MEMBERS}
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
