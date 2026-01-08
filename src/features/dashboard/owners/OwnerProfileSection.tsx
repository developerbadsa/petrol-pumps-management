'use client';

import {useMemo} from 'react';
import {useRouter} from 'next/navigation';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import Loader from '@/components/shared/Loader';
import {useOwnerDetails, useOwnerStations} from './queries';
import type {OwnerStationRow} from './types';

type Props = {
   ownerId: string;
};

function formatDate(value?: string) {
   if (!value) return '—';
   const parsed = new Date(value);
   if (Number.isNaN(parsed.getTime())) return value;
   return parsed.toISOString().slice(0, 10);
}

function InfoRow({label, value}: {label: string; value?: string}) {
   return (
      <div className='flex items-center justify-between gap-4 py-3 text-[13px] text-[#6B7280]'>
         <span className='font-medium text-[#364152]'>{label}</span>
         <span className='text-right text-[#1F2937]'>{value || '—'}</span>
      </div>
   );
}

export default function OwnerProfileSection({ownerId}: Props) {
   const router = useRouter();
   const q = useOwnerDetails(ownerId);
   const stationsQ = useOwnerStations(ownerId);

   const columns = useMemo<ColumnDef<OwnerStationRow>[]>(() => {
      return [
         {
            id: 'name',
            header: 'Station Name',
            sortable: true,
            sortValue: r => r.name,
            csvHeader: 'Station Name',
            csvValue: r => r.name,
            cell: r => <span className='text-[#133374]'>{r.name}</span>,
         },
         {
            id: 'status',
            header: 'Status',
            sortable: true,
            sortValue: r => r.status ?? '',
            csvHeader: 'Status',
            csvValue: r => r.status ?? '',
            cell: r => <span className='text-[#6B7280]'>{r.status || '—'}</span>,
         },
         {
            id: 'division',
            header: 'Division',
            sortable: true,
            sortValue: r => r.division ?? '',
            csvHeader: 'Division',
            csvValue: r => r.division ?? '',
            cell: r => <span className='text-[#133374]'>{r.division || '—'}</span>,
         },
         {
            id: 'district',
            header: 'District',
            sortable: true,
            sortValue: r => r.district ?? '',
            csvHeader: 'District',
            csvValue: r => r.district ?? '',
            cell: r => <span className='text-[#133374]'>{r.district || '—'}</span>,
         },
         {
            id: 'upazila',
            header: 'Upazila',
            sortable: true,
            sortValue: r => r.upazila ?? '',
            csvHeader: 'Upazila',
            csvValue: r => r.upazila ?? '',
            cell: r => <span className='text-[#133374]'>{r.upazila || '—'}</span>,
         },
         {
            id: 'address',
            header: 'Address',
            sortable: false,
            csvHeader: 'Address',
            csvValue: r => r.address ?? '',
            cell: r => <span className='text-[#133374]'>{r.address || '—'}</span>,
         },
         {
            id: 'contactPerson',
            header: 'Contact Person',
            sortable: false,
            csvHeader: 'Contact Person',
            csvValue: r => r.contactPerson ?? '',
            cell: r => (
               <span className='text-[#133374]'>{r.contactPerson || '—'}</span>
            ),
         },
         {
            id: 'phone',
            header: 'Phone',
            sortable: false,
            csvHeader: 'Phone',
            csvValue: r => r.phone ?? '',
            cell: r => <span className='text-[#133374]'>{r.phone || '—'}</span>,
         },
         {
            id: 'stationType',
            header: 'Station Type',
            sortable: false,
            csvHeader: 'Station Type',
            csvValue: r => r.stationType ?? '',
            cell: r => (
               <span className='text-[#133374]'>{r.stationType || '—'}</span>
            ),
         },
         {
            id: 'fuelType',
            header: 'Fuel Type',
            sortable: false,
            csvHeader: 'Fuel Type',
            csvValue: r => r.fuelType ?? '',
            cell: r => (
               <span className='text-[#133374]'>{r.fuelType || '—'}</span>
            ),
         },
         {
            id: 'startDate',
            header: 'Start Date',
            sortable: false,
            csvHeader: 'Start Date',
            csvValue: r => r.startDate ?? '',
            cell: r => (
               <span className='text-[#133374]'>
                  {formatDate(r.startDate)}
               </span>
            ),
         },
         {
            id: 'action',
            header: 'Action',
            sortable: false,
            align: 'center',
            headerClassName: 'w-[120px]',
            csvHeader: 'Action',
            csvValue: () => '',
            cell: () => (
               <button
                  type='button'
                  className='h-7 rounded-[6px] bg-[#EF4444]/10 px-3 text-[11px] font-semibold text-[#EF4444] shadow-sm'>
                  Detach
               </button>
            ),
         },
      ];
   }, []);

   if (q.isLoading || stationsQ.isLoading)
      return <Loader label='Loading...' />;
   if (q.isError || stationsQ.isError || !q.data) {
      return (
         <div className='rounded-xl bg-white/70 p-6 text-sm text-red-600 shadow'>
            Failed to load owner profile.
         </div>
      );
   }

   const owner = q.data;
   const stations = stationsQ.data ?? [];

   return (
      <div className='space-y-6'>
         <div className='flex items-center justify-between'>
            <h2 className='text-[18px] font-semibold text-[#2B3A4A]'>
               Owner Profile
            </h2>
            <button
               type='button'
               onClick={() => router.back()}
               className='rounded-full border border-[#D0D5DD] px-4 py-2 text-[12px] font-semibold text-[#344054] shadow-sm hover:bg-white'>
               Back
            </button>
         </div>

         <div className='grid gap-6 lg:grid-cols-[260px,1fr]'>
            <div className='rounded-[16px] bg-white/80 p-6 text-center shadow-[0_18px_55px_rgba(0,0,0,0.08)]'>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                  src={owner.photoUrl}
                  alt={owner.ownerName}
                  className='mx-auto h-24 w-24 rounded-full object-cover shadow'
               />
               <p className='mt-4 text-[15px] font-semibold text-[#2B3A4A]'>
                  {owner.ownerName || '—'}
               </p>
               <p className='mt-1 text-[12px] text-[#4F62C0]'>
                  Membership ID: {owner.memberId || '—'}
               </p>
            </div>

            <div className='rounded-[16px] bg-white/80 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)]'>
               <h3 className='text-[14px] font-semibold text-[#2B3A4A]'>
                  Gas Station owner&apos;s Information
               </h3>
               <div className='mt-4 divide-y divide-[#E5E7EB]'>
                  <InfoRow label='Full Name' value={owner.ownerName} />
                  <InfoRow label='Email' value={owner.email} />
                  <InfoRow label='Phone' value={owner.phone} />
                  <InfoRow label='Address' value={owner.address} />
               </div>
            </div>
         </div>

         <div className='space-y-4'>
            <h3 className='text-[14px] font-semibold text-[#2B3A4A]'>
               Gas Station Information
            </h3>

            <TablePanel<OwnerStationRow>
               rows={stations}
               columns={columns}
               getRowKey={(row, index) => row.id ?? `${index}`}
               searchText={r =>
                  `${r.name ?? ''} ${r.division ?? ''} ${r.district ?? ''} ${r.phone ?? ''}`
               }
               exportFileName=''
               showTopBar={false}
               showControlsRow={false}
               showFooter={false}
               showExport={false}
               className='shadow-[0_18px_55px_rgba(0,0,0,0.10)]'
            />
         </div>
      </div>
   );
}
