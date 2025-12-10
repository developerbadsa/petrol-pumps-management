'use client';

import {useState} from 'react';
import type {ReactNode} from 'react';
import Image, {StaticImageData} from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';
import stationIllustration from './img/why-choose-station.png';
import pillimg1 from './img/Mask group (15).png';
import pillimg2 from './img/Mask group (16).png';
import pillimg3 from './img/Mask group (17).png';
import minigridbg from '@assets/wrappers/verticle-container-grid.png';
import maskgridbg from './img/Mask group (19).png';

type PillId = 'mission' | 'vision' | 'activities';
type ContentId = 'who' | PillId;

type PillItem = {
   id: PillId;
   label: string;
   accent?: boolean;
   img: StaticImageData | string;
   icon: ReactNode;
};

const PILL_ITEMS: PillItem[] = [
   {
      id: 'mission',
      label: 'OUR MISSION',
      img: pillimg1,

      icon: (
         <svg
            xmlns='http://www.w3.org/2000/svg'
            width='62'
            height='62'
            viewBox='0 0 62 62'
            fill='none'>
            <g clip-path='url(#clip0_1_824)'>
               <path
                  d='M18.2652 61.8563C12.6943 61.8563 7.12214 61.8563 1.55124 61.8563C0.500077 61.8563 0.0025611 61.5437 9.73736e-06 60.888C-0.00254163 60.2247 0.49625 59.8267 1.53721 59.9351C2.99021 60.0869 4.03499 59.5894 5.06957 58.5548C7.53802 56.0902 10.12 53.7366 12.6994 51.3842C13.3832 50.7604 13.7557 50.0856 13.9024 49.1734C14.4981 45.4944 15.1475 41.823 15.8057 38.1541C15.8631 37.8365 16.0634 37.4882 16.3032 37.2688C17.607 36.076 18.9439 34.919 20.2681 33.7479C21.2427 32.8855 21.9354 32.9889 22.5847 34.1076C25.1654 38.5521 27.7435 42.9979 30.3243 47.4423C30.4365 47.635 30.5398 47.8416 30.6878 48.0024C31.0169 48.3583 31.4303 48.4323 31.8385 48.172C32.234 47.9195 32.4011 47.5393 32.2021 47.0724C32.1153 46.8683 32.0031 46.6731 31.8908 46.4805C29.8051 42.9124 27.7359 39.3341 25.617 35.7852C25.1412 34.9879 25.1679 34.3526 25.6451 33.5655C28.4567 28.9207 31.23 24.2543 33.9957 19.5814C34.1985 19.2383 34.321 18.7931 34.3222 18.3938C34.3427 12.7323 34.3363 7.0721 34.3363 1.41063C34.3363 0.0992255 34.9269 -0.298787 36.1133 0.212761C39.7796 1.79716 43.4434 3.38666 47.1122 4.96723C47.6059 5.18027 48.0537 5.40989 48.0524 6.04263C48.0499 6.67919 47.5881 6.90499 47.0995 7.11165C43.835 8.49832 40.5705 9.89009 37.3061 11.2768C36.3863 11.6671 36.1962 11.9465 36.1962 12.9517C36.1962 14.5846 36.2753 16.2226 36.1784 17.8503C35.9972 20.9273 36.5304 23.8614 37.4336 26.798C39.0014 31.8931 40.3868 37.043 41.8705 42.1636C42.0899 42.9188 41.9406 43.4775 41.3857 44.035C38.8573 46.5685 36.3557 49.1301 33.8451 51.6827C33.1639 52.3754 33.1257 52.5948 33.5466 53.4546C34.5276 55.46 35.4461 57.5011 36.519 59.4567C37.2206 60.735 36.8787 61.8971 34.9792 61.8741C29.4083 61.8091 23.8361 61.8512 18.2652 61.8512V61.8563Z'
                  fill='white'
               />
               <path
                  d='M50.6586 61.8565C47.4146 61.8565 44.1692 61.8387 40.9252 61.868C40.0309 61.8757 39.4837 61.5619 39.0997 60.7276C38.0447 58.4364 36.917 56.1785 35.8199 53.9065C35.3862 53.0059 35.4359 52.7188 36.1312 52.0057C38.6468 49.4276 41.1561 46.8418 43.6858 44.2776C44.0812 43.8771 44.1692 43.5148 44.0111 42.9675C41.9075 35.6821 39.8268 28.389 37.7411 21.0985C37.7347 21.0768 37.7232 21.0564 37.7194 21.0347C37.6339 20.5959 37.2984 20.0894 37.8891 19.7845C38.4644 19.4873 38.7259 20.0154 39.0282 20.3509C40.0909 21.5322 41.1038 22.7594 42.2111 23.8961C43.275 24.988 44.0098 26.2484 44.6298 27.63C49.2886 38.0191 53.9882 48.3892 58.6482 58.7783C59.022 59.6101 59.5093 59.9902 60.4355 59.9303C61.4318 59.8652 61.9114 60.2224 61.9242 60.8717C61.9369 61.5172 61.4382 61.8565 60.4584 61.8565C57.1914 61.8578 53.9244 61.8565 50.6574 61.8565H50.6586Z'
                  fill='white'
               />
            </g>
            <defs>
               <clipPath id='clip0_1_824'>
                  <rect width='61.9254' height='61.8808' fill='white' />
               </clipPath>
            </defs>
         </svg>
      ),
   },
   {
      id: 'vision',
      label: 'OUR VISION',
      accent: true,
      img: pillimg2,
      icon: (
         <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='62'
            viewBox='0 0 64 62'
            fill='none'>
            <g clip-path='url(#clip0_1_836)'>
               <path
                  d='M31.3789 50.5069C18.1972 49.9659 7.60278 44.1135 0.263687 32.4498C-0.0699083 31.9198 -0.0988826 31.5349 0.242543 30.9835C6.08672 21.5622 14.3702 15.6554 25.2246 13.596C40.3006 10.7353 55.6084 17.7692 63.4573 31.0182C63.7423 31.4994 63.7948 31.8496 63.4815 32.3567C57.635 41.8057 49.3366 47.6817 38.4635 49.8192C37.5911 49.9903 36.7109 50.1473 35.8268 50.2285C34.4971 50.3508 33.1612 50.4005 31.3789 50.5077V50.5069ZM31.8832 16.2627C23.3867 16.2438 16.5261 23.1152 16.5096 31.6595C16.4932 40.218 23.3131 47.1241 31.7994 47.1422C40.2967 47.1604 47.1557 40.2905 47.173 31.7439C47.1902 23.183 40.3734 16.2808 31.8832 16.2619V16.2627Z'
                  fill='white'
               />
               <path
                  d='M5.50812 57.465C5.52065 55.0034 7.45331 53.0734 9.90045 53.0781C12.3601 53.0829 14.3202 55.0815 14.2936 57.5565C14.2677 59.9716 12.2622 61.9419 9.8472 61.9245C7.44078 61.9072 5.49559 59.9077 5.50812 57.4643V57.465Z'
                  fill='white'
               />
               <path
                  d='M61.1134 52.3756C61.0978 53.9815 59.7423 55.327 58.1581 55.3081C56.5708 55.2892 55.2278 53.92 55.234 52.3275C55.2403 50.6917 56.613 49.3445 58.2434 49.3745C59.8495 49.4037 61.1291 50.7422 61.1134 52.3756Z'
                  fill='white'
               />
               <path
                  d='M58.1739 6.68286C58.159 7.89119 57.1848 8.86921 55.9922 8.87237C54.7768 8.87631 53.7768 7.85175 53.7933 6.61976C53.8097 5.38224 54.8097 4.42315 56.0556 4.45154C57.2616 4.47915 58.1888 5.45481 58.1739 6.68286Z'
                  fill='white'
               />
               <path
                  d='M3.66232 16.2516C3.05934 16.2452 2.54955 15.6979 2.57226 15.0811C2.59419 14.484 3.07814 14.0266 3.68268 14.0313C4.28174 14.036 4.76647 14.5085 4.779 15.1008C4.79232 15.7081 4.25825 16.2579 3.66232 16.2516Z'
                  fill='white'
               />
               <path
                  d='M43.8863 2.21799C43.2763 2.20537 42.8323 1.74791 42.83 1.12876C42.8276 0.500928 43.3437 -0.0204214 43.9474 0.000874274C44.5066 0.0205925 45.0281 0.556139 45.0328 1.11693C45.0383 1.72819 44.5152 2.2314 43.8863 2.21878V2.21799Z'
                  fill='white'
               />
               <path
                  d='M17.2253 1.87646C17.2151 2.49246 16.6834 2.98778 16.0601 2.96254C15.4618 2.93809 15.0162 2.45776 15.0233 1.84492C15.0303 1.25021 15.5119 0.752526 16.0906 0.743062C16.6873 0.732808 17.2347 1.28019 17.2253 1.87725V1.87646Z'
                  fill='white'
               />
               <path
                  d='M63.3234 43.8618C63.3234 44.4557 62.7588 45.007 62.1731 44.985C61.5881 44.9629 61.123 44.4683 61.1206 43.865C61.1183 43.2174 61.5975 42.7497 62.2443 42.7678C62.8348 42.7844 63.3242 43.2797 63.3234 43.861V43.8618Z'
                  fill='white'
               />
               <path
                  d='M22.7196 57.4818C22.0884 57.4944 21.5872 56.9991 21.5951 56.3705C21.6029 55.7766 22.0853 55.2828 22.671 55.2686C23.2732 55.2536 23.8073 55.7868 23.8018 56.3965C23.7963 56.9857 23.3132 57.47 22.7196 57.4818Z'
                  fill='white'
               />
               <path
                  d='M46.1369 61.1786C45.5175 61.1944 45.0069 60.6872 45.0116 60.061C45.0163 59.4702 45.4979 58.9717 46.0805 58.956C46.6906 58.9394 47.2113 59.4592 47.2066 60.0783C47.2011 60.6738 46.7258 61.1636 46.1369 61.1786Z'
                  fill='white'
               />
               <path
                  d='M61.8496 17.366C61.8316 17.9812 61.2929 18.471 60.675 18.4332C60.0799 18.3969 59.6264 17.9 59.6429 17.3029C59.6601 16.6775 60.1863 16.1971 60.8105 16.235C61.4001 16.2713 61.8669 16.7784 61.8496 17.3653V17.366Z'
                  fill='white'
               />
               <path
                  d='M1.09611 46.0135C1.13213 45.403 1.68891 44.9227 2.30128 44.974C2.90113 45.0244 3.32948 45.519 3.30129 46.1287C3.27231 46.7581 2.74216 47.2218 2.11413 47.1682C1.53229 47.1185 1.06322 46.5861 1.09611 46.0135Z'
                  fill='white'
               />
               <path
                  d='M31.8291 17.6732C39.4681 17.6621 45.7782 24.0145 45.7728 31.7094C45.7673 39.405 39.4462 45.7574 31.8158 45.7337C24.1948 45.7101 17.9317 39.4042 17.9097 31.733C17.8878 24.0437 24.1838 17.6834 31.8291 17.6724V17.6732ZM21.5965 31.6368C21.5534 37.2825 26.1713 41.9857 31.7939 42.0212C37.3953 42.0567 42.0656 37.3866 42.086 31.7307C42.1056 26.1102 37.5229 21.4449 31.9246 21.3857C26.3224 21.3265 21.6404 25.9737 21.5965 31.6368Z'
                  fill='white'
               />
               <path
                  d='M39.173 26.9792C41.0172 29.3075 41.3242 33.9003 38.7353 37.194C36.1433 40.4925 31.5262 41.502 27.7619 39.5334C24.0681 37.6018 22.2208 33.2117 23.4056 29.1774C24.5363 25.3252 28.4486 22.5213 32.2106 22.9291C30.4118 24.5546 29.7627 26.4618 30.9146 28.6694C31.8065 30.3794 33.3242 31.105 35.2364 30.9599C37.1182 30.8163 38.2858 29.6293 39.1738 26.9784L39.173 26.9792Z'
                  fill='white'
               />
               <path
                  d='M37.6601 26.5879C37.6608 28.2245 36.3727 29.5472 34.7611 29.5646C33.1377 29.5819 31.8104 28.2214 31.8237 26.5532C31.837 24.9213 33.1409 23.6223 34.7579 23.6302C36.368 23.6373 37.6593 24.9536 37.6601 26.5879Z'
                  fill='white'
               />
            </g>
            <defs>
               <clipPath id='clip0_1_836'>
                  <rect width='63.6947' height='61.9254' fill='white' />
               </clipPath>
            </defs>
         </svg>
      ),
   },
   {
      id: 'activities',
      label: 'OUR ACTIVITIES',
      img: pillimg3,
      icon: (
         <svg
            width='54'
            height='54'
            viewBox='0 0 54 54'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clip-path='url(#clip0_1_861)'>
               <path
                  d='M26.5805 53.7777C25.8028 53.7746 25.2671 53.2823 25.187 52.4798C24.8287 48.8933 24.0685 45.3927 22.9511 41.9675C20.8207 35.4367 17.5698 29.4861 13.5919 23.9135C11.1932 20.553 8.55242 17.3916 5.71622 14.3925C4.90233 13.5315 4.84907 12.5175 5.57609 11.7967C6.22296 11.1555 7.07253 11.049 7.83626 11.6395C9.20808 12.7001 10.5535 13.7968 11.8705 14.9246C14.1364 16.8647 16.3645 18.8492 19.0177 20.2691C24.7258 23.3241 30.2999 22.9259 35.6 19.3766C37.9321 17.8151 40.018 15.8853 42.2151 14.1215C43.2011 13.3299 44.165 12.5077 45.1759 11.7486C46.1283 11.0335 47.0524 11.1281 47.7256 11.9275C48.3285 12.6437 48.222 13.5895 47.4526 14.4054C41.956 20.2371 37.204 26.6019 33.6015 33.7872C31.0704 38.8355 29.2528 44.1206 28.3448 49.7041C28.1943 50.6302 28.1033 51.5656 27.9917 52.4979C27.8965 53.2927 27.3644 53.7792 26.58 53.7766L26.5805 53.7777Z'
                  fill='white'
               />
               <path
                  d='M26.5652 21.254C23.6679 21.2359 21.3333 18.8972 21.3302 16.0092C21.3271 13.1172 23.7398 10.7086 26.6112 10.7371C29.497 10.7655 31.8363 13.1177 31.8456 16.0005C31.8549 18.9028 29.4737 21.2716 26.5657 21.2535L26.5652 21.254Z'
                  fill='white'
               />
               <path
                  d='M50.8691 36.8923C48.3452 39.5041 43.2246 38.7078 41.5642 35.4455C43.9852 32.9361 48.9145 33.356 50.8691 36.8923Z'
                  fill='white'
               />
               <path
                  d='M13.7886 48.2579C14.2596 44.4428 18.4997 42.0865 21.8908 43.4842C21.6596 46.8457 17.5912 49.7791 13.7886 48.2579Z'
                  fill='white'
               />
               <path
                  d='M11.6131 35.4262C9.98584 38.5183 5.32175 39.6575 2.31543 36.9076C4.06886 33.5559 8.95271 32.7963 11.6131 35.4262Z'
                  fill='white'
               />
               <path
                  d='M40.2545 36.7424C43.5897 38.0656 45.0556 42.678 42.6977 45.8286C39.1769 44.4423 37.9198 39.6345 40.2545 36.7424Z'
                  fill='white'
               />
               <path
                  d='M19.7923 9.56844C15.9582 10.3834 12.3634 7.24466 12.4865 3.63129C15.7363 2.43838 20.2582 6.09105 19.7923 9.56844Z'
                  fill='white'
               />
               <path
                  d='M40.6613 3.60016C40.9256 6.89916 37.4673 10.435 33.4072 9.56627C33.1083 5.95186 36.9714 2.67355 40.6613 3.60016Z'
                  fill='white'
               />
               <path
                  d='M37.2569 48.7309C34.447 48.6627 31.9335 46.6657 31.2923 43.9526C31.2132 43.6175 31.2571 43.4443 31.6367 43.3264C34.9274 42.3025 38.6669 44.4883 39.3676 47.8576C39.4369 48.1916 39.3495 48.3715 39.0108 48.4284C38.4255 48.5267 37.8412 48.6301 37.2569 48.7314V48.7309Z'
                  fill='white'
               />
               <path
                  d='M0.511841 32.2215C0.657141 28.6418 4.08282 25.8355 7.81823 26.5569C8.16726 26.6241 8.16933 26.8196 8.14761 27.1008C7.96456 29.4577 5.92467 31.7308 3.48093 32.2872C2.41057 32.5307 1.40381 32.5121 0.512358 32.2215H0.511841Z'
                  fill='white'
               />
               <path
                  d='M45.0302 26.6896C48.1792 25.6647 52.4446 27.9952 52.6618 32.1944C49.2837 33.3517 45.1299 30.6075 45.0302 26.6896Z'
                  fill='white'
               />
               <path
                  d='M10.4952 45.8529C8.1352 42.7008 9.55666 38.0806 12.9244 36.7424C15.1044 39.4313 14.2502 44.1791 10.4952 45.8529Z'
                  fill='white'
               />
               <path
                  d='M0 20.1258C3.42723 18.6433 7.70661 21.0994 8.13475 24.8235C4.78612 26.2837 0.452448 23.9336 0 20.1258Z'
                  fill='white'
               />
               <path
                  d='M45.0199 24.87C45.4051 21.1749 49.7533 18.6702 53.2172 20.1185C52.9111 21.9128 51.9979 23.3187 50.4575 24.2909C48.7517 25.3669 46.9305 25.5277 45.0199 24.87Z'
                  fill='white'
               />
               <path
                  d='M31.5468 9.1229C28.0285 7.51218 26.8134 2.92617 29.1056 0.00878906C32.4361 1.25806 33.9869 5.97283 31.5468 9.1229Z'
                  fill='white'
               />
               <path
                  d='M21.5969 9.10894C19.1987 5.84511 20.7603 1.30926 24.0525 0C26.3691 2.79639 25.0205 7.85036 21.5969 9.10894Z'
                  fill='white'
               />
            </g>
            <defs>
               <clipPath id='clip0_1_861'>
                  <rect width='53.2172' height='53.7777' fill='white' />
               </clipPath>
            </defs>
         </svg>
      ),
   },
];

