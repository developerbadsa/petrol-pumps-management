import OwnerProfileSection from '@/features/dashboard/owners/OwnerProfileSection';

type PageProps = {
   params: Promise<{id: string}>;
};

export default async function OwnerProfilePage({params}: PageProps) {
   const {id} = await params;
   return <OwnerProfileSection ownerId={id} />;
}
