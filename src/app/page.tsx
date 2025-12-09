
import Footer from './../components/layout/Footer';
import HeroSection from './../components/home/sections/HeroSection';
import SponsorsSection from '../components/home/sections/SponsorsSection/index';
import OurPartnersSection from './../components/home/sections/OurPartnersSection';
import AboutUsSection from './../components/home/sections/AboutUs';

export default function Home() {
   return (
      <div className=''>
         <HeroSection />
         <SponsorsSection/>
         <OurPartnersSection/>
         <AboutUsSection/>
         <Footer />
      </div>
   );
}
