import StationUpsertSection from '@/features/dashboard/stations/upsert/StationUpsertSection';

type PageProps = {
   params: Promise<{id: string}>;
   searchParams?: Promise<{returnTo?: string}>;
};

export default async function EditStationPage({
   params,
   searchParams,
}: PageProps) {
   const {id} = await params;
   const resolvedSearchParams = await searchParams;
   const returnTo = resolvedSearchParams?.returnTo
      ? decodeURIComponent(resolvedSearchParams.returnTo)
      : undefined;

   return (
      <StationUpsertSection
         mode='edit'
         stationId={id}
         title='Update Station'
         returnTo={returnTo}
      />
   );
}
