import Image, {type StaticImageData} from 'next/image';

export type AlbumCardData = {
   id: number;
   title: string;
   date: string;
   description: string;
   image: StaticImageData | string;
   videos?: boolean;
   videoUrl?: string | null;
};

type AlbumCardProps = {
   album: AlbumCardData;
   videos?: boolean;
   onPlay?: (album: AlbumCardData) => void;
};

export default function AlbumCard({album, videos, onPlay}: AlbumCardProps) {
   const canPlay = Boolean(videos && onPlay && album.videoUrl);
   return (
      <article className='group relative flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]'>
         {/* top image */}
         <div className='relative h-[185px] w-full md:h-[200px]'>
            <Image
               src={album.image}
               alt={album.title}
               fill
               className='object-cover'
            />

            {videos ? (
               <div className='absolute z-10 flex h-full w-full items-center justify-center'>
                  <button
                     type='button'
                     onClick={() => {
                        if (canPlay) onPlay?.(album);
                     }}
                     aria-label='Play video'
                     className='grid h-full w-full place-items-center bg-black/0 transition hover:bg-black/10'
                  >
                     <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='61'
                        height='68'
                        viewBox='0 0 61 68'
                        fill='none'>
                        <path
                           d='M61.0001 34.1135C60.88 37.3966 59.4318 39.9656 56.5215 41.6559C49.0542 45.9963 41.5799 50.3251 34.1056 54.6586C27.181 58.6744 20.2357 62.6555 13.3365 66.713C7.89477 69.915 1.74395 66.7339 0.383521 61.7002C0.13869 60.7936 0.0393715 59.8198 0.0393715 58.8785C0.0208936 42.3051 0.0763272 25.7294 0.000106066 9.156C-0.025301 3.50325 4.51794 -0.213474 9.15357 0.00911217C10.6503 0.0809889 12.0223 0.556303 13.3134 1.30521C27.6614 9.62204 42.0118 17.9389 56.3622 26.2511C59.3533 27.9831 60.9146 30.566 61.0001 34.1135Z'
                           fill='white'
                        />
                     </svg>
                  </button>
               </div>
            ) : null}
         </div>

         {/* content */}
         <div className='flex flex-1 flex-col gap-1 px-4 pb-5 pt-4 md:px-5 md:pb-6 md:pt-5'>
            <h3 className='text-[13px] font-semibold uppercase tracking-[0.18em] text-[#133374] md:text-[14px]'>
               {album.title}
            </h3>

            <p className='text-[10px] font-semibold uppercase tracking-[0.20em] text-[#8A9CB0] md:text-[11px]'>
               {album.date}
            </p>

            <p className='mt-1 text-[12px] leading-relaxed text-[#7B8C9C] md:text-[13px]'>
               {album.description}
            </p>
         </div>

         {/* green edge highlight */}
         <div className='pointer-events-none absolute inset-0 rounded-[18px] border border-[#E3EDF5]'>
            <div className='h-[3px] w-full rounded-t-[18px] bg-[#6CC12A]' />
         </div>

         {/* hover elevation */}
         <div className='pointer-events-none absolute inset-0 rounded-[18px] border border-transparent transition-all duration-200 group-hover:border-[#6CC12A]/70 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.18)]' />
      </article>
   );
}
