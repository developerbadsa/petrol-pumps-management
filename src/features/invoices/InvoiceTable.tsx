'use client';

import {useMemo} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import type {InvoiceRow} from './types';
import {useInvoices} from './queries';

const BRAND = '#009970';

export default function InvoiceTable() {
  const q = useInvoices();

  const columns = useMemo<ColumnDef<InvoiceRow>[]>(() => {
    const openUrl = (url?: string) => {
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    const downloadUrl = (url?: string) => {
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    return [
      {
        id: 'sl',
        header: 'SL#',
        sortable: true,
        sortValue: (r) => r.sl,
        align: 'center',
        headerClassName: 'w-[80px]',
        csvHeader: 'SL',
        csvValue: (r) => r.sl,
        cell: (r) => String(r.sl).padStart(2, '0'),
      },
      {
        id: 'title',
        header: 'Invoice List',
        sortable: true,
        sortValue: (r) => r.title,
        csvHeader: 'Invoice List',
        csvValue: (r) => r.title,
        cell: (r) => (
          <span className="block max-w-[520px] truncate text-[#2B3A4A]">
            {r.title}
          </span>
        ),
      },
      {
        id: 'invoiceNumber',
        header: 'Invoice Number',
        sortable: true,
        sortValue: (r) => r.invoiceNumber,
        align: 'center',
        headerClassName: 'w-[170px]',
        csvHeader: 'Invoice Number',
        csvValue: (r) => r.invoiceNumber,
        cell: (r) => <span className="text-[#2B3A4A]">{r.invoiceNumber}</span>,
      },
      {
        id: 'view',
        header: 'View',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[130px]',
        csvHeader: 'View',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => openUrl(r.viewUrl)}
            className="h-7 rounded-[4px] bg-[#133374] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
          >
            View
          </button>
        ),
      },
      {
        id: 'download',
        header: 'Download',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Download',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => downloadUrl(r.downloadUrl)}
            className="h-7 rounded-[4px] bg-[#009970] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
            style={{backgroundColor: BRAND}}
          >
            Download
          </button>
        ),
      },
    ];
  }, []);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load invoices.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">Invoice</h2>

      <TablePanel<InvoiceRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.title} ${r.invoiceNumber}`}
        exportFileName="invoices.csv"
        exportLabel="Export to Excel"
        totalLabel={(total) => (
          <div className="text-[14px] font-semibold text-[#2D8A2D]">
            Total Invoices : <span className="text-[#133374]">{total}</span>
          </div>
        )}
      />
    </div>
  );
}
