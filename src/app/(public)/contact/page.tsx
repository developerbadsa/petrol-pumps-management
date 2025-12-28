import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import heroImg from '@assets/bg-img/starlink-banner.png';
import ContactUsWithForm from '../../../components/shared/ContactSectionWithForm/index';

export default function ContactPage() {
   return (
      <div>
         <PageHero
            title='Contact Us'
            subtitle='Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin'
            backgroundImage={heroImg}
            height='compact'
         />

<div className="lpg-container">
           <ContactUsWithForm />
</div>

         <Footer />
      </div>
   );
}
