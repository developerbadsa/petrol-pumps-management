'use client';

import {useEffect, useMemo, useState} from 'react';
import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import newsHero from '@assets/newsfeed-img/banner.png';
import news1 from '../PrintMediaGallery/img/news1.png';

import AlbumsHeroSliderSection from '../ui/CardSliderwithStack';
import type {CardSlide} from '@components/ui/CardSliderwithStack';
import GridCardSection from './../shared/GridCardsSection/index';
import type {AlbumCardData} from '../shared/GridCardsSection/Card';

const BASE_MEDIA_URL = 'https://admin.petroleumstationbd.com';
const DEFAULT_DESCRIPTION =
   "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.";

type Album = {
   id: number;
   title?: string | null;
   description?: string | null;
   event_date?: string | null;
   cover_url?: string | null;
   created_at?: string | null;
};

function normalizeList(raw: any): Album[] {
   if (Array.isArray(raw)) return raw;
   if (Array.isArray(raw?.data)) return raw.data;
   return [];
}

function formatDate(value?: string | null) {
   if (!value) return '';
   const date = new Date(value);
   if (Number.isNaN(date.getTime())) return String(value);
   return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
   });
}

function resolveCoverUrl(path?: string | null) {
   if (!path) return undefined;
   if (path.startsWith('http')) return path;
   return `${BASE_MEDIA_URL}${path}`;
}
const PhotoGallery = () => {
   const baseSlides: CardSlide[] = useMemo(
      () => [
         {
            id: 1,
            title: 'Photo Gallery',
            description: DEFAULT_DESCRIPTION,
            images: [news1, news1, news1],
            colSpan: 7, // ~58% width
         },
         {
            id: 2,
            title: 'Media Coverage',
            description: DEFAULT_DESCRIPTION,
            colSpan: 5, // ~42% width
         },
      ],
      []
   );

   const [cardSlides, setCardSlides] = useState<CardSlide[]>(baseSlides);

   const CARDS_PER_PAGE = 2;

   const [sectionCardData, setSectionCardData] = useState<AlbumCardData[]>([]);

   useEffect(() => {
      const controller = new AbortController();

      async function loadAlbums() {
         try {
            const res = await fetch('/api/public/albums', {
               cache: 'no-store',
               signal: controller.signal,
            });

            if (!res.ok) throw new Error('Failed to load albums');
            const data = await res.json().catch(() => null);
            const list = normalizeList(data);

            const slides: CardSlide[] = list.map(album => {
               const cover = resolveCoverUrl(album.cover_url);

               return {
                  id: album.id,
                  title: album.title ?? 'Our Albums',
                  description: album.description ?? DEFAULT_DESCRIPTION,
                  images: cover ? [cover] : undefined,
               };
            });

            const cards: AlbumCardData[] = list.map(album => ({
               id: album.id,
               title: album.title ?? 'Album',
               date: formatDate(album.event_date ?? album.created_at),
               description: album.description ?? DEFAULT_DESCRIPTION,
               image: resolveCoverUrl(album.cover_url) ?? news1,
            }));

            setCardSlides([...baseSlides, ...slides]);
            setSectionCardData(cards);
         } catch (error: any) {
            if (error?.name === 'AbortError') return;
            console.error('Failed to load albums', error);
         }
      }

      loadAlbums();
      return () => controller.abort();
   }, [baseSlides]);

   return (
      <main className='relative '>
         <PageHero
            title='Photo Gallery'
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
            title='Photo Gallery'
            description="We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery"
         />

         <Footer />
      </main>
   );
};

export default PhotoGallery;
