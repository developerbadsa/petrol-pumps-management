import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import TotalStationsSection from '@/components/members/TotalStationsSection';

export default function TotalStationsPage() {
  return (
    <div>
      <PageHero
        title="Total Station List"
        subtitle="Comprehensive list of all registered petrol stations across Bangladesh."
        backgroundImage={heroBg}
        height="compact"
      />

      <TotalStationsSection />

      <Footer />
    </div>
  );
}
