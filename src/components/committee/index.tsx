import CentralCommitteeSection from '@components/shared/CentralCommitteeSection';
import PageHero from '@/components/shared/PageHero';
import newsHero from './img/banner-img.png';
import Footer from '@/components/layout/Footer';

export default function CentralCommitteePage() {
   return (
      <div>
         <PageHero
            title='Committee'
            subtitle='Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin'
            backgroundImage={newsHero}
            height='compact'
         />

         <CentralCommitteeSection />

         <Footer />
      </div>
   );
}
