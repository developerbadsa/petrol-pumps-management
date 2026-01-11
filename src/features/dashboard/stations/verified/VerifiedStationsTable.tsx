'use client';

import {useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {useQueryClient} from '@tanstack/react-query';
import {Database, Eye, Pencil, FileText, Trash2} from 'lucide-react';

import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {exportRowsToCsv} from '@/components/ui/table-panel/exportCsv';
import Loader from '@/components/shared/Loader';

import type {VerifiedStationRow} from './types';
import {useDeleteStation, useVerifiedStations} from './queries';
import {getStationDetailsRepo} from './repo';

function cx(...v: Array<string | false | null | undefined>) {
   return v.filter(Boolean).join(' ');
}

function IconDot({
   title,
   onClick,
   onMouseEnter,
   bg,
   disabled,
   children,
}: {
   title: string;
   onClick: () => void;
   onMouseEnter?: () => void;
   bg: string;
   disabled?: boolean;
   children: React.ReactNode;
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
            'grid h-5 w-5 place-items-center rounded-full shadow-sm',
            'disabled:opacity-60',
            bg
         )}>
         {children}
      </button>
   );
}

export default function VerifiedStationsTable() {
   const router = useRouter();
   const q = useVerifiedStations();
   const delM = useDeleteStation();
   const qc = useQueryClient();

   const prefetchDetails = useCallback(
      async (id: string) => {
         await qc.prefetchQuery({
            queryKey: ['stations', 'details', id],
            queryFn: () => getStationDetailsRepo(id),
            staleTime: 30_000, // cache for 30s; tweak as needed
         });
      },
      [qc]
   );

   const goView = useCallback(
      async (id: string) => {
         try {
            await prefetchDetails(id);
         } catch {
            // If prefetch fails, still navigate; details page can refetch.
         }
         router.push(`/manage-stations/verified/${id}`);
      },
      [prefetchDetails, router]
   );

   const goEdit = useCallback(
      async (id: string) => {
         try {
            await prefetchDetails(id);
         } catch {}
         const params = new URLSearchParams({
            returnTo: '/manage-stations/verified',
         });
         router.push(`/manage-stations/edit/${id}?${params.toString()}`);
      },
      [prefetchDetails, router]
   );

   const columns = useMemo<ColumnDef<VerifiedStationRow>[]>(() => {
      return [
         {
            id: 'sl',
            header: 'SL#',
            sortable: true,
            sortValue: r => r.sl,
            align: 'center',
            headerClassName: 'w-[90px]',
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
            sortValue: r => r.ownerNameLines.join(' '),
            headerClassName: 'w-[200px]',
            csvHeader: 'Owner Name',
            csvValue: r => r.ownerNameLines.join(' | '),
            cell: r => (
               <div className='space-y-1 text-[#133374]'>
                  {r.ownerNameLines.map((line, i) => (
                     <div key={i} className='leading-[1.15]'>
                        {line}
                     </div>
                  ))}
               </div>
            ),
         },
         {
            id: 'ownerPhone',
            header: 'Owner Phone',
            sortable: true,
            sortValue: r => r.ownerPhone,
            headerClassName: 'w-[210px]',
            csvHeader: 'Owner Phone',
            csvValue: r => r.ownerPhone,
            cell: r => <span className='text-[#133374]'>{r.ownerPhone}</span>,
         },
         {
            id: 'division',
            header: 'Division',
            sortable: true,
            sortValue: r => r.division,
            headerClassName: 'w-[180px]',
            align: 'center',
            csvHeader: 'Division',
            csvValue: r => r.division,
            cell: r => <span className='text-[#133374]'>{r.division}</span>,
         },
         {
            id: 'district',
            header: 'District',
            sortable: true,
            sortValue: r => r.district,
            headerClassName: 'w-[190px]',
            align: 'center',
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
            align: 'center',
            csvHeader: 'Upazila',
            csvValue: r => r.upazila,
            cell: r => <span className='text-[#133374]'>{r.upazila}</span>,
         },
         {
            id: 'doc',
            header: 'Doc',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[95px]',
            csvHeader: 'Doc',
            csvValue: () => 'View',
            cell: r => {
               const docHref = `/settings/station-documents?stationId=${encodeURIComponent(
                  r.id
               )}`;

               return (
                  <button
                     type='button'
                     title='Open station documents'
                     aria-label='Open station documents'
                     onClick={() => {
                        window.open(docHref, '_blank', 'noopener,noreferrer');
                     }}
                     className={cx('inline-flex items-center justify-center')}>
                     <FileText size={18} color='#5B7FFF' />
                  </button>
               );
            },
         },
         {
            id: 'action',
            header: 'Action',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[130px]',
            csvHeader: 'Action',
            csvValue: () => '',
            cell: r => (
               <div className='flex items-center justify-center gap-2'>
                  <IconDot
                     title='View station'
                     onMouseEnter={() => prefetchDetails(r.id)}
                     onClick={() => goView(r.id)}
                     bg='bg-[#6D6DFF]'>
                     <Eye size={12} className='text-white' />
                  </IconDot>

                  <IconDot
                     title='Delete station'
                     onClick={() => {
                        if (delM.isPending) return;
                        const ok = window.confirm(
                           'Delete this station? This cannot be undone.'
                        );
                        if (!ok) return;
                        delM.mutate(r.id);
                     }}
                     disabled={delM.isPending}
                     bg='bg-[#EF4444]'>
                     <Trash2 size={12} className='text-white' />
                  </IconDot>

                  <IconDot
                     title='Edit station'
                     onMouseEnter={() => prefetchDetails(r.id)}
                     onClick={() => goEdit(r.id)}
                     bg='bg-[#F59E0B]'>
                     <Pencil size={12} className='text-white' />
                  </IconDot>
               </div>
            ),
         },
      ];
   }, [delM, goEdit, goView, prefetchDetails]);

   if (q.isLoading) return <Loader label='Loading...' />;
   if (q.isError)
      return (
         <div className='text-sm text-red-600'>Failed to load stations.</div>
      );

   const rows = q.data ?? [];

   return (
      <>
         <TablePanel<VerifiedStationRow>
            rows={rows}
            columns={columns}
            getRowKey={r => r.id}
            searchText={r =>
               `${r.stationName} ${r.ownerNameLines.join(' ')} ${
                  r.ownerPhone
               } ${r.division} ${r.district} ${r.upazila}`
            }
            exportFileName='verified-stations.csv'
            exportLabel='Export to Excel'
            showTopBar
            showExport
            totalLabel={() => (
               <button
                  type='button'
                  onClick={() =>
                     exportRowsToCsv(rows, columns, 'verified-stations-all.csv')
                  }
                  className='inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#009970] px-8 text-[13px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'>
                  <Database size={20} className='text-white' />
                  Export All Data
               </button>
            )}
            controlsRightSlot={
               <button
                  type='button'
                  onClick={() => {
                     const params = new URLSearchParams({
                        returnTo: '/manage-stations/verified',
                     });
                     router.push(
                        `/manage-stations/create-station?${params.toString()}`
                     );
                  }}
                  className='inline-flex h-9 items-center justify-center rounded-[6px] bg-[#133374] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'>
                  Add Station
               </button>
            }
            className='bg-transparent p-0 shadow-none backdrop-blur-0'
         />
      </>
   );
}
