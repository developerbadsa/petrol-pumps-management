import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import newsHero from '@assets/newsfeed-img/banner.png';

import slide1 from '@assets/newsfeed-img/slider1.1.png';
import slide2 from '@assets/newsfeed-img/slider1.2.png';
import slide3 from '@assets/newsfeed-img/slider1.3.png';

import AlbumsHeroSliderSection from '../ui/CardSliderwithStack';
import AlbumsGridSection from './sections/album/AlbumsGridSection';
import type {CardSlide} from '@components/ui/CardSliderwithStack';

const NewsFeedPage = () => {


  
const cardSlides:CardSlide[]  = [
  {
    id: 1,
    title: 'Our Albums',
    description:
      "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
    images: [slide1, slide2, slide3],
    colSpan: 7, // ~58% width
  },
  {
    id: 2,
    title: 'Print Media Gallery',
    description:
      "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
    colSpan: 5, // ~42% width
  },

   {
      id: 3,
      title: 'Our Albums',
     
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      images: [slide1, slide2, slide3],
   },
   {
      id: 4,
      title: 'Our Albums',
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      images: [slide1, slide2, slide3],
   },
   {
      id: 5,
      title: 'Our Albums',
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      images: [slide1, slide2, slide3],
   },
   {
      id: 6,
      title: 'Print Media Gallery',
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      // no images → just text card
   },
];

const CARDS_PER_PAGE = 2;



   return (
      <main className='relative '>
         <PageHero
            title='News Feed'
            subtitle='Updates, events and media from Bangladesh LPG Autogas Station & Conversion Workshop Owners’ Association'
            backgroundImage={newsHero}
            height='compact'
         />

        <AlbumsHeroSliderSection cardsPerPage={CARDS_PER_PAGE} cardSlides={cardSlides} />
         <AlbumsGridSection />

         <Footer />
      </main>
   );
};

export default NewsFeedPage;
