'use client';

import Image, {type StaticImageData} from 'next/image';

import leaderImg1 from '@/assets/leader-img/md-serajul-mawla.png';
import leaderImg2 from '@/assets/leader-img/hasin-parfez.png';
import folio1 from '@/assets/Bento_Grid (7).png';
import folio2 from '@/assets/Bento_Grid (8).png';
import sponserImg1 from '@/assets/sponser-img/mgi.png';
import arrowuiIcon from '@/assets/ui-icons/Layer_1 (3).png';

type Sponsor = {
   name: string;
   logo: StaticImageData | string;
};

type Leader = {
   name: string;
   title: string;
   lines: string[];
   bio: string;
   photo: StaticImageData;
};

const sponsors: Sponsor[] = [
   {name: 'MGI', logo: sponserImg1},
   {name: 'Laugfs Gas', logo: sponserImg1},
   {name: 'Promita LPG', logo: sponserImg1},
   {name: 'Total', logo: sponserImg1},
   {name: 'Omera', logo: sponserImg1},
   {name: 'Navana LPG', logo: sponserImg1},
   {name: 'JMI Gas', logo: sponserImg1},
   {name: 'Beximco LPG', logo: sponserImg1},
   {name: 'Petromax LPG', logo: sponserImg1},
   {name: 'Universal Gas', logo: sponserImg1},
   {name: 'Universal Gas1', logo: sponserImg1},
];

const leaders: Leader[] = [
   {
      name: 'Mohammad Serajul Mawla',
      title: 'PRESIDENT',
      lines: [
         'Mechanical Engineer, BUET',
         'Managing Director, Saad Motors Ltd.',
         'Managing Director, SMT Energy Ltd.',
      ],
      bio: `Liquefied Petroleum Gas (Autogas) has gained global popularity 
as an alternative clean fuel. Bangladesh has also adopted this fuel 
to reduce emissions and reliance on traditional energy sources. 
Our association works to ensure safe and efficient autogas usage 
across the country, supporting members through policy, training 
and technical guidance.`,
      photo: leaderImg1,
   },
   {
      name: 'Md. Hasin Parvez',
      title: 'GENERAL SECRETARY',
      lines: [
         'CEO, Green Fuel Technologies Ltd.',
         'Prop. Green Fuel CNG & LPG Conversion Center',
         'Managing Director at Green Distribution Energy Services Ltd.',
      ],
      bio: `LPG is a clean-burning and cost-effective energy value and 
environment friendly. The association helps members to maintain 
highest safety standards, technical excellence and regulatory 
compliance while expanding autogas services across Bangladesh.`,
      photo: leaderImg2,
   },
];

export default function SponsorsSection() {
   const sponsorRows: Sponsor[][] = [
      sponsors.slice(0, 2), // top row
      sponsors.slice(3, 6), // middle row (4 items)
      sponsors.slice(6, 11), // bottom row (3 items)  -> adjust if you add more logos
   ];

   return (
      <section className='relative  pb-20 pt-12 z-0'>
         {/* top green line */}
         <div className='pointer-events-none absolute inset-x-0 top-0 h-4 ' />

         <div className='relative flex flex-col gap-44'>
            {/* sponsors title + grid */}
            <div className='flex flex-col items-center text-center relative w-full '>
               {/* side leaves */}
               <div className='pointer-events-none absolute inset-y-0 left-0 hidden w-[330px] lg:block'>
                  {/* green radial glow */}
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' />
                  {/* leaf image */}
                  <Image src={folio1} alt='' fill className='object-contain' />
               </div>

               {/* right glow + leaf (optional) */}
               <div className='pointer-events-none absolute inset-y-0 right-0 hidden w-[330px] lg:block'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' />
                  <Image src={folio2} alt='' fill className='object-contain' />
               </div>

               <div className='lpg-container'>
                  <h2 className=' text-[45px] font-semibold tracking-[0.22em]'>
                     SPONSORS
                  </h2>
                  <p className='mt-2 max-w-2xl text-[12px] leading-relaxed '>
                     Lorem ipsum dolor sit amet consectetur. Ultrices volutpat
                     sollicitudin quis at in. In urna fermentum nunc sapien
                     tortor.
                  </p>
                  {/* sponsor cards, pyramid layout */}
                  <div className='mt-7 flex flex-col items-center gap-3'>
                     {sponsorRows.map((row, rowIndex) => (
                        <div
                           key={rowIndex}
                           className={[
                              'flex justify-center gap-4',
                              rowIndex === 1 ? 'mt-1' : '',
                              rowIndex === 2 ? 'mt-1' : '',
                           ]
                              .filter(Boolean)
                              .join(' ')}>
                           {row.map(sponsor => (
                              <div
                                 key={sponsor.name}
                                 className='flex h-[50px] min-w-[130px] items-center justify-center rounded-[12px] bg-white px-6 shadow-[0_18px_32px_rgba(0,0,0,0.12)]'>
                                 <Image
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    width={100}
                                    height={32}
                                    className='object-contain'
                                 />
                              </div>
                           ))}
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* leaders cards */}

            <div className='relative '>
               {/* side leaves */}
               <div className='pointer-events-none absolute inset-y-0 -top-1/2 left-0 hidden w-[330px] lg:block opacity-10'>
                  {/* green radial glow */}
                  {/* <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' /> */}
                  {/* leaf image */}
                  <Image
                     src={arrowuiIcon}
                     alt=''
                     fill
                     className='object-contain'
                  />
               </div>
               <div
                  className='pointer-events-none absolute inset-y-0 -top-1/2 right-0 hidden w-[330px] lg:block opacity-10 transform -scale-x-100 origin-center'>
                  <Image
                     src={arrowuiIcon}
                     alt=''
                     fill
                     className='object-contain'
                  />
               </div>

               <div className='mt-24 grid gap-6 lg:grid-cols-2 lpg-container relative  justify-center items-center'>
                  {leaders.map(leader => (
                     <article
                        key={leader.name}
                        className='relative overflow-visible rounded-t-[98px] rounded-b-[12px] border border-[#CCD2F4] border-[4px] bg-white/95 px-6 pb-7 pt-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)] w-[480px] h-[620px] place-self-center'>
                        {/* photo circle */}
                        <div className='absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 '>
                           <div className='flex h-[270px] w-[270px] items-center justify-center rounded-full bg-[#CCD2F4] p-[4px]'>
                              <div className='relative h-full w-full overflow-hidden rounded-full bg-white'>
                                 <Image
                                    src={leader.photo}
                                    alt={leader.name}
                                    fill
                                    className='object-contain'
                                 />
                              </div>
                           </div>
                        </div>

                        <div className='mt-38 text-center'>
                           <h3 className='text-[24px] font-extrabold uppercase  '>
                              {leader.title}
                           </h3>
                           <p className='mt-1 text-[20px] font-medium '>
                              {leader.name}
                           </p>

                           <div className='mt-2 space-y-2 text-[15px] font-light '>
                              {leader.lines.map(line => (
                                 <div
                                    className='font-light opacity-80'
                                    key={line}>
                                    {line}
                                 </div>
                              ))}
                           </div>

                           <p className='mt-20 text-[15px] leading-relaxed   opacity-80'>
                              {leader.bio}
                           </p>
                        </div>
                     </article>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
