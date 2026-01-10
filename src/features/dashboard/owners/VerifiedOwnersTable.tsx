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
import StationFormModal from '@/features/dashboard/stations/StationFormModal';
import type {StationFormDefaults} from '@/features/dashboard/stations/StationForm';
import {useCreateStation} from '@/features/dashboard/stations/verified/queries';
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
   const createStationM = useCreateStation();

   const [editOpen, setEditOpen] = useState(false);
   const [active, setActive] = useState<OwnerRow | null>(null);
   const [stationOpen, setStationOpen] = useState(false);
   const [stationDefaults, setStationDefaults] =
      useState<StationFormDefaults | null>(null);
   const [stationError, setStationError] = useState('');

   const downloadOwnerCard = useCallback(async (row: OwnerRow) => {
      const canvas = document.createElement('canvas');
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

      const resolvePhotoUrl = (url?: string) => {
         if (!url) return undefined;
         if (url.startsWith('data:image/svg')) return undefined;
         if (/^https?:\/\//i.test(url)) {
            return `/api/image-proxy?url=${encodeURIComponent(url)}`;
         }
         return url;
      };

      const [card, photo] = await Promise.all([
         loadImage('/id-card/ID.jpg'),
         loadImage(resolvePhotoUrl(row.photoUrl)),
      ]);

      const width = card?.width ?? 900;
      const height = card?.height ?? 560;
      canvas.width = width;
      canvas.height = height;

      if (card) {
         ctx.drawImage(card, 0, 0, width, height);
      } else {
         ctx.fillStyle = '#F3F4F6';
         ctx.fillRect(0, 0, width, height);
      }

      const frontHeight = height / 2;
      const nameText = row.ownerName ?? '—';
      const memberIdText = row.memberId ?? row.id ?? '—';

      const drawRoundedRect = (
         x: number,
         y: number,
         w: number,
         h: number,
         r: number
      ) => {
         ctx.beginPath();
         ctx.moveTo(x + r, y);
         ctx.lineTo(x + w - r, y);
         ctx.quadraticCurveTo(x + w, y, x + w, y + r);
         ctx.lineTo(x + w, y + h - r);
         ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
         ctx.lineTo(x + r, y + h);
         ctx.quadraticCurveTo(x, y + h, x, y + h - r);
         ctx.lineTo(x, y + r);
         ctx.quadraticCurveTo(x, y, x + r, y);
         ctx.closePath();
      };

      const drawFittedText = (
         text: string,
         x: number,
         y: number,
         maxWidth: number,
         fontWeight: number,
         fontSize: number
      ) => {
         let size = fontSize;
         ctx.font = `${fontWeight} ${size}px "Segoe UI", sans-serif`;
         while (ctx.measureText(text).width > maxWidth && size > 12) {
            size -= 1;
            ctx.font = `${fontWeight} ${size}px "Segoe UI", sans-serif`;
         }
         ctx.fillText(text, x, y);
      };

      const drawCoverImage = (
         image: HTMLImageElement,
         x: number,
         y: number,
         w: number,
         h: number
      ) => {
         const scale = Math.max(w / image.width, h / image.height);
         const sw = w / scale;
         const sh = h / scale;
         const sx = (image.width - sw) / 2;
         const sy = (image.height - sh) / 2;
         ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
      };

      const photoFrame = {
         x: width * 0.065,
         y: frontHeight * 0.42,
         w: width * 0.15,
         h: frontHeight * 0.34,
      };

      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(
         photoFrame.x,
         photoFrame.y,
         photoFrame.w,
         photoFrame.h,
         16
      );
      ctx.fill();
      ctx.restore();

      ctx.save();
      drawRoundedRect(
         photoFrame.x + 6,
         photoFrame.y + 6,
         photoFrame.w - 12,
         photoFrame.h - 12,
         12
      );
      ctx.clip();
      if (photo) {
         drawCoverImage(
            photo,
            photoFrame.x + 6,
            photoFrame.y + 6,
            photoFrame.w - 12,
            photoFrame.h - 12
         );
      } else {
         ctx.fillStyle = '#E5E7EB';
         ctx.fillRect(
            photoFrame.x + 6,
            photoFrame.y + 6,
            photoFrame.w - 12,
            photoFrame.h - 12
         );
         ctx.fillStyle = '#111827';
         ctx.font = '600 16px "Segoe UI", sans-serif';
         ctx.fillText(
            'Photo',
            photoFrame.x + photoFrame.w * 0.32,
            photoFrame.y + photoFrame.h * 0.55
         );
      }
      ctx.restore();

      ctx.fillStyle = '#1F2937';
      drawFittedText(
         nameText,
         width * 0.34,
         frontHeight * 0.55,
         width * 0.52,
         700,
         Math.round(width * 0.03)
      );

      ctx.fillStyle = '#111827';
      drawFittedText(
         memberIdText,
         width * 0.415,
         frontHeight * 0.64,
         width * 0.28,
         600,
         Math.round(width * 0.026)
      );

      const link = document.createElement('a');
      link.download = `owner-card-${row.memberId ?? row.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
   }, []);

   const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
      const onPrint = (row: OwnerRow) => {
         void downloadOwnerCard(row);
      };

      const onAddStation = (row: OwnerRow) => {
         setStationDefaults({
            station_owner_id: row.id,
            contact_person_name: row.ownerName ?? '',
            contact_person_phone: row.phone ?? '',
            station_address: row.address ?? '',
         });
         setStationError('');
         setStationOpen(true);
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
                     onClick={() => onAddStation(r)}
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

         <StationFormModal
            open={stationOpen}
            mode='create'
            saving={createStationM.isPending}
            error={stationError}
            initialValues={stationDefaults ?? undefined}
            onClose={() => {
               setStationOpen(false);
               setStationDefaults(null);
               setStationError('');
            }}
            onSubmit={async payload => {
               setStationError('');

               const normalizedPayload = {
                  ...payload,
                  station_owner_id: payload.station_owner_id ?? undefined,
               };

               try {
                  await createStationM.mutateAsync(normalizedPayload as any);
                  setStationOpen(false);
                  setStationDefaults(null);
               } catch (e: any) {
                  setStationError(e?.message ?? 'Failed to save station');
               }
            }}
         />
      </div>
   );
}
