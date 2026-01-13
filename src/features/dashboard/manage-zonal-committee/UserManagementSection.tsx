'use client';

import {useMemo, useState} from 'react';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import Loader from '@/components/shared/Loader';
import AddZonalCommitteeModal from './AddZonalCommitteeModal';
import {
   useDeleteZonalCommitteeMember,
   useZonalCommitteeMembers,
} from './queries';
import type {ZonalCommitteeRow} from './types';
import EditZonalCommitteeModal from './EditZonalCommitteeModal';

function Pill({label, className}: {label: string; className: string}) {
   return (
      <span
         className={[
            'inline-flex h-[22px] items-center rounded-full px-4 text-[11px] font-semibold',
            'whitespace-nowrap',
            className,
         ].join(' ')}>
         {label}
      </span>
   );
}

export default function UserManagementSection() {
   const q = useZonalCommitteeMembers();
   const delM = useDeleteZonalCommitteeMember();

   const [addOpen, setAddOpen] = useState(false);

   const [editOpen, setEditOpen] = useState(false);
   const [editing, setEditing] = useState<ZonalCommitteeRow | null>(null);

   const rows = useMemo(() => q.data ?? [], [q.data]);

   const columns = useMemo<ColumnDef<ZonalCommitteeRow>[]>(
      () => [
         {
            id: 'name',
            header: 'Name',
            sortable: true,
            sortValue: (r) => r.fullName,
            minWidth: 420,
            headerClassName: 'min-w-[305px]',
            cell: (r) => (
               <div className='flex items-center gap-4 pr-6'>
                  <div className='h-12 w-12 overflow-hidden rounded-full bg-black/5'>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        src={r.avatarUrl}
                        alt={r.fullName}
                        className='h-full w-full object-cover'
                        loading='lazy'
                     />
                  </div>

                  <div className='min-w-0'>
                     <div className='text-[14px] font-semibold text-[#75B551]'>
                        {r.fullName}
                     </div>

                     <div className='text-[12px] text-[#4B6B8A]'>
                        {r.designation} • {r.companyName}
                     </div>
                  </div>
               </div>
            ),
         },
         {
            id: 'division',
            header: 'Division',
            sortable: true,
            sortValue: (r) => r.divisionName,
            minWidth: 200,
            headerClassName: 'min-w-[180px]',
            cell: (r) => (
               <Pill
                  label={r.divisionName}
                  className='bg-[#E8F3EC] text-[#1B2A41]'
               />
            ),
         },
         {
            id: 'roles',
            header: 'User Role',
            sortable: false,
            minWidth: 420,
            headerClassName: 'min-w-[170px]',
            cell: (r) => (
               <div className='flex min-w-[60px] items-center gap-3 overflow-hidden'>
                  <Pill
                     label={r.positionName}
                     className='bg-[#012F32] text-[#fff]'
                  />
               </div>
            ),
         },
         {
            id: 'actions',
            header: 'Actions',
            sortable: false,
            headerClassName: 'w-[280px]',
            cell: (r) => (
               <div className='flex items-center gap-10 text-[12px] text-[#9AA7B2]'>
                  <button
                     type='button'
                     onClick={() => {
                        setEditing(r);
                        setEditOpen(true);
                     }}
                     className='flex items-center gap-2 hover:text-[#5E6A74]'>
                     Edit
                  </button>

                  <button
                     type='button'
                     onClick={() => delM.mutate(Number(r.id))}
                     className='flex items-center gap-2 hover:text-[#5E6A74]'
                     disabled={delM.isPending}>
                     <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-[12px] text-white'>
                        ×
                     </span>
                     Remove User
                  </button>
               </div>
            ),
         },
      ],
      [delM]
   );

   return (
      <section className='px-10 pb-10'>
         <h1 className='pt-10 text-center text-[40px] font-medium tracking-wide text-[#223A59]'>
            Zonal Committee Management
         </h1>

         <div className='mt-10'>
            <TablePanel<ZonalCommitteeRow>
               rows={rows}
               columns={columns}
               getRowKey={(r) => String(r.id)}
               searchText={(r) =>
                  `${r.fullName} ${r.designation} ${r.companyName} ${r.positionName} ${r.positionSlug} ${r.divisionName}`
               }
               showTopBar={false}
               showExport={false}
               cellWrapClassName='min-h-[78px] py-3 flex items-center'
               controlsRightSlot={
                  <button
                     type='button'
                     onClick={() => setAddOpen(true)}
                     className='h-8 rounded-[6px] bg-[#0B2A56] px-6 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95'>
                     Add User
                  </button>
               }
            />

            {q.isLoading ? (
               <div className='pt-3'>
                  <Loader label='Loading...' size='sm' />
               </div>
            ) : null}

            {q.isError ? (
               <div className='pt-3 text-center text-[12px] text-red-600'>
                  {(q.error as Error)?.message ??
                     'Failed to load zonal committee list.'}
               </div>
            ) : null}
         </div>

         <AddZonalCommitteeModal
            open={addOpen}
            onClose={() => setAddOpen(false)}
         />
         <EditZonalCommitteeModal
            open={editOpen}
            value={editing}
            onClose={() => {
               setEditOpen(false);
               setEditing(null);
            }}
         />
      </section>
   );
}
