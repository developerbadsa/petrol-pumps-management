'use client';

import {useMemo} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {BadgeCheck, Pencil, Plus, Trash2} from 'lucide-react';
import type {OwnerRow} from './types';
import {useAddSection, useApproveOwner, useRejectOwner, useUnverifiedOwners} from './queries';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function ActionDot({
  title,
  onClick,
  bg,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  bg: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'grid h-6 w-6 place-items-center rounded-full shadow-sm',
        'disabled:opacity-60',
        bg
      )}
    >
      {children}
    </button>
  );
}

export default function UnverifiedOwnersTable() {
  const q = useUnverifiedOwners();
  const approveM = useApproveOwner();
  const rejectM = useRejectOwner(); // use this as "delete" for now
  const addSectionM = useAddSection();

  const busy = approveM.isPending || rejectM.isPending || addSectionM.isPending;

  const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
    const onEdit = (id: string) => {
      // Later: route to edit screen/modal
      console.log('Edit owner:', id);
    };

    return [
      {
        id: 'photo',
        header: 'Photo',
        sortable: false,
        headerClassName: 'w-[120px]',
        align: 'center',
        csvHeader: 'Photo',
        csvValue: () => '',
        cell: (r) => (
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-[14px] bg-[#F1F3F6] p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.photoUrl}
                alt={r.ownerName}
                className="h-full w-full rounded-[12px] object-cover"
              />
            </div>
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
        headerClassName: 'w-[190px]',
        csvHeader: 'Phone',
        csvValue: (r) => r.phone,
        cell: (r) => <span className="text-[#133374]">{r.phone}</span>,
      },
      {
        id: 'email',
        header: 'Email',
        sortable: true,
        sortValue: (r) => r.email ?? '',
        headerClassName: 'w-[260px]',
        csvHeader: 'Email',
        csvValue: (r) => r.email ?? '',
        cell: (r) => <span className="text-[#133374]">{r.email ?? '-'}</span>,
      },
      {
        id: 'address',
        header: 'Address',
        sortable: false,
        headerClassName: 'w-[340px]',
        csvHeader: 'Address',
        csvValue: (r) => r.address,
        cell: (r) => (
          <span className="text-[#133374] whitespace-pre-line">{r.address}</span>
        ),
      },
      {
        id: 'addSection',
        header: 'ADD SECTION',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[160px]',
        csvHeader: 'Add Section',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => addSectionM.mutate(r.id)}
            disabled={busy}
            className="grid h-9 w-9 place-items-center rounded-[6px] bg-[#133374] text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
            aria-label="Add section"
            title="Add section"
          >
            <Plus size={16} />
          </button>
        ),
      },
      {
        id: 'upazila',
        header: 'Upazila',
        sortable: false,
        align: 'center',
        headerClassName: 'w-[170px]',
        csvHeader: 'Upazila',
        csvValue: () => '',
        cell: (r) => (
          <div className="flex items-center justify-center gap-2">
            <ActionDot
              title="Approve"
              onClick={() => approveM.mutate(r.id)}
              disabled={busy}
              bg="bg-[#22C55E] text-white"
            >
              <BadgeCheck size={16} />
            </ActionDot>

            <ActionDot
              title="Delete"
              onClick={() => rejectM.mutate(r.id)}
              disabled={busy}
              bg="bg-[#EF4444] text-white"
            >
              <Trash2 size={14} />
            </ActionDot>

            <ActionDot
              title="Edit"
              onClick={() => onEdit(r.id)}
              disabled={busy}
              bg="bg-[#F59E0B] text-white"
            >
              <Pencil size={14} />
            </ActionDot>
          </div>
        ),
      },
    ];
  }, [addSectionM, approveM, rejectM, busy]);

  if (q.isLoading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load owners.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">
        Unverified Owner
      </h2>

      <TablePanel<OwnerRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) =>
          `${r.ownerName} ${r.phone} ${r.email ?? ''} ${r.address}`
        }
        showTopBar={false}
        showExport={false}
        exportFileName=""
      />
    </div>
  );
}
