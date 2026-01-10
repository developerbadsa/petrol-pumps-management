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
import {downloadOwnerCard} from './card/downloadOwnerCard';
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

   const handleDownloadCard = useCallback((row: OwnerRow) => {
      void downloadOwnerCard(row);
   }, []);

   const columns = useMemo<ColumnDef<OwnerRow>[]>(() => {
      const onPrint = (row: OwnerRow) => {
         handleDownloadCard(row);
      };

      const onAddStation = (row: OwnerRow) => {
         const params = new URLSearchParams({
            returnTo: '/manage-owners/verified',
            ownerId: row.id,
            ownerName: row.ownerName ?? '',
            ownerPhone: row.phone ?? '',
            ownerAddress: row.address ?? '',
         });
         router.push(`/manage-stations/create-station?${params.toString()}`);
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
   }, [deleteM, handleDownloadCard, router]);

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
