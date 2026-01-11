'use client';

import type {StationFormDefaults} from '../StationForm';
import StationUpsertSection from '../upsert/StationUpsertSection';

type Props = {
   initialValues?: StationFormDefaults;
   returnTo?: string;
};

export default function CreateStationSection({
   initialValues,
   returnTo,
}: Props) {
   return (
      <StationUpsertSection
         mode='create'
         title="Bangladesh petroleum dealer's Distributor's Agent's & Petrol Pump Owner's Association"
         subtitle='Add Station'
         initialValues={initialValues}
         returnTo={returnTo}
      />
   );
}