const CONTENT: Record<
   ContentId,
   {badge: string; heading: string; body: string}
> = {
   who: {
      badge: '?',
      heading: 'WHO ARE WE?',
      body: 'Lorem ipsum dolor sit amet consectetur. Sed facilisis ac blandit lorem sed tincidunt pellentesque. Lorem ipsum dolor sit amet consectetur amet dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
   },
   mission: {
      badge: 'M',
      heading: 'OUR MISSION',
      body: 'We work to ensure safe, reliable and sustainable LPG autogas usage across Bangladesh through strong regulations, modern infrastructure and member support.',
   },
   vision: {
      badge: 'V',
      heading: 'OUR VISION',
      body: 'To build a cleaner, greener future where LPG autogas is a trusted solution for transport and industry, reducing emissions and improving air quality nationwide.',
   },
   activities: {
      badge: 'A',
      heading: 'OUR ACTIVITIES',
      body: 'We arrange trainings, awareness programs, technical workshops and policy dialogues to help our members maintain world-class safety and service standards.',
   },
};

export default function WhyChooseUsSection() {
   const [hoveredId, setHoveredId] = useState<PillId | null>(null);

   const activeContent = CONTENT[hoveredId ?? 'who'];

   return (
      <section className='relative w-full py-16'>
         {/* light background glow */}
         <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#E1F4E880,_transparent_70%)]' />

         <div className='lpg-container relative'>
            <SectionHeading
               title='WHY CHOOSE US'
               subtitle='Lorem ipsum dolor sit amet consectetur. Urna ultrices amet ultrices sagittis leo in. In urna fermentum nunc sapien tortor.'
            />

            <div className='mt-10 flex gap-4 lg:gap-6   h-[570px]'>
               {/* LEFT: main card + dynamic content */}
               <div
                  className='relative w-[700px]
              overflow-hidden rounded-[15px]
              shadow-[0_22px_40px_rgba(0,0,0,0.22)]
            '>
                  <Image
                     src={stationIllustration}
                     alt='Modern LPG station illustration'
                     fill
                     priority
                     className='object-cover'
                  />

                  <div className='absolute inset-x-0 bottom-0 flex justify-between gap-6  pb-6 pt-5 w-full bg-[#228759da] px-4'>
                     <div className='opacity-100 z-1'>
                        <Image
                           fill
                           src={maskgridbg}
                           alt={'background'}
                           className='object-cover'
                        />
                     </div>
                     <div className='w-full text-white'>
                        <div className='flex items-center gap-2'>
                           <div className='flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/10 text-[13px] font-semibold'>
                              {activeContent.badge}
                           </div>
                           <p className='text-[22px] font-bold uppercase tracking-[0.18em]'>
                              {activeContent.heading}
                           </p>
                        </div>

                        <p className='mt-3 text-[15px] leading-relaxed text-white/90'>
                           {activeContent.body}
                        </p>

                        <button
                           type='button'
                           className='
                    mt-4 inline-flex items-center gap-2
                    rounded-full border border-[#46FF5B66] bg-white/10 px-4 py-1.5
                    text-[11px] font-semibold uppercase tracking-[0.18em]
                    transition-colors hover:bg-white hover:text-[#009F6B]
                  '>
                           Learn more
                        </button>
                     </div>
                  </div>
               </div>

               {/* RIGHT: vertical pills */}
               <div className='flex h-full min-h-[280px] shrink-0 gap-3 flex-1'>
                  {PILL_ITEMS.map(pill => (
                     <div
                        key={pill.id}
                        onMouseEnter={() => setHoveredId(pill.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className='
                  relative flex h-full w-[145px] cursor-pointer items-center justify-center
                  overflow-hidden rounded-[15px]
                  bg-gradient-to-b from-[#00b06d30] via-[#00A261] to-[#00894e32]
                  shadow-[0_22px_36px_rgba(0,0,0,0.22)]
                '>
                        <div className='opacity-60 z-0'>
                           <Image
                              fill
                              src={pill.img}
                              alt={pill.label}
                              className='object-cover'
                           />
                        </div>
                        <div className='opacity-90 z-1'>
                           <Image
                              fill
                              src={minigridbg}
                              alt={pill.label}
                              className='object-cover'
                           />
                        </div>

                        <div className='pointer-events-none absolute inset-[1px] rounded-[24px] bg-[linear-gradient(180deg,#16C17C33_0%,transparent_40%,#00693F66_100%)]' />

                        <div className='absolute top-5 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-white/10 p-2 z-2'>
                           {/* <span className='h-5 w-5 rounded-full border border-white/70 bg-white/20 ' /> */}
                           {pill.icon}
                        </div>

                        <p
                           className=' relative
                    text-[22px] font-bold tracking-[0.05em] text-white
                    [writing-mode:vertical-rl] rotate-180 z-2
                  '>
                           {pill.label}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
