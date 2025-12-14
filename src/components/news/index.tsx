import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import newsHero from '@assets/newsfeed-img/banner.png';
import slide1 from '@assets/newsfeed-img/slider1.1.png';
import slide2 from '@assets/newsfeed-img/slider1.2.png';
import slide3 from '@assets/newsfeed-img/slider1.3.png';
import album1 from '@assets/newsfeed-img/gallery.png';
import album2 from '@assets/newsfeed-img/gallery.png';
import album3 from '@assets/newsfeed-img/gallery.png';
import AlbumsHeroSliderSection from '../ui/CardSliderwithStack';
import type {CardSlide} from '@components/ui/CardSliderwithStack';
import GridCardSection from './../shared/GridCardsSection/index';
import type {cardProps} from '../../components/shared/GridCardsSection/Card';
const NewsFeedPage = () => {
   const cardSlides: CardSlide[] = [
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

   const sectionCardData = [
      {
         id: 1,
         title: 'GENERAL MEETING',
         date: '8 APR, 2019',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album1,
      },
      {
         id: 2,
         title: 'GENERAL MEETING',
         date: '11 JAN, 2020',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album2,
      },
      {
         id: 3,
         title: 'GENERAL MEETING',
         date: '27 FEB, 2021',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album3,
      },
      {
         id: 4,
         title: 'RANGPUR GENERAL MEETING',
         date: '20 AUG, 2019',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album1,
      },
      {
         id: 5,
         title: 'BERC PUBLIC HEARING',
         date: '13 SEP, 2021',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album2,
      },
      {
         id: 6,
         title: 'GENERAL MEETING',
         date: '1 JANUARY, 2022',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album3,
      },
      {
         id: 7,
         title: 'PRESS XPRESS ROUNDTABLE',
         date: '8 JULY, 2019',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album1,
      },
      {
         id: 8,
         title: 'GENERAL MEETING',
         date: '1 JANUARY, 2022',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album3,
      },
      {
         id: 9,
         title: 'PRESS XPRESS ROUNDTABLE',
         date: '8 JULY, 2019',
         description:
            'Lorem ipsum dolor sit amet consectetur. Et sed elementum ut tellus euismod. Eleifend nullam.',
         image: album1,
      },
   ];

   return (
      <main className='relative '>
         <PageHero
            title='News Feed'
            subtitle='Updates, events and media from Bangladesh LPG Autogas Station & Conversion Workshop Owners’ Association'
            backgroundImage={newsHero}
            height='compact'
         />

         <AlbumsHeroSliderSection
            cardsPerPage={CARDS_PER_PAGE}
            cardSlides={cardSlides}
         />
         <GridCardSection
            columnPerRow='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
            sectionCardData={sectionCardData}
            title='Our Albums'
            description="We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh.
Welcome to our Gallery"
         />

         <Footer />
      </main>
   );
};

export default NewsFeedPage;
