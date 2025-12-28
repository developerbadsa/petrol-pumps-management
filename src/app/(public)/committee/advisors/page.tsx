import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import AdvisorsSection from '@/components/AdvisorsSection';
import heroImg from '@assets/bg-img/advisors-banner.png';

export default function AdvisorsPage() {
  return (
    <div>
      <PageHero
        title="Advisors"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroImg}
        height="compact"
      />

      <AdvisorsSection />

      <Footer />
    </div>
  );
}
