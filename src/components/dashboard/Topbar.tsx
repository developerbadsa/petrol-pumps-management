'use client';

import {Bell, Search} from 'lucide-react';

type TopbarProps = {
   onOpenSidebar?: () => void;
};

export default function Topbar({onOpenSidebar}: TopbarProps) {
   return (
      <header className='sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur'>
         <div className='flex h-16 items-center justify-between px-6'>
            <div className='flex items-center gap-3'>
               <button
                  type='button'
                  onClick={onOpenSidebar}
                  className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 lg:hidden'
                  aria-label='Open menu'>
                  <svg
                     width={17}
                     height={14}
                     viewBox='0 0 17 14'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'>
                     <g clipPath='url(#clip0_239_2967)'>
                        <path
                           d='M0.000443459 12.2282C0.0682927 12.0846 0.118404 11.9281 0.207982 11.7997C0.407095 11.5147 0.691796 11.3649 1.04124 11.3649C4.83016 11.3636 8.61907 11.3631 12.4075 11.3649C12.9925 11.3649 13.455 11.8401 13.455 12.4278C13.455 13.0151 12.992 13.4907 12.4075 13.4912C8.62439 13.493 4.8408 13.4925 1.05765 13.4916C0.588914 13.4916 0.192018 13.1969 0.0452328 12.7497C0.0314856 12.7083 0.0150776 12.6683 0 12.6274C0 12.4945 0 12.3611 0 12.2282H0.000443459Z'
                           fill='#0D2E65'
                        />
                        <path
                           d='M0 0.847755C0.0745011 0.702388 0.131264 0.544128 0.227051 0.414764C0.409756 0.167595 0.664302 0.0302293 0.975166 0.0102246C1.04701 0.00577914 1.11885 0.00222275 1.19069 0.00222275C4.88426 0.0017782 8.57783 0.00266729 12.2714 0C12.6191 0 12.9317 0.0760179 13.1703 0.342303C13.467 0.673492 13.5375 1.05892 13.3747 1.46968C13.2075 1.89156 12.8741 2.10138 12.4284 2.13873C12.3623 2.14406 12.2958 2.14095 12.2293 2.14095C8.59645 2.14095 4.96364 2.13384 1.33082 2.14762C0.67184 2.14984 0.208426 1.9329 0 1.2803V0.847755Z'
                           fill='#0D2E65'
                        />
                        <path
                           d='M10.2588 7.8165C8.40563 7.8165 6.55241 7.81428 4.6992 7.81828C4.26816 7.81917 3.91827 7.67336 3.69077 7.29683C3.2717 6.60511 3.74532 5.72712 4.55862 5.67956C4.5972 5.67733 4.63623 5.67778 4.67481 5.67778C8.40341 5.67778 12.132 5.67778 15.8606 5.67778C16.4353 5.67778 16.8522 5.99874 16.9737 6.52998C17.1121 7.13457 16.669 7.74715 16.0504 7.80495C15.9568 7.81384 15.8628 7.8165 15.7688 7.8165C13.932 7.81695 12.0957 7.81695 10.2588 7.8165Z'
                           fill='#0D2E65'
                        />
                     </g>
                     <defs>
                        <clipPath id='clip0_239_2967'>
                           <rect width={17} height='13.4921' fill='white' />
                        </clipPath>
                     </defs>
                  </svg>
               </button>

               <div className='flex items-center gap-2'>
                  <span className='text-xs font-semibold tracking-wide text-slate-700'>
                     BANGLADESH LPG AUTOGAS STATION & CONVERSION COMMITTEE
                     REGISTER
                  </span>
               </div>
            </div>

            <div className='flex items-center gap-3'>
               <div className='relative hidden w-[360px] md:block'>
                  <Search
                     size={16}
                     className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
                  />
                  <input
                     className='h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-300'
                     placeholder='Search Dashboard'
                  />
               </div>

               <button
                  type='button'
                  className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50'
                  aria-label='Notifications'>
                  <Bell size={18} />
               </button>

               <div className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100'>
                  {/* your avatar svg stays same */}
               </div>
            </div>
         </div>
      </header>
   );
}
