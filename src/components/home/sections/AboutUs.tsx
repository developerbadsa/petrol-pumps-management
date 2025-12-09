'use client';

import Image from 'next/image';
import aboutImg from './../img/Group 46.png';
import SectionHeading from '@components/ui/SectionHeading';

type VisionStat = {
   icon: string;
   label: string;
   value: string;
};

const visionStats: VisionStat[] = [
   {
      icon: '/icons/total-members.png', // put this in public/icons
      label: 'TOTAL MEMBERS',
      value: '483',
   },
   {
      icon: '/icons/lpg-stations.png', // put this in public/icons
      label: 'LPG STATIONS',
      value: '928',
   },
];

export default function AboutUsSection() {
   return (
      <section className='relative overflow-hidden  py-16'>
         {/* subtle background geometry */}

         <div className='lpg-container relative'>
            {/* main heading */}
            <div className='mb-10 text-center'>
               <SectionHeading
                  title=' ABOUT US'
                  subtitle=' Lorem ipsum dolor sit amet consectetur. Ultrices volutpat
                  sollicitudin quis at in. In urna fermentum nunc sapien tortor.'
               />
               <h2 className='text-[22px] font-semibold tracking-[0.22em] text-[#203566]'></h2>
               <p className='mt-2 text-[12px] leading-relaxed text-[#7B8EA5]'>
                  Lorem ipsum dolor sit amet consectetur. Ultrices volutpat
                  sollicitudin quis at in. In urna fermentum nunc sapien tortor.
               </p>
            </div>

            {/* content grid */}
            <div className='grid gap-10 items-start lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'>
               {/* left: vision + stats */}
               <div className='max-w-xl'>
                  <h3 className='text-[14px] font-semibold tracking-[0.2em] text-[#203566]'>
                     OUR VISION
                  </h3>

                  <p className='mt-3 text-[12px] leading-relaxed text-[#5F6F85]'>
                     Lorem ipsum dolor sit amet consectetur. Sed facilisis eu
                     blandit lorem sed interdum pellentesque. Lectus egestas
                     nibh elementum venenatis hendrerit nullam velit augue eros
                     vitae amet vitae. Blandit posuere consequat consectetur
                     tempus. Pulvinar vulputate in nibh natoque mauris nunc.
                  </p>
                  <p className='mt-3 text-[12px] leading-relaxed text-[#5F6F85]'>
                     Vitae nec montes convallis nibh volutpat. Aliquet sit
                     interdum massa et id placerat nunc ultricies nunc. Mauris
                     sed aliquam et ut nec. Id non ultrices magna adipiscing et
                     id. Duis elementum nulla id risus nullam sed. Id sed diam
                     sit amet fames sed scelerisque leo euismod. Sit sit
                     condimentum viverra donec nunc nunc euismod sem id. Nibh
                     sed ultrices id eget volutpat enim maecenas.
                  </p>

                  {/* stats cards */}
                  <div className='mt-7 grid max-w-md gap-4 sm:grid-cols-2'>
                     {visionStats.map((stat, idx) => (
                        <VisionStatCard key={idx} {...stat} />
                     ))}
                  </div>
               </div>

               {/* right: station illustration */}
               <div className='relative mx-auto flex max-w-[480px] items-center justify-center'>
                  {/* soft glow behind image */}
                  {/* <div className='pointer-events-none absolute inset-x-6 bottom-0 top-6 rounded-[32px] bg-[radial-gradient(circle_at_center,_#7CDF6A55,_transparent_70%)]' /> */}
                  <div className='relative w-full overflow-hidden rounded-[26px] '>
                     <Image
                        src={aboutImg} // put your 3D station render in public/images
                        alt='LPG autogas station illustration'
                        width={720}
                        height={480}
                        className='h-auto w-full object-cover'
                        priority
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

function VisionStatCard({icon, label, value}: VisionStat) {
   return (
      <div className='flex items-center gap-4 rounded-[18px] border border-[#E3EAF6] bg-white px-6 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.08)]'>
         <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6ACF4F,#00A651)] shadow-[0_10px_22px_rgba(0,166,81,0.45)]'>
            <Image
               src={icon}
               alt={label}
               width={28}
               height={28}
               className='object-contain'
            />
         </div>
         <div className='text-left'>
            <div className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7B8EA5]'>
               {label}
            </div>
            <div className='mt-1 text-[30px] font-semibold leading-none text-[#203566]'>
               {value}
            </div>
         </div>
      </div>
   );
}
