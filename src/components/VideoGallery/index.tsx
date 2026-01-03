'use client';

import {useEffect, useMemo, useState} from 'react';
import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import newsHero from '@assets/newsfeed-img/banner.png';
import news1 from './img/thumb1.png';
import news from './img/thumb1.png';

import AlbumsHeroSliderSection from '@components/ui/CardSliderwithStack';
import type {CardSlide} from '@components/ui/CardSliderwithStack';
import GridCardSection from '@components/shared/GridCardsSection/index';
import type {AlbumCardData} from '@components/shared/GridCardsSection/Card';
import Modal from '@/components/ui/modal/Modal';

const BASE_MEDIA_URL = 'https://admin.petroleumstationbd.com';
const DEFAULT_DESCRIPTION =
   "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.";

type Video = {
   id: number;
   title?: string | null;
   youtube_link?: string | null;
   type?: string | null;
   thumbnail_url?: string | null;
   is_active?: boolean | null;
   created_at?: string | null;
};

function normalizeList(raw: any): Video[] {
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

function resolveMediaUrl(path?: string | null) {
   if (!path) return undefined;
   if (path.startsWith('http')) return path;
   return `${BASE_MEDIA_URL}${path}`;
}

function toYouTubeEmbedUrl(url?: string | null) {
   if (!url) return null;
   try {
      const parsed = new URL(url);
      if (parsed.hostname === 'youtu.be') {
         const id = parsed.pathname.replace('/', '');
         return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (parsed.hostname.includes('youtube.com')) {
         if (parsed.pathname.startsWith('/embed/')) return url;
         const id = parsed.searchParams.get('v');
         if (id) return `https://www.youtube.com/embed/${id}`;
      }
      return url;
   } catch {
      return url;
   }
}

function isVideoVisible(video: Video) {
   if (video.is_active === false) return false;
   if (video.type && video.type !== 'gallery') return false;
   return true;
}
const VideoGallery = () => {
   const baseSlides: CardSlide[] = useMemo(
      () => [
         {
            id: 1,
            title: 'Video Gallery',
            description: DEFAULT_DESCRIPTION,
            images: [news, news, news],
            colSpan: 7, // ~58% width
         },
         {
            id: 2,
            title: 'Our Albums',
            description: DEFAULT_DESCRIPTION,
            colSpan: 5, // ~42% width
         },
      ],
      []
   );

   const [cardSlides, setCardSlides] = useState<CardSlide[]>(baseSlides);

   const CARDS_PER_PAGE = 2;

   const [sectionCardData, setSectionCardData] = useState<AlbumCardData[]>([]);
   const [activeVideo, setActiveVideo] = useState<{
      title: string;
      url: string;
   } | null>(null);

   useEffect(() => {
      const controller = new AbortController();

      async function loadVideos() {
         try {
            const res = await fetch('/api/public/videos', {
               cache: 'no-store',
               signal: controller.signal,
            });

            if (!res.ok) throw new Error('Failed to load videos');
            const data = await res.json().catch(() => null);
            const list = normalizeList(data).filter(isVideoVisible);

            const slides: CardSlide[] = list.map(video => ({
               id: video.id,
               title: video.title ?? 'Video Gallery',
               description: DEFAULT_DESCRIPTION,
               images: video.thumbnail_url
                  ? [resolveMediaUrl(video.thumbnail_url)].filter(Boolean)
                  : undefined,
            }));

            const cards: AlbumCardData[] = list.map(video => ({
               id: video.id,
               title: video.title ?? 'Video',
               date: formatDate(video.created_at),
               description: DEFAULT_DESCRIPTION,
               image: resolveMediaUrl(video.thumbnail_url) ?? news1,
               videoUrl: video.youtube_link,
            }));

            setCardSlides([...baseSlides, ...slides]);
            setSectionCardData(cards);
         } catch (error: any) {
            if (error?.name === 'AbortError') return;
            console.error('Failed to load videos', error);
         }
      }

      loadVideos();
      return () => controller.abort();
   }, [baseSlides]);

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
            title='Video Gallery'
            videos={true}
            description={DEFAULT_DESCRIPTION}
            onPlay={(album) => {
               if (!album.videoUrl) return;
               const embedUrl = toYouTubeEmbedUrl(album.videoUrl);
               if (!embedUrl) return;
               setActiveVideo({title: album.title, url: embedUrl});
            }}
         />

         <Modal
            open={Boolean(activeVideo)}
            title={activeVideo?.title}
            onClose={() => setActiveVideo(null)}
            maxWidthClassName='max-w-[900px]'
         >
            <div className='aspect-video w-full bg-black'>
               {activeVideo ? (
                  <iframe
                     key={activeVideo.url}
                     src={activeVideo.url}
                     title={activeVideo.title}
                     allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                     allowFullScreen
                     className='h-full w-full'
                  />
               ) : null}
            </div>
         </Modal>

         <Footer />
      </main>
   );
};

export default VideoGallery;
