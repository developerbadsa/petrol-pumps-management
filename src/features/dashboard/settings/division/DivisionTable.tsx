'use client';

import {useMemo} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import type {DivisionRow} from './types';
import {useDeleteDivision, useDivisions} from './queries';

const BRAND = '#009970';

const btnBase =
  'h-7 rounded-[4px] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95';

const btnTop =
  'inline-flex h-9 items-center justify-center gap-2 rounded-[6px] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95';

export default function DivisionTable() {
  const q = useDivisions();
  const del = useDeleteDivision();

  const columns = useMemo<ColumnDef<DivisionRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        align: 'center',
        headerClassName: 'w-[90px]',
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'name',
        header: 'Division Name',
        sortable: true,
        sortValue: (r) => r.name,
        csvHeader: 'Division Name',
        csvValue: (r) => r.name,
        cell: (r) => <span className="text-[#2B3A4A]">{r.name}</span>,
      },
      {
        id: 'edit',
        header: 'Edit',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Edit',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => {
              // TODO: open "Edit Division" modal using r.id
              void r;
            }}
            className={`${btnBase} bg-[#133374]`}
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
        headerClassName: 'w-[150px]',
        csvHeader: 'Delete',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => del.mutate(r.id)}
            disabled={del.isPending}
            className={`${btnBase} bg-[#FC7160] disabled:opacity-60`}
          >
            Delete
          </button>
        ),
      },
    ];
  }, [del]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load divisions.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">
        Overview of Divisions
      </h2>

      <TablePanel<DivisionRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.name}`}
        showExport={false}
        totalLabel={(total) => (
          <div className="text-[14px] font-semibold text-[#2D8A2D]">
            Total Divisions : <span className="text-[#133374]">{total}</span>
          </div>
        )}
        controlsRightSlot={
          <button
            type="button"
            onClick={() => {
              // TODO: open "Add Division" modal
            }}
            className={btnTop}
            style={{backgroundColor: BRAND}}
          >
            Add Division
          </button>
        }
      />
    </div>
  );
}
