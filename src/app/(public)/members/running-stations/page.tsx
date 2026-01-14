import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import RunningStationsSection from '@/components/members/RunningStations/RunningStationsSection';

export default function RunningStationsPage() {
  return (
    <div>
      <PageHero
        title="Running Stations List"
        subtitle="Approved gas stations currently operating across Bangladesh."
        backgroundImage={heroBg}
        height="compact"
      />

      <RunningStationsSection />

      <Footer />
    </div>
  );
}
