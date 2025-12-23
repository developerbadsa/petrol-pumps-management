'use client';

import Link from 'next/link';
import {Plus} from 'lucide-react';
import {useMemo} from 'react';

import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';

import {useDeleteNotice, useNoticesList} from './queries';
import type {NoticeRow} from './types';

export default function NoticesOverviewSection() {
  const {data = [], isLoading} = useNoticesList();
  const del = useDeleteNotice();

  const columns = useMemo<ColumnDef<NoticeRow>[]>(() => {
    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: r => r.sl,
        csvHeader: 'SL',
        csvValue: r => r.sl,
        headerClassName: 'w-[90px]',
        minWidth: 90,
        cell: r => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'title',
        header: 'Notice List',
        sortable: true,
        sortValue: r => r.title,
        csvHeader: 'Notice',
        csvValue: r => r.title,
        cell: r => (
          <div className="max-w-[520px]">
            {r.href ? (
              <Link
                href={r.href}
                className="text-[11px] font-medium text-[#2B69C7] hover:underline"
              >
                {r.title}
              </Link>
            ) : (
              <span className="text-[11px] font-medium text-[#2B69C7]">{r.title}</span>
            )}
          </div>
        ),
      },
      {
        id: 'publishDate',
        header: 'Publish Date',
        sortable: true,
        sortValue: r => r.publishDate,
        csvHeader: 'Publish Date',
        csvValue: r => r.publishDate,
        headerClassName: 'w-[150px]',
        minWidth: 150,
        cell: r => <span className="text-[11px] text-[#2B3A4A]">{r.publishDate}</span>,
      },
      {
        id: 'view',
        header: 'View',
        sortable: false,
        csvHeader: 'View',
        csvValue: () => '',
        headerClassName: 'w-[120px]',
        minWidth: 120,
        cell: r => (
          <Link
            href={r.href ?? '#'}
            className="inline-flex h-6 items-center justify-center rounded-[3px] bg-[#12306B] px-4 text-[10px] font-semibold text-white"
          >
            View
          </Link>
        ),
      },
      {
        id: 'delete',
        header: 'Delete',
        sortable: false,
        csvHeader: 'Delete',
        csvValue: () => '',
        headerClassName: 'w-[130px]',
        minWidth: 130,
        cell: r => (
          <button
            type="button"
            onClick={() => del.mutate(r.id)}
            disabled={del.isPending}
            className="inline-flex h-6 items-center justify-center rounded-[3px] bg-[#FF5B5B] px-4 text-[10px] font-semibold text-white disabled:opacity-60"
          >
            Delete
          </button>
        ),
      },
    ];
  }, [del]);

  return (
    <section className="min-w-0">
      <h2 className="text-center text-[14px] font-semibold text-[#133374]">
        Overview of Notices
      </h2>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          className="inline-flex h-8 items-center gap-2 rounded-[4px] bg-[#009970] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
        >
          <Plus size={14} />
          Add Notice
        </button>
      </div>

      <div className="mt-4">
        <TablePanel<NoticeRow>
          rows={isLoading ? [] : data}
          columns={columns}
          getRowKey={(r) => r.id}
          searchText={(r) => `${r.title} ${r.publishDate}`}
          showExport={false}
          totalLabel={(n) => (
            <div className="text-[14px] font-semibold text-[#2D8A2D]">
              Total Notices : <span className="text-[#133374]">{n}</span>
            </div>
          )}
          cellWrapClassName="min-h-[58px] py-2 flex items-center"
        />
      </div>
    </section>
  );
}
