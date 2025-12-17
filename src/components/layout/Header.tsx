'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Logo} from './../ui/Logo';

/* ------------------------------------------------------------------ */
/* Nav config                                                          */
/* ------------------------------------------------------------------ */

type NavChild = {label: string; href: string};
type NavItem = {
   key: string;
   label: string;
   href: string;
   children?: NavChild[];
};

const MAIN_NAV: NavItem[] = [
   {key: 'about', label: 'ABOUT US', href: '/about'},
   {
      key: 'gallery',
      label: 'GALLERY',
      href: '/gallery',
      children: [
         {label: 'PHOTO', href: '/gallery/photo'},
         {label: 'PRINT MEDIA', href: '/gallery/print-media-gallery'},
         {label: 'MEDIA COVERAGE', href: '/gallery/media-coverage'},
         {label: 'VIDEO GALLERY', href: '/gallery/video-gallery'},
      ],
   },
   {
      key: 'committee',
      label: 'COMMITTEE',
      href: '/committee',
      children: [
         {label: 'ADVISORS', href: '/committee/advisors'},
         {label: 'CENTRAL COMMITTEE', href: '/committee/central-committee'},
         {label: 'ZONAL COMMITTEE', href: '/committee/zonal-committee'},
      ],
   },
   {
      key: 'stations',
      label: 'MEMBER STATIONS',
      href: '#',
      children: [
         {label: 'Member List', href: '/members/all-members'},
         {label: 'CENTRAL COMMITTEE', href: '/committee/central-committee'},
         {label: 'ZONAL COMMITTEE', href: '/committee/zonal-committee'},
      ],
   },
   {key: 'contact', label: 'CONTACT', href: '/contact'},
   {key: 'downloads', label: 'DOWNLOAD', href: '/downloads'},
   {key: 'notices', label: 'NOTICES', href: '/notices'},
];

export default function Header({heroSize}: {heroSize?: string}) {
   const pathname = usePathname();
   const [mobileOpen, setMobileOpen] = useState(false);
   const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

   const isActive = (href: string) =>
      href === '/'
         ? pathname === '/'
         : pathname === href || pathname.startsWith(href + '/');

   const handleCloseDropdowns = () => {
      setOpenDropdownKey(null);
   };
   return (
      <>
         {openDropdownKey && (
            <div
               className='fixed inset-0 z-10'
               onClick={handleCloseDropdowns}
               onMouseEnter={handleCloseDropdowns}>
               <div
                  className={`
        pointer-events-none
        absolute inset-x-0 top-0
        bg-black/10
        backdrop-blur-[4px] ${heroSize}`}
               />
            </div>
         )}

         <header className='relative z-20 flex justify-center py-10 pt-[80px]'>
            {/* White pill bar */}
            <div className='relative flex h-[85px] w-full items-center justify-between rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur lpg-container'>
               {/* Logo bubble */}
               <Link
                  href='/'
                  className=' absolute left-0 flex h-full w-[225px] items-center justify-center rounded-l-full bg-[#EEF0FB] '>
                  {' '}
                  <div className='relative h-[72px] w-[72px] overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)]'>
                     {' '}
                     <Logo />{' '}
                  </div>{' '}
               </Link>

               {/* Left spacer because of absolute logo */}
               <div className='ml-16 flex flex-1 items-center justify-between gap-6'>
                  {/* Desktop nav */}
                  <nav className='hidden flex-1 items-center justify-end gap-4 lg:flex'>
                     {MAIN_NAV.map(item => {
                        const isDropdownOpen = openDropdownKey === item.key;

                        return (
                           <div
                              key={item.key}
                              className='nav-item relative'
                              onMouseEnter={() =>
                                 item.children && setOpenDropdownKey(item.key)
                              }
                              onMouseLeave={() =>
                                 item.children && setOpenDropdownKey(null)
                              }>
                              <Link
                                 href={item.href}
                                 className={`text-[15px] font-semibold uppercase transition-colors ${
                                    isActive(item.href) || isDropdownOpen
                                       ? 'text-[#75B553]'
                                       : 'text-[#1C2537] hover:text-[#75B553]'
                                 }`}>
                                 {item.label}
                              </Link>

                              {item.children && isDropdownOpen && (
                                 <div className='dropdown-panel'>
                                    <ul className='dropdown-list'>
                                       {item.children.map(child => (
                                          <li key={child.href}>
                                             <Link
                                                href={child.href}
                                                className='dropdown-item'>
                                                {child.label}
                                             </Link>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </nav>

                  {/* Auth buttons (Figma pill) */}
                  <div className='hidden items-center lg:flex'>
                     <div className='flex h-[52px] items-center rounded-full border border-[#d0cece75] bg-gradient-to-br from-[#E3E5EF] to-white px-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.08)]'>
                        <Link
                           href='/login'
                           className='flex h-8 items-center justify-center px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C2537]'>
                           Login
                        </Link>
                        <Link
                           href='/register'
                           className='flex h-[42px] items-center justify-center rounded-full bg-[#009970] px-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(0,166,81,0.25)]'>
                           Register
                        </Link>
                     </div>
                  </div>

                  {/* Mobile hamburger */}
                  <button
                     type='button'
                     onClick={() => setMobileOpen(v => !v)}
                     className='ml-auto inline-flex items-center justify-center rounded-full border border-slate-200 p-1.5 lg:hidden'
                     aria-label='Toggle navigation'>
                     <span className='block h-0.5 w-5 bg-slate-800' />
                     <span className='mt-1 block h-0.5 w-5 bg-slate-800' />
                  </button>
               </div>

               {/* Mobile dropdown */}
               {mobileOpen && (
                  <div className='absolute left-0 right-0 top-full mt-3 rounded-3xl bg-white/98 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] lg:hidden'>
                     <nav className='flex flex-col gap-3'>
                        {MAIN_NAV.map(item => (
                           <div key={item.key} className='flex flex-col gap-1'>
                              <Link
                                 href={item.href}
                                 onClick={() => setMobileOpen(false)}
                                 className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                                    isActive(item.href)
                                       ? 'text-[#68B52F]'
                                       : 'text-[#1C2537] hover:text-[#68B52F]'
                                 }`}>
                                 {item.label}
                              </Link>

                              {/* simple nested list for gallery on mobile */}
                              {item.children && (
                                 <div className='ml-3 flex flex-col gap-1'>
                                    {item.children.map(child => (
                                       <Link
                                          key={child.href}
                                          href={child.href}
                                          onClick={() => setMobileOpen(false)}
                                          className='text-[10px] font-medium uppercase tracking-[0.14em] text-[#6B7280]'>
                                          {child.label}
                                       </Link>
                                    ))}
                                 </div>
                              )}
                           </div>
                        ))}
                     </nav>

                     <div className='mt-4 flex gap-2'>
                        <Link
                           href='/login'
                           onClick={() => setMobileOpen(false)}
                           className='flex-1 rounded-full bg-[#F3F5FA] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C2537]'>
                           Login
                        </Link>
                        <Link
                           href='/register'
                           onClick={() => setMobileOpen(false)}
                           className='flex-1 rounded-full bg-[#00A651] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white'>
                           Register
                        </Link>
                     </div>
                  </div>
               )}
            </div>
         </header>
      </>
   );
}
