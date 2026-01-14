import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import MembersOverviewSection from '@components/members/MembersOverviewSection';
import heroImg from '@assets/bg-img/starlink-banner.png';

export default function MembersPage() {
  return (
    <div>
      <PageHero
        title="Member List"
        subtitle="Welcome to the Members Page of the Bangladesh Petroleum Dealers’, Distributor’s Agents’ & Petrol Pump Owners’ Association."
        backgroundImage={heroImg}
        height="compact"
      />

      <MembersOverviewSection />

      <Footer />
    </div>
  );
}
