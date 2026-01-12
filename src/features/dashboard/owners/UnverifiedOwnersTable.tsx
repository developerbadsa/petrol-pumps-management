'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import { BadgeCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import type { OwnerRow } from './types';
import { useApproveOwner, useRejectOwner, useUnverifiedOwners, useUpdateOwner } from './queries';
import EditOwnerModal from './EditOwnerModal';

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
      className={cx('grid h-6 w-6 place-items-center rounded-full shadow-sm', 'disabled:opacity-60', bg)}
    >
      {children}
    </button>
  );
}

export default function UnverifiedOwnersTable() {
  const router = useRouter();
  const q = useUnverifiedOwners();
  const approveM = useApproveOwner();
  const rejectM = useRejectOwner();
  const updateM = useUpdateOwner();

  const [editOpen, setEditOpen] = useState(false);
  const [active, setActive] = useState<OwnerRow | null>(null);
  const busy = approveM.isPending || rejectM.isPending || updateM.isPending;

  const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
    const onEdit = (row: OwnerRow) => {
      setActive(row);
      setEditOpen(true);
    };

    const onAddStation = (row: OwnerRow) => {
      const params = new URLSearchParams({
        returnTo: '/manage-owners/unverified',
        ownerId: row.id,
        ownerName: row.ownerName ?? '',
        ownerPhone: row.phone ?? '',
        ownerAddress: row.address ?? '',
      });
      router.push(`/manage-stations/create-station?${params.toString()}`);
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
              <img src={r.photoUrl} alt={r.ownerName} className="h-full w-full rounded-[12px] object-cover" />
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
        cell: (r) => <span className="text-[#133374] whitespace-pre-line">{r.address}</span>,
      },
      {
        id: 'addSection',
        header: 'Add Station',
        sortable: false,
        align: 'center',
        headerClassName: '',
        csvHeader: 'Verify',
        csvValue: () => '',
        cell: (r) => (
          <button
            type="button"
            onClick={() => onAddStation(r)}
            disabled={busy}
            className="grid h-9 w-9 place-items-center rounded-[6px] bg-[#133374] text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
            aria-label="Verify"
            title="Verify"
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
            <ActionDot title="Approve" onClick={() => approveM.mutate(r.id)} disabled={busy} bg="bg-[#22C55E] text-white">
              <BadgeCheck size={16} />
            </ActionDot>

            <ActionDot title="Delete" onClick={() => rejectM.mutate(r.id)} disabled={busy} bg="bg-[#EF4444] text-white">
              <Trash2 size={14} />
            </ActionDot>

            <ActionDot title="Edit" onClick={() => onEdit(r)} disabled={busy} bg="bg-[#F59E0B] text-white">
              <Pencil size={14} />
            </ActionDot>
          </div>
        ),
      },
    ];
  }, [approveM, rejectM, busy, router]);

  if (q.isLoading) return <Loader label="Loading..." />;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load owners.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">Unverified Owner</h2>

      <TablePanel<OwnerRow>
        rows={q.data ?? []}
        columns={columns}
        getRowKey={(r) => r.id}
        searchText={(r) => `${r.ownerName} ${r.phone} ${r.email ?? ''} ${r.address}`}
        showTopBar={false}
        showExport={false}
        exportFileName=""
      />

      <EditOwnerModal
        open={editOpen}
        owner={active}
        busy={updateM.isPending}
        onClose={() => {
          setEditOpen(false);
          setActive(null);
        }}
        onSave={(input) => {
          if (!active) return;
          updateM.mutate({
            id: active.id,
            input: {
              fullName: input.fullName,
              phoneNumber: input.phoneNumber,
              email: input.email,
              address: input.address,
            },
          });
          setEditOpen(false);
          setActive(null);
        }}
      />

    </div>
  );
}
