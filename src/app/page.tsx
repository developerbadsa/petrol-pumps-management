
import Footer from './../components/layout/Footer';
import {HeroSection} from './../components/home/HeroSection';
import SponsorsSection from './../components/home/SponsorsSection/index';

export default function Home() {
   return (
      <div className=''>
         <HeroSection />
         <SponsorsSection/>
         <Footer />
      </div>
   );
}
