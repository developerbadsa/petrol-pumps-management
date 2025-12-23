// src/features/dashboard/settings/upazila-thana/UpazilaTable.tsx
'use client';

import {useMemo} from 'react';
import {Plus} from 'lucide-react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import type {UpazilaRow} from './types';
import {useDeleteUpazila, useUpazilas} from './queries';

export default function UpazilaTable() {
  const q = useUpazilas();
  const del = useDeleteUpazila();

  const columns = useMemo<ColumnDef<UpazilaRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: '#',
        sortable: true,
        sortValue: (r) => r.sl,
        align: 'center',
        headerClassName: 'w-[80px]',
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        cell: (r) => String(r.sl),
      },
      {
        id: 'divisionName',
        header: 'Division Name',
        sortable: true,
        sortValue: (r) => r.divisionName,
        csvHeader: 'Division Name',
        csvValue: (r) => r.divisionName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.divisionName}</span>,
      },
      {
        id: 'districtName',
        header: 'District Name',
        sortable: true,
        sortValue: (r) => r.districtName,
        csvHeader: 'District Name',
        csvValue: (r) => r.districtName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.districtName}</span>,
      },
      {
        id: 'upazilaName',
        header: 'Upazila Name',
        sortable: true,
        sortValue: (r) => r.upazilaName,
        csvHeader: 'Upazila Name',
        csvValue: (r) => r.upazilaName,
        cell: (r) => <span className="text-[#2B3A4A]">{r.upazilaName}</span>,
      },
      {
        id: 'edit',
        header: 'Edit',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[130px]',
        csvHeader: 'Edit',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => console.log('edit', r.id)}
            className="h-7 rounded-[4px] bg-[#133374] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
          >
            Edit
          </button>
        ),
      },
      {
        id: 'delete',
        header: 'Delete',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Delete',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            disabled={del.isPending}
            onClick={() => del.mutate(r.id)}
            className="h-7 rounded-[4px] bg-[#FF5B5B] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-70"
          >
            Delete
          </button>
        ),
      },
    ];
  }, [del]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load upazilas.</div>;

  return (
    <div className="space-y-4">
      {/* simple header row (no extra card) */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#2B3A4A]">Overview of Upazila</h2>

        <button
          type="button"
          onClick={() => console.log('add upazila')}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95"
        >
          <Plus size={16} />
          Add Upazila
        </button>
      </div>

      <TablePanel<UpazilaRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.divisionName} ${r.districtName} ${r.upazilaName}`}
        exportFileName="upazilas.csv"
        exportLabel="Export to Excel"
        showTopBar={false}
      />
    </div>
  );
}
