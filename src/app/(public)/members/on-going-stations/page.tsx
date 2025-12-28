import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import OnGoingStationsSection from '@/components/members/OnGoingStationsSection';

export default function OnGoingStationsPage() {
  return (
    <div>
      <PageHero
        title="Members"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroBg}
        height="compact"
      />

      <OnGoingStationsSection />

      <Footer />
    </div>
  );
}
