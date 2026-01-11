'use client';

import {useState} from 'react';
import Image, {type StaticImageData} from 'next/image';
import {Direction} from './FramerMarqueeRow';

import leaderImg1 from '@/assets/leader-img/SayedSajjadulKarimKabul.jpeg';
import leaderImg2 from '@/assets/leader-img/MirAhasanUddinFarvez.jpeg';
import folio1 from '@/assets/Bento_Grid (7).png';
import folio2 from '@/assets/Bento_Grid (8).png';
import sponserImg1 from '@/assets/sponser-img/mgi.png';

// import laugfs from '@/assets/sponser-img/laugfs.png';
// import promita from '@/assets/sponser-img/promita.png';
// import total from '@/assets/sponser-img/total.png';
// import omera from '@/assets/sponser-img/omera.png';
// import jsjvl from '@/assets/sponser-img/jsjvl.png';
// import navama from '@/assets/sponser-img/navana.png';
// import ggas from '@/assets/sponser-img/ggas.png';
// import beximco from '@/assets/sponser-img/beximco.png';
// import prtromax from '@/assets/sponser-img/prtromax.png';
// import universal from '@/assets/sponser-img/universal.png';


import bpc from '@/assets/sponser-img/bpc.jpeg';
import jamuna from '@/assets/sponser-img/jamuna.jpeg';
import meghna from '@/assets/sponser-img/meghna.jpeg';
import padna from '@/assets/sponser-img/padna.jpeg';


import arrowuiIcon from '@/assets/ui-icons/Layer_1 (3).png';
import SectionHeading from '@components/ui/SectionHeading';
import FramerMarqueeRow from './FramerMarqueeRow';
import Modal from '@components/ui/modal/Modal';

export type Sponsor = {
   name: string;
   logo: StaticImageData | string;
};

type Leader = {
   name: string;
   title: string;
   lines?: string[];
   bio: string;
   photo: StaticImageData;
};

const sponsors: Sponsor[] = [
   {name: 'MGI', logo: bpc},
   {name: 'jamuna', logo: jamuna},
   {name: 'meghna', logo: meghna},
   {name: 'padma', logo: padna}

   // {name: 'Navana LPG', logo: navama},
   // {name: 'G Gas', logo: ggas},
   // {name: 'Beximco LPG', logo: beximco},
   // {name: 'Petromax LPG', logo: prtromax},
   // {name: 'Universal Gas', logo: universal},
];

const leaders: Leader[] = [
   {
      name: 'Sayed Sajjadul Karim Kabul',
      title: 'PRESIDENT',
      bio: `Bangladesh Petroleum Dealers, Distributors, Agents and Petrol Pump Owners Association
Petroleum dealers, distributors, agents and petrol pumps are a traditional and ancient business industry sector in Bangladesh. But in the current global context, ensuring energy security along with protecting the environment has become the most important challenge for all nations. Bangladesh is no exception. Due to limited domestic natural gas reserves and the ever-increasing demand for energy, the country is facing a permanent energy crisis. In this reality, the use of alternative and environmentally friendly fuels has emerged as a strategic necessity rather than an option.
Liquefied Petroleum Gas (LPG) Autogas has already proven itself as a clean, efficient and affordable alternative to conventional fuels like petrol, octane, diesel and CNG in Bangladesh and around the world.
Our association members – petroleum dealers, distributors, agents and petrol pump owners – have played a key role in this transformation by investing significant resources, ensuring fuel supply and maintaining quality of service for consumers.
However, despite these positive developments, we must also acknowledge the challenges faced by stakeholders in this sector. Some provisions of the existing policy and the complex, multi-tiered licensing and approval process have created serious operational difficulties. Entrepreneurs often have to seek permission from numerous authorities, resulting in delays, increased costs and uncertainty. These complexities are discouraging honest and capable investors and putting significant investments at risk, which may adversely affect the future growth of the sector.

On behalf of the Bangladesh Petroleum Dealers, Distributors, Agents and Petrol Pump Owners Association, I respectfully request the concerned authorities to take realistic and timely steps to address these challenges. We strongly believe that introducing a one-stop service system for licensing will enable traders to conduct business without harassment and will increase confidence in the sector.
Our association is fully committed to working hand in hand with the government, regulatory agencies and all stakeholders to build a safe, efficient and sustainable petroleum distribution system. Through collective efforts and visionary policies, we firmly believe that the petroleum sector can play a vital role in shaping a prosperous and energy-secure future for Bangladesh.
Together, let us move forward for a cleaner, safer and more sustainable energy future.
`,
      photo: leaderImg1,
   },
   {
      name: 'Mir Ahasan Uddin Farvez',
      title: 'Member SECRETARY',
      bio: `Bangladesh Petroleum Dealer's, Distributor's, Agent's & Petrol Pump Owner's Association
The role of the energy sector in keeping Bangladesh's economic progress and development momentum going is immense. Our members are working tirelessly to ensure the country's energy security, provide consumer-friendly services and promote the use of environmentally friendly energy.
In the current energy crisis and global reality, the importance of using alternative energy has increased. In this context, the coordinated efforts of petrol pump owners, dealers, distributors and agents are playing an important role in keeping the country's energy supply system sustainable and reliable.
We believe that it is possible to build a safe, modern and strong energy sector through mutual cooperation and realistic policy-making between the government, regulatory agencies and businessmen. Our association will always play a responsible role towards this goal.
`,
      photo: leaderImg2,
   },
];

