import CreateStationSection from '@/features/dashboard/stations/create/CreateStationSection';
import type {StationFormDefaults} from '@/features/dashboard/stations/StationForm';

type SearchParams = {
   returnTo?: string;
   ownerId?: string;
   ownerName?: string;
   ownerPhone?: string;
   ownerAddress?: string;
};

type PageProps = {
   searchParams?: Promise<SearchParams>;
};

function decodeParam(value?: string) {
   if (!value) return undefined;
   return decodeURIComponent(value.replace(/\+/g, ' '));
}

export default async function CreateStationPage({searchParams}: PageProps) {
   const defaults: StationFormDefaults = {};

   const resolvedSearchParams = await searchParams;
   const ownerId = decodeParam(resolvedSearchParams?.ownerId);
   const ownerName = decodeParam(resolvedSearchParams?.ownerName);
   const ownerPhone = decodeParam(resolvedSearchParams?.ownerPhone);
   const ownerAddress = decodeParam(resolvedSearchParams?.ownerAddress);

   if (ownerId) defaults.station_owner_id = ownerId;
   if (ownerName) defaults.contact_person_name = ownerName;
   if (ownerPhone) defaults.contact_person_phone = ownerPhone;
   if (ownerAddress) defaults.station_address = ownerAddress;

   const returnTo = decodeParam(resolvedSearchParams?.returnTo);

   return <CreateStationSection initialValues={defaults} returnTo={returnTo} />;
}
