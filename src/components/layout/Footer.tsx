'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Logo} from './../ui/Logo';
import footerbggridwrap from './../../assets/wrappers/footer-bg-wrapper.png';
import paywithimg from './../../assets/paywith.png';

const usefulLinks = [
   {label: 'Home', href: '/'},
   {label: 'About Us', href: '/about'},
   {label: 'Committee', href: '/committee'},
   {label: 'Member Stations', href: '/stations'},
   {label: 'Downloads', href: '/downloads'},
   {label: 'Notices', href: '/notices'},
   {label: 'Privacy Policy', href: '/privacy'},
];

const services = [
   'Owners Chain Management',
   'LPG Autogas Station Management',
   'LPG Conversion Workshop',
   'Training & Certification',
   'Regulatory Compliance Support',
];

// const paymentIcons = [
//    '/icons/visa.svg',
//    '/icons/mastercard.svg',
//    '/icons/bkash.svg',
//    '/icons/nagad.svg',
// ];

export default function Footer() {
   return (
      <footer className='mt-20 relative pt-22 pb-12'>
         <div className=''>
            <Image
               src={footerbggridwrap}
               alt='Footer Background Grid'
               fill
               className='pointer-events-none  -z-2'
            />
         </div>

         <div className='page-shell lpg-container '>
            {/* top row: 4 columns */}
            <div className='flex flex-col gap-10 lg:flex-row lg:gap-12'>
               {/* left: logo + org info */}
               <div className='lg:w-[38%]'>
                  <div className='flex items-start flex-col gap-4'>
                     <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]'>
                        <div className='relative h-14 w-14 overflow-hidden rounded-full'>
                           <Logo />
                        </div>
                     </div>
                     <div className='text-[16px] font-semibold leading-snug tracking-[0.02em] text-white uppercase'>
                        Bangladesh petroleum dealer's Distributor's Agent's &
                        Petrol Pump Owner's Association
                     </div>
                  </div>

                  <p className='mt-4 text-[18px] leading-[22px] text-white/60'>
                     We represent Bangladesh petroleum dealer's Distributor's
                     Agent's & Petrol Pump Owner's Association across
                     Bangladesh, working to ensure safety, compliance and
                     sustainable growth of the sector.
                  </p>

                  <div className='mt-4 space-y-1 text-[12px] text-white/75'>
                     <div>
                        <span className='font-semibold'>Address:</span> 2/2
                        Pallabi, Dhaka, Bangladesh
                     </div>
                     <div>
                        <span className='font-semibold'>Phone:</span>{' '}
                        +8801730178288
                     </div>
                     <div>
                        <span className='font-semibold'>Email:</span>
                        info@lpgautogasbd.com
                     </div>
                  </div>
               </div>

               {/* middle: useful links */}
               <div className='lg:w-[22%]'>
                  <h4 className='text-[18px] text-[#C3FFA1] font-bold uppercase tracking-[0.01em]'>
                     Useful Links
                  </h4>
                  <ul className='mt-4 space-y-1.5 text-[12px] text-white/80'>
                     {usefulLinks.map(item => (
                        <li key={item.href}>
                           <Link
                              href={item.href}
                              className='transition-colors hover:text-white'>
                              • {item.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* middle-right: services */}
               <div className='lg:w-[22%]'>
                  <h4 className='text-[18px] text-[#C3FFA1] font-bold uppercase tracking-[0.01em]'>
                     Our Services
                  </h4>
                  <ul className='mt-4 space-y-1.5 text-[12px] text-white/80'>
                     {services.map(item => (
                        <li key={item}>• {item}</li>
                     ))}
                  </ul>
               </div>

               {/* right: newsletter */}
               <div className='lg:w-[32%]'>
                  <h4 className='text-[18px] text-[#C3FFA1] font-bold uppercase tracking-[0.01em]'>
                     Join Our Newsletter
                  </h4>
                  <p className='mt-3 text-[12px] text-white/80'>
                     Join our newsletter to get the latest updates of the
                     association.
                  </p>

                  <form
                     className='mt-4 flex rounded-full neon-pill relative h-[44px] w-full'
                     onSubmit={e => e.preventDefault()}>
                     <input
                        type='email'
                        placeholder='Enter your email'
                        className='flex-1 rounded-full bg-transparent px-4 text-[12px] text-white placeholder:text-white/55 focus:outline-none'
                     />
                     <button
                        type='submit'
                        className='absolute right-0 h-full rounded-full bg-[#0D2E65] px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)] sm:px-5'>
                        Subscribe
                     </button>
                  </form>

                  <div className='mt-5 flex items-center gap-3 text-[11px] text-white/75'>
                     <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold'>
                        f
                     </span>
                     <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold'>
                        in
                     </span>
                     <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold'>
                        yt
                     </span>
                  </div>
               </div>
            </div>

            {/* divider */}
            <div className='mt-8 h-px w-full bg-white/25' />

            {/* bottom row: payment icons + copyright */}
            <div className='mt-5 flex flex-col items-start gap-4'>
               <div className='flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-[30px]'>
                  <span className='flex h-[44px] items-center text-nowrap border-r border-[#dddddd86] pr-6 text-white sm:border-r'>
                     Pay With
                  </span>
                  <div className='flex flex-col items-center justify-center gap-1.5 lg:justify-start'>
                     {/* {paymentIcons.map(src => ( */}

                     <div
                        // key={src}
                        className='flex  items-center justify-center rounded-[4px] '>
                        {/* placeholder small logo box */}
                        <Image
                           src={paywithimg}
                           alt='payment'
                           className='object-contain'
                        />
                     </div>
                     {/* ))} */}
                  </div>
               </div>
               <p className='text-center text-[11px] text-white/75  w-full'>
                  © {new Date().getFullYear()} Bangladesh LPG Autogas Station
                  &amp; Conversion Workshop Owner&apos;s Association. All Rights
                  Reserved.
               </p>
            </div>
         </div>
      </footer>
   );
}
