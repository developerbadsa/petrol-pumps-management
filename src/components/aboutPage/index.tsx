import Image from 'next/image';
import PageHero from '@/components/shared/PageHero';

import aboutHero from './img/banner-bg.png';

type InfoCardProps = {
   title: string;
   iconLabel: string;
   items: string[];
   variant?: 'default' | 'wide';
};

const InfoCard = ({
   title,
   iconLabel,
   items,
   variant = 'default',
}: InfoCardProps) => {
   return (
      <article
         className={[
            'relative overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]',
            variant === 'wide' ? 'md:col-span-2' : '',
         ].join(' ')}>
         {/* top accent strip + tab */}
         <div className='h-[9px] w-full bg-[#6CC12A]' />
         <div className='absolute right-6 top-[9px] h-7 w-24 rounded-b-[18px] bg-[#E6F8D9]' />

         <div className='px-6 pb-7 pt-7 md:px-8 md:pb-9 md:pt-9'>
            <div className='mb-3 flex items-center gap-3 md:mb-4'>
               <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl'>
                  <span aria-hidden='true'>{iconLabel}</span>
               </div>
               <h3 className='text-lg font-semibold text-[#003B4A] md:text-xl'>
                  {title}
               </h3>
            </div>

            <ul className='space-y-2 text-sm leading-relaxed text-[#23425A] md:text-[15px]'>
               {items.map((item, idx) => (
                  <li key={idx} className='flex gap-2'>
                     <span className='mt-1 h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[#6CC12A]' />
                     <span>{item}</span>
                  </li>
               ))}
            </ul>
         </div>
      </article>
   );
};

export default function AboutPage() {
   return (
      <div className='relative bg-green-700n text-[#003B4A]'>
         <PageHero
            title='About us'
            backgroundImage={aboutHero}
            height='compact'
         />

         {/* MAIN ABOUT + LOGO */}
         <section className='relative py-12 md:py-20'>
            {/* right-side geometric pattern */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[url('/images/pattern-mesh.svg')] bg-right bg-contain bg-no-repeat opacity-60" />

            <div className='lpg-container relative z-10 grid items-center gap-10 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]'>
               {/* big circular logo */}
               <div className='flex justify-center md:justify-start'>
                  <div className='relative flex h-[260px] w-[260px] items-center justify-center rounded-full bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:h-[320px] md:w-[320px]'>
                     {/* <Image
                src={associationLogo}
                alt="Association logo"
                className="h-[210px] w-[210px] object-contain md:h-[260px] md:w-[260px]"
              /> */}
                     <div className='pointer-events-none absolute inset-4 rounded-full border-[6px] border-[#0C5B46]/10' />
                  </div>
               </div>

               {/* text block */}
               <div className='space-y-4 text-sm leading-relaxed text-[#23425A] md:space-y-5 md:text-[15px]'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6CC12A] md:text-xs'>
                     Bangladesh LPG Autogas Station &amp; Conversion Workshop
                     Owners&apos; Association
                  </p>

                  <h2 className='text-[22px] font-semibold text-[#003B4A] md:text-[26px] lg:text-[28px]'>
                     A national platform for safe and sustainable LPG autogas in
                     Bangladesh.
                  </h2>

                  <p>
                     Bangladesh LPG Autogas Station &amp; Conversion Workshop
                     Owners&apos; Association is the nationwide organization
                     representing owners and operators of LPG autogas stations
                     and conversion workshops. The association works with
                     government bodies, regulators and industry stakeholders to
                     ensure safe, compliant and future-ready LPG services.
                  </p>
                  <p>
                     We support members with up-to-date regulatory information,
                     standard operating procedures, safety guidelines and
                     capacity-building programs. Our aim is to raise the overall
                     service quality of the sector while protecting consumer
                     interests.
                  </p>
                  <p>
                     Through regular dialogue, training and advocacy, we help
                     build a modern LPG ecosystem that contributes to cleaner
                     transport, economic growth and a safer Bangladesh.
                  </p>
               </div>
            </div>
         </section>

         {/* MISSION / VISION / ACTIVITIES CARDS */}
         <section className='pb-16 md:pb-24'>
            <div className='lpg-container space-y-6 md:space-y-8'>
               <div className='grid gap-6 md:grid-cols-2'>
                  <InfoCard
                     title='Our Mission'
                     iconLabel='🎯'
                     items={[
                        'Promote safe and compliant LPG autogas operations across all member stations.',
                        'Provide technical guidance, training and support to station and workshop owners.',
                        'Act as a bridge between government, regulators and industry participants.',
                     ]}
                  />
                  <InfoCard
                     title='Our Vision'
                     iconLabel='👁️'
                     items={[
                        'A trusted and well-regulated LPG autogas network throughout Bangladesh.',
                        'Recognised conversion workshops adhering to national and international standards.',
                        'A cleaner transport sector driven by safe LPG usage and responsible service.',
                     ]}
                  />
               </div>

               <InfoCard
                  title='Our Activities'
                  iconLabel='✅'
                  variant='wide'
                  items={[
                     'Policy advocacy and liaison with relevant ministries, departments and authorities.',
                     'Arranging trainings, workshops and seminars on safety, compliance and best practices.',
                     'Supporting members on licensing, documentation and safety audit preparation.',
                     'Organising awareness campaigns to build public confidence in LPG as a clean fuel.',
                     'Collaborating with stakeholders to promote innovation and sustainable growth of the sector.',
                  ]}
               />
            </div>
         </section>

         {/* <Footer /> */}
      </div>
   );
}
