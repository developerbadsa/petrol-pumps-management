'use client';

import Image, {type StaticImageData} from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import defaultBanner from '@assets/bg-img/bg-banner.jpg';

type PageHeroProps = {
   title: React.ReactNode;
   subtitle?: string;
   ctaLabel?: string;
   ctaHref?: string;
   backgroundImage?: StaticImageData;
   height?: 'full' | 'compact';
   showHeader?: boolean;
   overlayFrom?: string;
};

const heightClass: Record<NonNullable<PageHeroProps['height']>, string> = {
   full: 'min-h-[560px] md:min-h-[680px] lg:min-h-[800px]',
   compact: 'min-h-[420px] md:min-h-[520px] lg:min-h-[600px]',
};

export default function PageHero({
   title,
   subtitle,
   ctaLabel,
   ctaHref,
   backgroundImage = defaultBanner,
   height = 'full',
   showHeader = true,
   overlayFrom = 'down',
}: PageHeroProps) {
   return (
      <div className={`relative w-full ${heightClass[height]}`}>
         <Image
            src={backgroundImage}
            alt='Page hero background'
            fill
            priority
            className='object-cover'
         />

         {/* overlay */}
         <div
            className={`pointer-events-none absolute inset-0 ${
               overlayFrom === 'top' ? 'bg-gradient-to-t' : 'bg-gradient-to-b'
            } from-[#00000054] to-[#122047]`}
         />

         {showHeader && <Header heroSize={heightClass[height]} />}

         {/* content */}
         <div className='relative flex min-h-[70%] flex-col items-center justify-center px-4 pb-6 text-center text-white'>
            <h1 className='text-[32px] md:text-[38px] lg:text-[48px] font-bold leading-tight tracking-[-0.04em] mb-12'>
               {title}
            </h1>

            {subtitle && (
               <p className='mt-3 text-[11px] md:text-[14px] font-medium tracking-[0.22em] text-white/80'>
                  {subtitle}
               </p>
            )}

            {ctaLabel && ctaHref && (
               <div className='mt-6'>
                  <Link
                     href={ctaHref}
                     className='inline-flex items-center justify-center rounded-full btn-bg px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(0,166,81,0.55)]'>
                     {ctaLabel}
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
}