export default function SponsorsSection() {
   const [activeLeader, setActiveLeader] = useState<Leader | null>(null);

   function bioPreview(bio: string, max = 520) {
      const clean = bio.replace(/\s+/g, ' ').trim();
      return clean.length > max ? `${clean.slice(0, max)}…` : clean;
   }

   const sponsorRows: {
      items: Sponsor[];
      direction: Direction;
      durationSec: number;
   }[] = [
      {
         direction: 'right',
         items: sponsors.slice(0, 3),
         durationSec: 8,
      },
   ];

   
   return (
      <section className='relative z-0 pb-20 pt-12'>
         <div className='pointer-events-none absolute inset-x-0 top-0 h-4' />

         <div className='relative flex flex-col gap-44'>
            <div className='relative flex w-full flex-col items-center text-center'>
               <div className='pointer-events-none absolute inset-y-0 left-0 hidden w-[330px] lg:block'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' />
                  <Image src={folio1} alt='' fill className='object-contain' />
               </div>

               <div className='pointer-events-none absolute inset-y-0 right-0 hidden w-[330px] lg:block'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' />
                  <Image src={folio2} alt='' fill className='object-contain' />
               </div>

               <div className='lpg-container'>
                  <SectionHeading
                     title=' SPONSORS'
                     subtitle=' Lorem ipsum dolor sit amet consectetur. Ultrices volutpat sollicitudin quis at in. In urna fermentum nunc sapien tortor.'
                  />

                  <div className='mt-7 flex w-full flex-col items-center gap-4'>
                     {sponsorRows.map((row, rowIndex) => (
                        <FramerMarqueeRow
                           key={rowIndex}
                           items={row.items}
                           direction={row.direction}
                           durationSec={row.durationSec}
                           className={rowIndex > 0 ? 'mt-1' : ''}
                        />
                     ))}
                  </div>
               </div>
            </div>

            <div className='relative'>
               <div className='pointer-events-none absolute inset-y-0 -top-1/2 left-0 hidden w-[330px] opacity-10 lg:block'>
                  <Image src={arrowuiIcon} alt='' fill className='object-contain' />
               </div>
               <div className='pointer-events-none absolute inset-y-0 -top-1/2 right-0 hidden w-[330px] -scale-x-100 transform opacity-10 lg:block'>
                  <Image src={arrowuiIcon} alt='' fill className='object-contain' />
               </div>

               <div className='lpg-container relative mt-24 grid justify-items-center gap-18 lg:grid-cols-2 lg:items-stretch'>
                  {leaders.map(leader => (
                     <article
                        key={leader.name}
                        className='relative flex h-full min-h-[520px] w-full max-w-[430px] flex-col place-self-center overflow-visible rounded-t-[98px] rounded-b-[12px] border-[4px] border-[#CCD2F4] bg-white/95 px-6 pb-7 pt-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)] md:min-h-[620px]'>
                        <div className='absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3'>
                           <div className='flex h-[180px] w-[180px] items-center justify-center rounded-full bg-[#CCD2F4] p-[4px] sm:h-[240px] sm:w-[240px] lg:h-[270px] lg:w-[270px] lg:h-[200px] lg:w-[200px]'>
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
                           <h3 className='text-[24px] font-extrabold uppercase'>
                              {leader.title}
                           </h3>
                           <p className='mt-1 text-[20px] font-medium'>
                              {leader.name}
                           </p>

                           <div className='mt-2 space-y-2 text-[15px] font-light'>
                              {leader.lines &&
                                 leader.lines.map(line => (
                                    <div className='font-light opacity-80' key={line}>
                                       {line}
                                    </div>
                                 ))}
                           </div>

                           <div className='mt-20 flex flex-1 flex-col'>
                              <p className='text-[15px] leading-relaxed opacity-80'>
                                 {bioPreview(leader.bio)}
                              </p>

                              <button
                                 type='button'
                                 onClick={() => setActiveLeader(leader)}
                                 className='mt-6 inline-flex w-fit self-center rounded-full border border-[#CCD2F4] bg-white px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1B2B7A] hover:bg-[#F4F6FF]'>
                                 Read full
                              </button>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>
            </div>
         </div>

         <Modal
            open={!!activeLeader}
            title={activeLeader ? activeLeader.title : undefined}
            onClose={() => setActiveLeader(null)}
            maxWidthClassName='max-w-[860px] '>
            {activeLeader && (
               <div className='pb-6 pt-8 px-6 overflow-y-hidden'>
                  <p className='mt-1 text-[14px] font-medium opacity-70'>
                     {activeLeader.name}
                  </p>

                  <div className='mt-4 whitespace-pre-line text-[15px] leading-relaxed opacity-85'>
                     {activeLeader.bio}
                  </div>
               </div>
            )}
         </Modal>
      </section>
   );
}
