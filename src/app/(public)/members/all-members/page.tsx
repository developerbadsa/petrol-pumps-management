import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import MembersOverviewSection from '@components/members/MembersOverviewSection';
import heroImg from '@assets/bg-img/starlink-banner.png';

export default function MembersPage() {
  return (
    <div>
      <PageHero
        title="Members"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroImg}
        height="compact"
      />

      <MembersOverviewSection />

      <Footer />
    </div>
  );
}
