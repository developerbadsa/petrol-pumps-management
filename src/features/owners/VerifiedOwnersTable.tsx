'use client';

import {useMemo} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {Check, Pencil, Plus, Trash2} from 'lucide-react';
import type {OwnerRow} from './types';
import {useVerifiedOwners, useRejectOwner} from './queries';

const BRAND = '#009970';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function ActionDot({
  title,
  onClick,
  bg,
  children,
}: {
  title: string;
  onClick: () => void;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cx(
        'grid h-6 w-6 place-items-center rounded-full shadow-sm',
        bg
      )}
    >
      {children}
    </button>
  );
}

export default function VerifiedOwnersTable() {
  const q = useVerifiedOwners();

  // We'll reuse reject() as "delete" in mock mode (it removes the row).
  // Later, swap to a real delete endpoint in the api repo.
  const deleteM = useRejectOwner();

  const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
    const onPrint = (id: string) => {
      // Placeholder behavior for now.
      // Later: open printable member card / PDF from API.
      window.open(`/mock/invoice-sample.pdf`, '_blank', 'noopener,noreferrer');
      console.log('Print member section for:', id);
    };

    const onAddUpazila = (id: string) => {
      // Later: open modal or navigate to upazila page.
      console.log('Add upazila for:', id);
    };

    const onVerify = (id: string) => {
      // In verified table, this may be "active" / "confirm" action.
      console.log('Verify/confirm for:', id);
    };

    const onEdit = (id: string) => {
      // Later: navigate to edit page.
      console.log('Edit owner:', id);
    };

    return [
      {
        id: 'memberId',
        header: 'Member ID',
        sortable: true,
        sortValue: (r) => r.memberId ?? '',
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Member ID',
        csvValue: (r) => r.memberId ?? '',
        cell: (r) => <span className="text-[#133374]">{r.memberId ?? '-'}</span>,
      },
      {
        id: 'photo',
        header: 'Photo',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[120px]',
        csvHeader: 'Photo',
        csvValue: () => '',
        cell: (r) => (
          <div className="flex justify-center">
            {/* Using <img> keeps it simple for mock remote URLs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.photoUrl}
              alt={r.ownerName}
              className="h-11 w-11 rounded-[10px] object-cover bg-white shadow-sm"
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
        cell: (r) => <span className="text-[#133374]">{r.ownerName}</span>,
      },
      {
        id: 'phone',
        header: 'Phone',
        sortable: true,
        sortValue: (r) => r.phone,
        csvHeader: 'Phone',
        csvValue: (r) => r.phone,
        cell: (r) => <span className="text-[#133374]">{r.phone}</span>,
      },
      {
        id: 'address',
        header: 'Address',
        sortable: false,
        csvHeader: 'Address',
        csvValue: (r) => r.address,
        cell: (r) => <span className="text-[#133374]">{r.address}</span>,
      },
      {
        id: 'addSection',
        header: 'ADD SECTION',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[140px]',
        csvHeader: 'Add Section',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => onPrint(r.id)}
            className="h-7 rounded-[6px] bg-[#DCE6FF] px-4 text-[11px] font-semibold text-[#2D5BFF] shadow-sm hover:brightness-105 active:brightness-95"
          >
            Print
          </button>
        ),
      },
      {
        id: 'upazila',
        header: 'Upazila',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[160px]',
        csvHeader: 'Upazila',
        csvValue: () => '',
        cell: (r) => (
          <div className="flex items-center justify-center gap-2">
            <ActionDot
              title="Add"
              onClick={() => onAddUpazila(r.id)}
              bg="bg-[#0E2A66] text-white"
            >
              <Plus size={14} />
            </ActionDot>

            <ActionDot
              title="Verify"
              onClick={() => onVerify(r.id)}
              bg="bg-[#22C55E] text-white"
            >
              <Check size={14} />
            </ActionDot>

            <ActionDot
              title="Delete"
              onClick={() => deleteM.mutate(r.id)}
              bg="bg-[#EF4444] text-white"
            >
              <Trash2 size={14} />
            </ActionDot>

            <ActionDot
              title="Edit"
              onClick={() => onEdit(r.id)}
              bg="bg-[#F59E0B] text-white"
            >
              <Pencil size={14} />
            </ActionDot>
          </div>
        ),
      },
    ];
  }, [deleteM]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load owners.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">
        Verified Owner
      </h2>

      <TablePanel<OwnerRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.memberId ?? ''} ${r.ownerName} ${r.phone} ${r.address}`}
        exportFileName=""         
        showTopBar={false}     
        showExport={false}
        className="shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
      />
    </div>
  );
}
