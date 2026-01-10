import CreateStationSection from '@/features/dashboard/stations/create/CreateStationSection';
import type {StationFormDefaults} from '@/features/dashboard/stations/StationForm';

type PageProps = {
   searchParams?: {
      returnTo?: string;
      ownerId?: string;
      ownerName?: string;
      ownerPhone?: string;
      ownerAddress?: string;
   };
};

function decodeParam(value?: string) {
   if (!value) return undefined;
   return decodeURIComponent(value.replace(/\+/g, ' '));
}

export default function CreateStationPage({searchParams}: PageProps) {
   const defaults: StationFormDefaults = {};

   const ownerId = decodeParam(searchParams?.ownerId);
   const ownerName = decodeParam(searchParams?.ownerName);
   const ownerPhone = decodeParam(searchParams?.ownerPhone);
   const ownerAddress = decodeParam(searchParams?.ownerAddress);

   if (ownerId) defaults.station_owner_id = ownerId;
   if (ownerName) defaults.contact_person_name = ownerName;
   if (ownerPhone) defaults.contact_person_phone = ownerPhone;
   if (ownerAddress) defaults.station_address = ownerAddress;

   const returnTo = decodeParam(searchParams?.returnTo);

   return <CreateStationSection initialValues={defaults} returnTo={returnTo} />;
}
