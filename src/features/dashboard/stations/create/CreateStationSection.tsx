'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import StationForm from '../StationForm';
import {useCreateStation} from '../unverified/queries';

export default function CreateStationSection() {
   const router = useRouter();
   const createM = useCreateStation();
   const [formError, setFormError] = useState('');

   return (
      <section className='space-y-4'>
         <h2 className='text-center text-[18px] font-semibold text-[#133374]'>
            Create Station
         </h2>

         <div className='rounded-[12px] border border-black/10 bg-white p-5 shadow-sm'>
            <StationForm
               mode='create'
               saving={createM.isPending}
               error={formError}
               onCancel={() => router.push('/manage-stations/unverified')}
               onSubmit={async payload => {
                  setFormError('');

                  const normalizedPayload = {
                     ...payload,
                     station_owner_id: payload.station_owner_id ?? undefined,
                  };

                  try {
                     await createM.mutateAsync(normalizedPayload as any);
                     router.push('/manage-stations/unverified');
                  } catch (e: any) {
                     setFormError(e?.message ?? 'Failed to save station');
                  }
               }}
            />
         </div>
      </section>
   );
}
