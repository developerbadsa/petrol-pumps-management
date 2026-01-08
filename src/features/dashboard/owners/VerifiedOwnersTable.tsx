'use client';

import { useCallback, useMemo, useState } from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type { ColumnDef } from '@/components/ui/table-panel/types';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import type { OwnerRow } from './types';
import { useVerifiedOwners, useRejectOwner, useUpdateOwner } from './queries';
import EditOwnerModal from './EditOwnerModal';

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
      className={cx('grid h-6 w-6 place-items-center rounded-full shadow-sm', bg)}
    >
      {children}
    </button>
  );
}

export default function VerifiedOwnersTable() {
  const q = useVerifiedOwners();
  const deleteM = useRejectOwner();
  const updateM = useUpdateOwner();

  const [editOpen, setEditOpen] = useState(false);
  const [active, setActive] = useState<OwnerRow | null>(null);

  const downloadOwnerCard = useCallback(async (row: OwnerRow) => {
    const canvas = document.createElement('canvas');
    const width = 680;
    const height = 420;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadImage = (src?: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        if (!src) {
          resolve(null);
          return;
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const [logo, photo] = await Promise.all([loadImage('/fav.png'), loadImage(row.photoUrl)]);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#E4B85E');
    bg.addColorStop(0.55, '#C9993D');
    bg.addColorStop(1, '#B9872C');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.arc(120 + i * 55, 320 - i * 18, 90, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#12306B';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('Bangladesh Petroleum Dealers', 150, 50);
    ctx.fillText('Distributors, Agents and', 150, 80);
    ctx.fillText('Petrol Pump Owners Association', 150, 110);

    ctx.fillStyle = '#B3392E';
    ctx.fillRect(240, 130, 220, 38);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Member', 310, 157);

    ctx.fillStyle = '#F5F7FB';
    ctx.fillRect(40, 150, 120, 140);
    ctx.strokeStyle = '#1F3B7A';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 150, 120, 140);
    if (photo) {
      ctx.drawImage(photo, 45, 155, 110, 130);
    } else {
      ctx.fillStyle = '#1F3B7A';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Photo', 70, 225);
    }

    if (logo) {
      ctx.drawImage(logo, 30, 20, 90, 90);
    }

    ctx.fillStyle = '#1F3B7A';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Member ID:', 190, 225);
    ctx.font = '16px sans-serif';
    ctx.fillText(row.memberId ?? '—', 290, 225);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Name:', 190, 250);
    ctx.font = '16px sans-serif';
    ctx.fillText(row.ownerName ?? '—', 250, 250);

    ctx.fillStyle = '#1F3B7A';
    ctx.fillRect(430, 210, 170, 170);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('QR', 510, 300);

    ctx.strokeStyle = '#1F3B7A';
    ctx.beginPath();
    ctx.moveTo(50, 330);
    ctx.lineTo(190, 330);
    ctx.stroke();
    ctx.fillStyle = '#1F3B7A';
    ctx.font = '12px sans-serif';
    ctx.fillText('Authorized Signature', 60, 350);

    const link = document.createElement('a');
    link.download = `owner-card-${row.memberId ?? row.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
    const onPrint = (row: OwnerRow) => {
      void downloadOwnerCard(row);
    };

    const onAddUpazila = (id: string) => {
      console.log('Add upazila for:', id);
    };

    const onVerify = (id: string) => {
      console.log('Verify/confirm for:', id);
    };

    const onEdit = (row: OwnerRow) => {
      setActive(row);
      setEditOpen(true);
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
            onClick={() => onPrint(r)}
            className="h-7 rounded-[6px] bg-[#DCE6FF] px-4 text-[11px] font-semibold text-[#2D5BFF] shadow-sm hover:brightness-105 active:brightness-95"
          >
            Download Card
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
            <ActionDot title="Add" onClick={() => onAddUpazila(r.id)} bg="bg-[#0E2A66] text-white">
              <Plus size={14} />
            </ActionDot>

            <ActionDot title="Verify" onClick={() => onVerify(r.id)} bg="bg-[#22C55E] text-white">
              <Check size={14} />
            </ActionDot>

            <ActionDot title="Delete" onClick={() => deleteM.mutate(r.id)} bg="bg-[#EF4444] text-white">
              <Trash2 size={14} />
            </ActionDot>

            <ActionDot title="Edit" onClick={() => onEdit(r)} bg="bg-[#F59E0B] text-white">
              <Pencil size={14} />
            </ActionDot>
          </div>
        ),
      },
    ];
  }, [deleteM, downloadOwnerCard]);

  if (q.isLoading) return <Loader label="Loading..." />;
  if (q.isError) return <div className="text-sm text-red-600">Failed to load owners.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-center text-[16px] font-semibold text-[#2B3A4A]">Verified Owner</h2>

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
