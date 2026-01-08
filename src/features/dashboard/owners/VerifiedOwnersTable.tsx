'use client';

import {useCallback, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {Check, Eye, Pencil, Plus, Trash2} from 'lucide-react';
import Loader from '@/components/shared/Loader';
import type {OwnerRow} from './types';
import {useVerifiedOwners, useRejectOwner, useUpdateOwner} from './queries';
import EditOwnerModal from './EditOwnerModal';
import {Download} from 'lucide-react';
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
         type='button'
         title={title}
         aria-label={title}
         onClick={onClick}
         className={cx(
            'grid h-6 w-6 place-items-center rounded-full shadow-sm',
            bg
         )}>
         {children}
      </button>
   );
}

export default function VerifiedOwnersTable() {
   const router = useRouter();
   const q = useVerifiedOwners();
   const deleteM = useRejectOwner();
   const updateM = useUpdateOwner();

   const [editOpen, setEditOpen] = useState(false);
   const [active, setActive] = useState<OwnerRow | null>(null);

   const downloadOwnerCard = useCallback(async (row: OwnerRow) => {
      const canvas = document.createElement('canvas');
      const width = 900;
      const height = 560;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const loadImage = (src?: string) =>
         new Promise<HTMLImageElement | null>(resolve => {
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

      const qrPayload = [
         `Member ID: ${row.memberId ?? row.id}`,
         `Name: ${row.ownerName ?? '—'}`,
         `Phone: ${row.phone ?? '—'}`,
         `Email: ${row.email ?? '—'}`,
      ].join('\n');

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
         qrPayload
      )}`;

      const [logo, photo, qr] = await Promise.all([
         loadImage('/fav.png'),
         row.photoUrl?.startsWith('data:image/svg')
            ? Promise.resolve(null)
            : loadImage(row.photoUrl),
         loadImage(qrUrl),
      ]);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#F5D68B');
      bg.addColorStop(0.55, '#D6A750');
      bg.addColorStop(1, '#BF8B2E');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0B2B6D';
      ctx.fillRect(0, 0, width, 120);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px "Segoe UI", sans-serif';
      ctx.fillText('Bangladesh Petroleum Dealers', 150, 42);
      ctx.font = 'bold 22px "Segoe UI", sans-serif';
      ctx.fillText(
         'Distributors, Agents and Petrol Pump Owners Association',
         150,
         74
      );
      ctx.font = '16px "Segoe UI", sans-serif';
      ctx.fillText('Professional Membership Identification Card', 150, 98);

      if (logo) {
         ctx.fillStyle = '#FFFFFF';
         ctx.beginPath();
         ctx.arc(80, 60, 46, 0, Math.PI * 2);
         ctx.fill();
         ctx.drawImage(logo, 40, 20, 80, 80);
      }

      ctx.fillStyle = '#B3392E';
      ctx.fillRect(40, 140, 220, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px "Segoe UI", sans-serif';
      ctx.fillText('Member', 115, 165);

      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(40, 190, 200, 240);
      ctx.strokeStyle = '#1F3B7A';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 190, 200, 240);
      if (photo) {
         ctx.drawImage(photo, 45, 195, 190, 230);
      } else {
         ctx.fillStyle = '#1F3B7A';
         ctx.font = 'bold 16px "Segoe UI", sans-serif';
         ctx.fillText('Photo', 110, 320);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(270, 140, 590, 290);
      ctx.strokeStyle = '#1F3B7A';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(270, 140, 590, 290);

      ctx.fillStyle = '#0B2B6D';
      ctx.font = 'bold 18px "Segoe UI", sans-serif';
      ctx.fillText('Member Information', 300, 175);

      ctx.fillStyle = '#1F3B7A';
      ctx.font = 'bold 15px "Segoe UI", sans-serif';
      ctx.fillText('Member ID', 300, 215);
      ctx.fillText('Full Name', 300, 255);
      ctx.fillText('Phone', 300, 295);
      ctx.fillText('Email', 300, 335);
      ctx.fillText('Address', 300, 375);

      ctx.fillStyle = '#111827';
      ctx.font = '15px "Segoe UI", sans-serif';
      ctx.fillText(row.memberId ?? row.id ?? '—', 440, 215);
      ctx.fillText(row.ownerName ?? '—', 440, 255);
      ctx.fillText(row.phone ?? '—', 440, 295);
      ctx.fillText(row.email ?? '—', 440, 335);
      ctx.fillText(row.address ?? '—', 440, 375);

      if (qr) {
         ctx.fillStyle = '#FFFFFF';
         ctx.fillRect(640, 200, 200, 200);
         ctx.strokeStyle = '#1F3B7A';
         ctx.strokeRect(640, 200, 200, 200);
         ctx.drawImage(qr, 650, 210, 180, 180);
         ctx.fillStyle = '#1F3B7A';
         ctx.font = '12px "Segoe UI", sans-serif';
         ctx.fillText('Scan for verification', 665, 415);
      }

      ctx.fillStyle = '#0B2B6D';
      ctx.fillRect(0, 460, width, 100);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px "Segoe UI", sans-serif';
      ctx.fillText(
         'Authorized by: Bangladesh Petroleum Dealers Association',
         40,
         500
      );
      ctx.fillText(
         'This card is non-transferable and remains property of the association.',
         40,
         525
      );
      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(640, 520);
      ctx.lineTo(840, 520);
      ctx.stroke();
      ctx.fillText('Authorized Signature', 660, 545);

      const link = document.createElement('a');
      link.download = `owner-card-${row.memberId ?? row.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
   }, []);

   const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
      const onPrint = (row: OwnerRow) => {
         void downloadOwnerCard(row);
      };

      const onAddStation = (id: string) => {
         console.log('Add station for:', id);
      };

      const onVerify = (id: string) => {
         router.push(`/manage-owners/verified/${id}`);
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
            sortValue: r => r.memberId ?? '',
            align: 'center',
            headerClassName: 'w-[140px]',
            csvHeader: 'Member ID',
            csvValue: r => r.memberId ?? '',
            cell: r => (
               <span className='text-[#133374]'>{r.memberId ?? '-'}</span>
            ),
         },
         {
            id: 'photo',
            header: 'Photo',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[120px]',
            csvHeader: 'Photo',
            csvValue: () => '',
            cell: r => (
               <div className='flex justify-center'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                     src={r.photoUrl}
                     alt={r.ownerName}
                     className='h-11 w-11 rounded-[10px] object-cover bg-white shadow-sm'
                  />
               </div>
            ),
         },
         {
            id: 'ownerName',
            header: 'Owner Name',
            sortable: true,
            sortValue: r => r.ownerName,
            csvHeader: 'Owner Name',
            csvValue: r => r.ownerName,
            cell: r => <span className='text-[#133374]'>{r.ownerName}</span>,
         },
         {
            id: 'phone',
            header: 'Phone',
            sortable: true,
            sortValue: r => r.phone,
            csvHeader: 'Phone',
            csvValue: r => r.phone,
            cell: r => <span className='text-[#133374]'>{r.phone}</span>,
         },
         {
            id: 'address',
            header: 'Address',
            sortable: false,
            csvHeader: 'Address',
            csvValue: r => r.address,
            cell: r => <span className='text-[#133374]'>{r.address}</span>,
         },
         {
            id: 'carddownload',
            header: 'Download Card',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[140px]',
            csvHeader: 'Add Section',
            csvValue: () => '',
            cell: r => (
               <button
                  type='button'
                  onClick={() => onPrint(r)}
                  className='h-7 rounded-[6px] bg-[#DCE6FF] flex items-center gap-2 px-4 text-[11px] font-semibold text-[#2D5BFF] shadow-sm hover:brightness-105 active:brightness-95'>
                  <Download size={16} /> <span className='mt-1'>Card</span>
               </button>
            ),
         },
         {
            id: 'options',
            header: 'Options',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[160px]',
            csvHeader: 'Options',
            csvValue: () => '',
            cell: r => (
               <div className='flex items-center justify-center gap-2'>
                  <ActionDot
                     title='Add'
                     onClick={() => onAddStation(r.id)}
                     bg='bg-[#0E2A66] text-white'>
                     <Plus size={14} />
                  </ActionDot>

                  <ActionDot
                     title='Verify'
                     onClick={() => onVerify(r.id)}
                     bg='bg-[#22C55E] text-white'>
                     <Eye size={14} />
                  </ActionDot>

                  <ActionDot
                     title='Delete'
                     onClick={() => deleteM.mutate(r.id)}
                     bg='bg-[#EF4444] text-white'>
                     <Trash2 size={14} />
                  </ActionDot>

                  <ActionDot
                     title='Edit'
                     onClick={() => onEdit(r)}
                     bg='bg-[#F59E0B] text-white'>
                     <Pencil size={14} />
                  </ActionDot>
               </div>
            ),
         },
      ];
   }, [deleteM, downloadOwnerCard, router]);

   if (q.isLoading) return <Loader label='Loading...' />;
   if (q.isError)
      return <div className='text-sm text-red-600'>Failed to load owners.</div>;

   return (
      <div className='space-y-4'>
         <h2 className='text-center text-[16px] font-semibold text-[#2B3A4A]'>
            Verified Owner
         </h2>

         <TablePanel<OwnerRow>
            rows={q.data ?? []}
            columns={columns}
            getRowKey={r => r.id}
            searchText={r =>
               `${r.memberId ?? ''} ${r.ownerName} ${r.phone} ${r.address}`
            }
            exportFileName=''
            showTopBar={false}
            showExport={false}
            className='shadow-[0_18px_55px_rgba(0,0,0,0.10)]'
         />

         <EditOwnerModal
            open={editOpen}
            owner={active}
            busy={updateM.isPending}
            onClose={() => {
               setEditOpen(false);
               setActive(null);
            }}
            onSave={input => {
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
