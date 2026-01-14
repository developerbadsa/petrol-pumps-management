import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import NonMembersSection from '@/components/members/NonMembersSection';

export default function NonMembersPage() {
  return (
    <div>
      <PageHero
        title="Non-Member List"
        subtitle="List of petroleum businesses currently not registered as association members."
        backgroundImage={heroBg}
        height="compact"
      />

      <NonMembersSection />

      <Footer />
    </div>
  );
}
