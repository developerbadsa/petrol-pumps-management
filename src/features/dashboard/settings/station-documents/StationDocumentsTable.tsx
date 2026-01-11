'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import Loader from '@/components/shared/Loader';
import type { StationDocumentRow } from './types';
import {
  useCreateStationDocument,
  useDeleteStationDocument,
  useStationDocuments,
  useUpdateStationDocument,
} from './queries';
import StationDocumentFormModal from './StationDocumentFormModal';

const BRAND = '#009970';

const btnBase =
  'h-7 rounded-[4px] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95';

const btnTop =
  'inline-flex h-9 items-center justify-center gap-2 rounded-[6px] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95';

export default function StationDocumentsTable() {
  const q = useStationDocuments();
  const del = useDeleteStationDocument();
  const createM = useCreateStationDocument();
  const updateM = useUpdateStationDocument();
  const searchParams = useSearchParams();
  const stationIdParam = searchParams.get('stationId');
  const stationIdFilter = stationIdParam ? Number(stationIdParam) : null;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [activeRow, setActiveRow] = useState<StationDocumentRow | null>(null);
  const [formError, setFormError] = useState('');

  const columns = useMemo<ColumnDef<StationDocumentRow>[]>(() => {
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
        id: 'station',
        header: 'Station ID',
        sortable: true,
        sortValue: (r) => r.stationId ?? 0,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Station ID',
        csvValue: (r) => r.stationId ?? '',
        cell: (r) => <span className="text-[#2B3A4A]">{r.stationId ?? '-'}</span>,
      },
      {
        id: 'type',
        header: 'Document Type',
        sortable: true,
        sortValue: (r) => r.documentType,
        csvHeader: 'Document Type',
        csvValue: (r) => r.documentType,
        cell: (r) => <span className="text-[#2B3A4A]">{r.documentType}</span>,
      },
      {
        id: 'file',
        header: 'File',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'File',
        csvValue: (r) => r.fileUrl ?? '',
        cell: (r) =>
          r.fileUrl ? (
            <a
              href={r.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold text-[#133374] hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-[11px] text-[#94A3B8]">No file</span>
          ),
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
              setFormError('');
              setMode('edit');
              setActiveRow(r);
              setOpen(true);
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
  }, [del.isPending]);

  if (q.isLoading) return <Loader label="Loading..." />;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load documents.</div>;

  const rows = q.data ?? [];
  const filteredRows =
    stationIdFilter && Number.isFinite(stationIdFilter)
      ? rows.filter((row) => row.stationId === stationIdFilter)
      : rows;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">
        Overview of Station Documents
      </h2>

      <TablePanel<StationDocumentRow>
        rows={filteredRows}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.sl} ${r.stationId ?? ''} ${r.documentType}`}
        showExport={false}
        totalLabel={(total) => (
          <div className="text-[14px] font-semibold text-[#2D8A2D]">
            Total Station Documents : <span className="text-[#133374]">{total}</span>
          </div>
        )}
        controlsRightSlot={
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setMode('create');
              setActiveRow(null);
              setOpen(true);
            }}
            className={btnTop}
            style={{ backgroundColor: BRAND }}
          >
            Add Document
          </button>
        }
      />

      <StationDocumentFormModal
        open={open}
        mode={mode}
        initial={activeRow}
        onClose={() => {
          setOpen(false);
          setActiveRow(null);
          setFormError('');
        }}
        saving={createM.isPending || updateM.isPending}
        error={formError}
        onSubmit={async (payload) => {
          setFormError('');

          if (!payload.gasStationId || !Number.isFinite(payload.gasStationId)) {
            setFormError('Valid gas station ID is required');
            return;
          }

          if (!payload.documentType.trim()) {
            setFormError('Document type is required');
            return;
          }

          if (mode === 'create' && !payload.file) {
            setFormError('File is required');
            return;
          }

          try {
            if (mode === 'create') {
              await createM.mutateAsync(payload);
            } else {
              if (!activeRow?.id) {
                setFormError('Invalid station document id');
                return;
              }
              await updateM.mutateAsync({ id: activeRow.id, patch: payload });
            }

            setOpen(false);
            setActiveRow(null);
          } catch (e: any) {
            setFormError(e?.message ?? 'Failed to save station document');
          }
        }}
      />
    </div>
  );
}
