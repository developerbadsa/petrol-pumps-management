import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from './../../assets/bg-img/download-banner.png';
import DownloadsSection from '@/components/downloads/DownloadsSection';

export default function DownloadPage() {
  return (
    <div>
      <PageHero
        title="Downloads"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroBg}
        height="compact"
      />

      <DownloadsSection />

      <Footer />
    </div>
  );
}
