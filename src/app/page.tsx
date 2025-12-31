import Footer from './../components/layout/Footer';
import PageHero from './../components/shared/PageHero';
import SponsorsSection from '../components/home/sections/SponsorsSection/index';
import OurPartnersSection from '../components/home/sections/OurPartnersSection';
import AboutUsSection from './../components/home/sections/AboutUs';
import CentralCommitteeSection from '../components/shared/CentralCommitteeSection/index';
import WhyChooseUsSection from './../components/home/WhyChooseUsSection';
import JoinWithUsSection from './../components/home/sections/JoinWithUsSection';
import ServicesSection from './../components/home/sections/ServicesSection/index';
import ContactUsSection from './../components/home/sections/ContactUsSection';

export default function Home() {
   return (
      <div className='w-full'>
         <PageHero
            overlayFrom='top'
            title={
               <>
                  Bangladesh petroleum dealer&apos;s Distributor&apos;s
                  Agent&apos;s & Petrol Pump Owner&apos;s Association
               </>
            }
            subtitle='LICENSE NO: 21/2021 II REG. NO: To-1026/2021'
            ctaLabel='Get Started'
            ctaHref='/login'
            height='full'
         />
        <SponsorsSection />


          <OurPartnersSection />
         <AboutUsSection />
         <WhyChooseUsSection />
         <JoinWithUsSection />


         <ServicesSection />
         <CentralCommitteeSection />


         <ContactUsSection />
         <Footer /> 
      </div>
   );
}
