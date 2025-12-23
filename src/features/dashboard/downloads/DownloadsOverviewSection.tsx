'use client';

import {useMemo} from 'react';
import {Plus} from 'lucide-react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import type {MembershipFeeRow} from './types';
import {useDeleteFee, useFees, useUpdateFee} from './queries';

const money = (n: number) =>
  new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(n);

export default function DownloadsOverviewSection() {
  const feesQ = useFees();
  const delM = useDeleteFee();
  const updM = useUpdateFee();

  const rows = feesQ.data ?? [];

  const columns = useMemo<ColumnDef<MembershipFeeRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        headerClassName: 'w-[90px]',
        minWidth: 90,
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'amount',
        header: 'Amount',
        sortable: true,
        sortValue: (r) => r.amount,
        cell: (r) => money(r.amount),
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        sortValue: (r) => r.status,
        align: 'center',
        cell: (r) => (
          <span className={r.status === 'ACTIVE' ? 'font-semibold text-[#2D8A2D]' : 'font-semibold text-[#FC7160]'}>
            {r.status}
          </span>
        ),
      },
      {
        id: 'edit',
        header: 'Edit',
        align: 'center',
        sortable: false,
        cell: (r) => (
          <button
            type="button"
            onClick={() => updM.mutate({id: r.id, patch: {status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}})}
            className="h-7 rounded-[3px] bg-[#FFC75A] px-4 text-[11px] font-semibold text-[#2B3A4A] shadow-sm hover:brightness-105 active:brightness-95"
          >
            Edit
          </button>
        ),
      },
      {
        id: 'delete',
        header: 'Delete',
        align: 'center',
        sortable: false,
        cell: (r) => (
          <button
            type="button"
            onClick={() => delM.mutate(r.id)}
            className="h-7 rounded-[3px] bg-[#FC7160] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-105 active:brightness-95"
          >
            Delete
          </button>
        ),
      },
    ];
  }, [delM, updM]);

  return (
    <div className="mx-auto max-w-[980px]">
      <TablePanel
        rows={rows}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.amount} ${r.status}`}
        showTopBar={false}      // your screenshot has no "Total Members" header
        showExport={false}      // not in screenshot
        topSlot={
          <div className="relative flex items-center justify-center">
            <h1 className="text-[14px] font-semibold text-[#133374]">Overview of Membership Fees</h1>

            <div className="absolute right-0">
              <button
                type="button"
                onClick={() => {
                  // next step: open modal (reusable) like your album popup
                  // for now keep it clean to match UI without breaking build
                }}
                className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
              >
                <Plus size={16} />
                Add Fee Structure
              </button>
            </div>
          </div>
        }
        className="bg-white/80"
      />
    </div>
  );
}
