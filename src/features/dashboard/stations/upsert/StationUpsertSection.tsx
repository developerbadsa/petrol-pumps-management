'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import StationForm from '../StationForm';
import type {StationFormDefaults} from '../StationForm';
import {useCreateStation, useUpdateStation} from '../unverified/queries';
import type {StationUpsertPayload} from '../formData';

type Props = {
   mode: 'create' | 'edit';
   stationId?: string | null;
   initialValues?: StationFormDefaults;
   returnTo?: string;
   title: string;
   subtitle?: string;
};

export default function StationUpsertSection({
   mode,
   stationId,
   initialValues,
   returnTo,
   title,
   subtitle,
}: Props) {
   const router = useRouter();
   const createM = useCreateStation();
   const updateM = useUpdateStation();
   const [formError, setFormError] = useState('');

   const isEdit = mode === 'edit';
   const saving = createM.isPending || updateM.isPending;
   const backHref = returnTo || '/manage-stations/unverified';

   return (
      <section className='space-y-4'>
         <h2 className='text-center text-[18px] font-semibold text-[#133374]'>
            {title}
         </h2>
         {subtitle ? (
            <p className='text-center text-[12px] font-medium text-[#6F8093]'>
               {subtitle}
            </p>
         ) : null}

         <div className='rounded-[12px] border border-black/10 bg-white p-5 shadow-sm'>
            <StationForm
               mode={mode}
               stationId={stationId}
               saving={saving}
               error={formError}
               initialValues={initialValues}
               onCancel={() => router.push(backHref)}
               onSubmit={async (payload: StationUpsertPayload) => {
                  setFormError('');

                  const normalizedPayload = {
                     ...payload,
                     station_owner_id: payload.station_owner_id ?? undefined,
                  };

                  try {
                     if (isEdit) {
                        if (!stationId) {
                           setFormError('Invalid station id');
                           return;
                        }
                        await updateM.mutateAsync({
                           id: stationId,
                           payload: normalizedPayload as any,
                        });
                     } else {
                        await createM.mutateAsync(normalizedPayload as any);
                     }
                     router.push(backHref);
                  } catch (e: any) {
                     setFormError(e?.message ?? 'Failed to save station');
                  }
               }}
            />
         </div>
      </section>
   );
}
