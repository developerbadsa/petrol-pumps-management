import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from './../../assets/bg-img/notice-banner.png';
import NoticesSection from '@/components/notices/NoticesSection';

export default function NoticesPage() {
  return (
    <div>
      <PageHero
        title="Notices"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroBg}
        height="compact"
      />

      <NoticesSection />

      <Footer />
    </div>
  );
}
