'use client';

import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import MeshCorners from '@/components/ui/MeshCorners';
import {membershipFeesRepo} from '@/features/dashboard/settings/membership-fees/repo';
import type {MembershipFeeRow} from '@/features/dashboard/settings/membership-fees/types';

const money = (n: number) =>
  new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(n);

export default function MembershipFeesSection() {
  const feesQ = useQuery({
    queryKey: ['public', 'membership-fees'],
    queryFn: () => membershipFeesRepo.list(),
  });

  const rows = feesQ.data ?? [];

  const columns = useMemo<ColumnDef<MembershipFeeRow>[]>(() => [
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
      id: 'amount',
      header: 'Amount',
      sortable: true,
      sortValue: (r) => r.amount,
      csvHeader: 'Amount',
      csvValue: (r) => r.amount,
      minWidth: 200,
      cell: (r) => <span className="text-inherit">{money(r.amount)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      csvHeader: 'Status',
      csvValue: (r) => r.status,
      minWidth: 140,
      align: 'center',
      cell: (r) => (
        <span className={r.status === 'ACTIVE' ? 'font-semibold text-[#2D8A2D]' : 'font-semibold text-[#FC7160]'}>
          {r.status}
        </span>
      ),
    },
  ], []);

  const statusMessage = feesQ.isLoading
    ? 'Loading membership fees...'
    : feesQ.isError
      ? 'Unable to load membership fees right now.'
      : null;

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#6CC12A]" />

      <MeshCorners className="z-0" color="#2D8A2D" opacity={0.18} width={620} height={420} strokeWidth={1} />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <div className="mx-auto max-w-[860px] text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-[#133374] md:text-[36px]">
            Membership Fees
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Clear and affordable membership fees for registered petroleum dealers and owners.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#8A9CB0] md:text-[12px]">
            Clear and affordable membership fees for registered petroleum dealers and owners.
          </p>
          {statusMessage ? (
            <p className="mt-3 text-[11px] font-medium text-[#FC7160] md:text-[12px]">{statusMessage}</p>
          ) : null}
        </div>

        <div className="mt-10">
          <TablePanel
            rows={rows}
            columns={columns}
            getRowKey={(r) => r.id}
            exportFileName="membership-fees.csv"
            searchText={(r) => `${r.sl} ${r.amount} ${r.status}`}
            totalLabel={(total) => (
              <div className="text-[14px] font-semibold text-[#2D8A2D]">
                Total Fee Structures : <span className="text-[#133374]">{total}</span>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
