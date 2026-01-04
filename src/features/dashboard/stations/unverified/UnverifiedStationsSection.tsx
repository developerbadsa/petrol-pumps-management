'use client';

import {useCallback, useMemo, useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {exportRowsToCsv} from '@/components/ui/table-panel/exportCsv';
import Loader from '@/components/shared/Loader';
import {
   Database,
   Eye,
   FileSpreadsheet,
   Pencil,
   Trash2,
   BadgeCheck,
} from 'lucide-react';

import type {StationRow} from './types';
import {
   useCreateStation,
   useDeleteStation,
   useUnverifiedStations,
   useUpdateStation,
   useVerifyStation,
} from './queries';
import {getStationDetailsRepo} from './repo';
import StationFormModal from '../StationFormModal';

function cx(...v: Array<string | false | null | undefined>) {
   return v.filter(Boolean).join(' ');
}

function ActionDot({
   title,
   onClick,
   bg,
   children,
   disabled,
   onMouseEnter,
}: {
   title: string;
   onClick: () => void;
   bg: string;
   children: React.ReactNode;
   disabled?: boolean;
   onMouseEnter?: () => void;
}) {
   return (
      <button
         type='button'
         title={title}
         aria-label={title}
         onClick={onClick}
         onMouseEnter={onMouseEnter}
         disabled={disabled}
         className={cx(
            'grid h-6 w-6 place-items-center rounded-full shadow-sm',
            'disabled:opacity-60',
            bg
         )}>
         {children}
      </button>
   );
}

export default function UnverifiedStationsSection() {
   const qc = useQueryClient();

   const q = useUnverifiedStations();
   const verifyM = useVerifyStation();
   const delM = useDeleteStation();
   const createM = useCreateStation();
   const updateM = useUpdateStation();

   const [modalOpen, setModalOpen] = useState(false);
   const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
   const [activeId, setActiveId] = useState<string | null>(null);
   const [formError, setFormError] = useState('');

   const prefetchDetails = useCallback(
      async (id: string) => {
         await qc.prefetchQuery({
            queryKey: ['stations', 'details', id],
            queryFn: () => getStationDetailsRepo(id),
            staleTime: 30_000,
         });
      },
      [qc]
   );

   const goView = useCallback(
      async (id: string) => {
         try {
            await prefetchDetails(id);
         } catch {}
         setFormError('');
         setActiveId(id);
         setModalMode('view');
         setModalOpen(true);
      },
      [prefetchDetails]
   );

   const goEdit = useCallback(
      async (id: string) => {
         try {
            await prefetchDetails(id);
         } catch {}
         setFormError('');
         setActiveId(id);
         setModalMode('edit');
         setModalOpen(true);
      },
      [prefetchDetails]
   );

   const columns = useMemo<ColumnDef<StationRow>[]>(() => {
      return [
         {
            id: 'sl',
            header: 'SL#',
            sortable: true,
            sortValue: r => r.sl,
            headerClassName: 'w-[90px]',
            align: 'center',
            csvHeader: 'SL',
            csvValue: r => r.sl,
            cell: r => (
               <span className='text-[#133374]'>
                  {String(r.sl).padStart(2, '0')}
               </span>
            ),
         },
         {
            id: 'stationName',
            header: 'Station Name',
            sortable: true,
            sortValue: r => r.stationName,
            headerClassName: 'w-[240px]',
            csvHeader: 'Station Name',
            csvValue: r => r.stationName,
            cell: r => <span className='text-[#133374]'>{r.stationName}</span>,
         },
         {
            id: 'ownerName',
            header: 'Owner Name',
            sortable: true,
            sortValue: r => r.ownerName,
            headerClassName: 'w-[200px]',
            csvHeader: 'Owner Name',
            csvValue: r => r.ownerName,
            cell: r => <span className='text-[#133374]'>{r.ownerName}</span>,
         },
         {
            id: 'phone',
            header: 'Phone',
            sortable: true,
            sortValue: r => r.phone,
            headerClassName: 'w-[180px]',
            csvHeader: 'Phone',
            csvValue: r => r.phone,
            cell: r => <span className='text-[#133374]'>{r.phone}</span>,
         },
         {
            id: 'division',
            header: 'Division',
            sortable: true,
            sortValue: r => r.division,
            headerClassName: 'w-[170px]',
            csvHeader: 'Division',
            csvValue: r => r.division,
            cell: r => <span className='text-[#133374]'>{r.division}</span>,
         },
         {
            id: 'district',
            header: 'District',
            sortable: true,
            sortValue: r => r.district,
            headerClassName: 'w-[170px]',
            csvHeader: 'District',
            csvValue: r => r.district,
            cell: r => <span className='text-[#133374]'>{r.district}</span>,
         },
         {
            id: 'upazila',
            header: 'Upazila',
            sortable: true,
            sortValue: r => r.upazila,
            headerClassName: 'w-[200px]',
            csvHeader: 'Upazila',
            csvValue: r => r.upazila,
            cell: r => <span className='text-[#133374]'>{r.upazila}</span>,
         },
         {
            id: 'verify',
            header: 'Verify',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[120px]',
            csvHeader: 'Verify',
            csvValue: () => '',
            cell: r => (
               <button
                  type='button'
                  onClick={() => {
                     if (verifyM.isPending) return;
                     const ok = window.confirm('Approve this station?');
                     if (!ok) return;
                     verifyM.mutate(r.id);
                  }}
                  disabled={verifyM.isPending}
                  className={cx(
                     'grid h-7 w-7 place-items-center rounded-full bg-[#4F6DFF] text-white shadow-sm',
                     verifyM.isPending && 'opacity-60'
                  )}
                  title='Verify'
                  aria-label='Verify'>
                  <BadgeCheck size={16} />
               </button>
            ),
         },
         {
            id: 'action',
            header: 'Action',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[160px]',
            csvHeader: 'Action',
            csvValue: () => '',
            cell: r => (
               <div className='flex items-center justify-center gap-2'>
                  <ActionDot
                     title='View'
                     onMouseEnter={() => prefetchDetails(r.id)}
                     onClick={() => goView(r.id)}
                     bg='bg-[#6D5EF7] text-white'>
                     <Eye size={14} />
                  </ActionDot>

                  <ActionDot
                     title='Delete'
                     disabled={delM.isPending}
                     onClick={() => {
                        if (delM.isPending) return;
                        const ok = window.confirm(
                           'Delete this station? This cannot be undone.'
                        );
                        if (!ok) return;
                        delM.mutate(r.id);
                     }}
                     bg='bg-[#EF4444] text-white'>
                     <Trash2 size={14} />
                  </ActionDot>

                  <ActionDot
                     title='Edit'
                     onMouseEnter={() => prefetchDetails(r.id)}
                     onClick={() => goEdit(r.id)}
                     bg='bg-[#F59E0B] text-white'>
                     <Pencil size={14} />
                  </ActionDot>
               </div>
            ),
         },
      ];
   }, [delM.isPending, delM, goEdit, goView, prefetchDetails, verifyM]);

   const rows = q.data ?? [];

   return (
      <section className='space-y-4'>
         <h2 className='text-center text-[18px] font-semibold text-[#133374]'>
            Unverified Stations
         </h2>

         {q.isLoading ? (
            <Loader label='Loading...' />
         ) : q.isError ? (
            <div className='text-sm text-red-600'>Failed to load stations.</div>
         ) : (
            <TablePanel<StationRow>
               rows={rows}
               columns={columns}
               getRowKey={r => r.id}
               searchText={r =>
                  `${r.sl} ${r.stationName} ${r.ownerName} ${r.phone} ${r.division} ${r.district} ${r.upazila}`
               }
               showTopBar={false}
               showExport={false}
               exportFileName=''
               cellWrapClassName='min-h-[92px] py-6 flex items-center'
               topSlot={
                  <div className='flex items-center justify-between'>
                     <button
                        type='button'
                        onClick={() => {
                           setFormError('');
                           setActiveId(null);
                           setModalMode('create');
                           setModalOpen(true);
                        }}
                        className='inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#133374] px-8 text-[13px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'>
                        Add Station
                     </button>

                     <button
                        type='button'
                        onClick={() =>
                           exportRowsToCsv(
                              rows,
                              columns,
                              'unverified-stations-all.csv'
                           )
                        }
                        className='inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#009970] px-8 text-[13px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'>
                        <Database size={18} />
                        Export All Data
                     </button>

                     <button
                        type='button'
                        onClick={() =>
                           exportRowsToCsv(
                              rows,
                              columns,
                              'unverified-stations.csv'
                           )
                        }
                        className='inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#009970] px-8 text-[13px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'>
                        <FileSpreadsheet size={18} />
                        Export to Excel
                     </button>
                  </div>
               }
            />
         )}

         <StationFormModal
            open={modalOpen}
            mode={modalMode}
            stationId={activeId}
            saving={createM.isPending || updateM.isPending}
            error={formError}
            onClose={() => {
               setModalOpen(false);
               setActiveId(null);
               setFormError('');
            }}
            onSubmit={async payload => {
               setFormError('');

               try {
                  if (modalMode === 'create') {
                     await createM.mutateAsync(payload as any);
                  } else {
                     if (!activeId) {
                        setFormError('Invalid station id');
                        return;
                     }
                     await updateM.mutateAsync({id: activeId, payload});
                  }
                  setModalOpen(false);
                  setActiveId(null);
               } catch (e: any) {
                  setFormError(e?.message ?? 'Failed to save station');
               }
            }}
         />
      </section>
   );
}
