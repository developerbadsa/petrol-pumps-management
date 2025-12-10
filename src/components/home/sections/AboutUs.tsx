'use client';

import Image, {StaticImageData} from 'next/image';
import aboutImg from './../img/Group 46.png';
import SectionHeading from '@components/ui/SectionHeading';
import iconImg1 from './../img/Group 360.png';
import iconImg2 from './../img/Group 51.png';
import subtrackImg from './../img/Subtract.png';
import objectanimation from './../../../assets/ui-icons/OBJECTS.png';

type VisionStat = {
   icon: StaticImageData;
   label: string;
   value: string;
};

const visionStats: VisionStat[] = [
   {
      icon: iconImg1,
      label: 'TOTAL MEMBERS',
      value: '483',
   },
   {
      icon: iconImg2,
      label: 'LPG STATIONS',
      value: '928',
   },
];

export default function AboutUsSection() {
   return (
      <section className='relative  py-16'>
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
                  <h3 className='text-[14px] font-semibold  text-[#203566]'>
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
                  <div className='mt-7 grid  gap-4 sm:grid-cols-2'>
                     {visionStats.map((stat, idx) => (
                        <VisionStatCard key={idx} {...stat} />
                     ))}
                  </div>
               </div>

               {/* right: station illustration */}
               <div className='relative mx-auto flex w-[580px] items-center justify-center mt-6'>
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

         <div className='  z-0 absolute  h-[550px]  -bottom-[160px] -left-[0.1%]'>
            <Image
               src={objectanimation}
               alt=''
               className='object-contain h-full w-[100%] opacity-35 rotate-180 scale-[1.2]'
            />
         </div>
      </section>
   );
}

function VisionStatCard({icon, label, value}: VisionStat) {
   return (
      <article
         className='
        relative flex h-[250px] w-[220px] flex-col
        overflow-hidden
        rounded-[22px] '>
         <div className='absolute -top-6 -right-6 inset-1 z-1'>
            <Image src={subtrackImg} fill alt='' />
         </div>

         {/* top-right green corner tab */}
         <div
            className='
          pointer-events-none
          absolute right-1 top-0
          h-[64px] w-[150px] rounded-[40px]
          bg-[#75B551] z-0'
         />

         {/* content */}
         <div className='relative flex flex-1 flex-col px-7 pt-7 pb-6 z-2'>
            {/* icon */}
            <div className='h-[76px] w-[76px]'>
               <Image
                  src={icon}
                  alt={label}
                  className='h-full w-full object-contain drop-shadow-[0_18px_26px_rgba(0,176,109,0.55)]'
               />
            </div>

            {/* label + value pinned toward bottom like design */}
            <div className='mt-auto'>
               <p className='text-[18px] font-semibold uppercase tracking-[0.0em] '>
                  {label}
               </p>
               <p className='mt-2 text-[50px] font-semibold leading-none '>
                  {value}
               </p>
            </div>
         </div>
      </article>
   );
}
