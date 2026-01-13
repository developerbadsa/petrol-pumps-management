import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import newsHero from '@assets/bg-img/committee-banner-img.png';
import ZonalCommitteeSection from '@components/ZonalCommitteeSection';

export default function CommitteePage() {
  return (
    <div>
      <PageHero
        title="Committee"
        // subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={newsHero}
        height="compact"
      />

      <ZonalCommitteeSection />

      <Footer />
    </div>
  );
}
