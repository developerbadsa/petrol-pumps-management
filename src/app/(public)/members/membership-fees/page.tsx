import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import MembershipFeesSection from '@/components/members/MembershipFeesSection';

export default function MembershipFeesPage() {
  return (
    <div>
      <PageHero
        title="Membership Fees"
        subtitle="Clear and affordable membership fees for registered petroleum dealers and owners."
        backgroundImage={heroBg}
        height="compact"
      />

      <MembershipFeesSection />

      <Footer />
    </div>
  );
}
