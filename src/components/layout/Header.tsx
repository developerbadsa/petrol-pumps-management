'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState, useCallback} from 'react';
import {Logo} from './../ui/Logo';
import {useAuth} from '@/features/auth/AuthProvider';
import {Menu, X} from 'lucide-react';

type NavChild = {label: string; href: string; action?: () => void};
type NavItem = {
   key: string;
   label: string;
   href: string;
   children?: NavChild[];
};

const downloadFile = (url: string, filename?: string) => {
   const a = document.createElement('a');
   a.href = url;
   a.download = filename ?? '';
   a.rel = 'noopener';
   document.body.appendChild(a);
   a.click();
   a.remove();
};

const MAIN_NAV: NavItem[] = [
   {key: 'about', label: 'ABOUT US', href: '/about'},
   {
      key: 'gallery',
      label: 'GALLERY',
      href: '#',
      children: [
         // { label: 'PHOTO', href: '/gallery/photo' },
         {label: 'Photo', href: '/gallery/print-media-gallery'},
         // {label: 'MEDIA COVERAGE', href: '/gallery/media-coverage'},
         {label: 'VIDEO GALLERY', href: '/gallery/video-gallery'},
      ],
   },
   {
      key: 'committee',
      label: 'COMMITTEE',
      href: '#',
      children: [
         {label: 'ADVISORS', href: '/committee/advisors'},
         {label: 'CENTRAL COMMITTEE', href: '/committee/central-committee'},
         {label: 'ZONAL COMMITTEE', href: '/committee/zonal-committee'},
      ],
   },
   // {
   //    key: 'news-feed',
   //    label: 'News feed',
   //    href: 'news-feed',
   // },
   {
      key: 'stations',
      label: 'MEMBERSHIP STATION',
      href: '#',
      children: [
         {label: 'Member List', href: '/members/all-members'},
         {label: 'Non-Member List', href: '/members/non-members'},
         // {label: 'Running LPG Stations', href: '/members/running-stations'},
         // {label: 'On Going LPG Stations', href: '/members/on-going-stations'},
         {label: 'Total Station List', href: '/members/total-stations'},
         {label: 'Membership Fees', href: '/members/membership-fees'},
         {
            label: 'Download Membership Form',
            href: '/files/membership-form.pdf',
            action: () =>
               downloadFile(
                  '/files/membership-form.pdf',
                  'membership-form.pdf'
               ),
         },
      ],
   },
   {key: 'contact', label: 'CONTACT', href: '/contact'},
   {key: 'downloads', label: 'DOWNLOAD', href: '/downloads'},
   {key: 'notices', label: 'NOTICES', href: '/notices'},
];

function Caret({open}: {open: boolean}) {
   return (
      <svg
         width='12'
         height='12'
         viewBox='0 0 20 20'
         aria-hidden='true'
         className={`transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}>
         <path
            d='M5 7l5 6 5-6'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
         />
      </svg>
   );
}

export default function Header({heroSize = ''}: {heroSize?: string}) {
   const pathname = usePathname();
   const [mobileOpen, setMobileOpen] = useState(false);
   const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

   const {isLoggedIn, logout, loading} = useAuth();

   const closeTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(
      null
   );

   const clearCloseTimer = useCallback(() => {
      if (closeTimerRef.current) {
         clearTimeout(closeTimerRef.current);
         closeTimerRef.current = null;
      }
   }, []);
   const scheduleCloseDropdowns = useCallback(() => {
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => {
         setOpenDropdownKey(null);
      }, 180);
   }, [clearCloseTimer]);

   const openDropdown = useCallback(
      (key: string) => {
         clearCloseTimer();
         setOpenDropdownKey(key);
      },
      [clearCloseTimer]
   );

   const closeDropdowns = useCallback(() => {
      clearCloseTimer();
      setOpenDropdownKey(null);
   }, [clearCloseTimer]);

   const isActive = useCallback(
      (href: string) =>
         href === '/'
            ? pathname === '/'
            : pathname === href || pathname.startsWith(href + '/'),
      [pathname]
   );

   useEffect(() => {
      setMobileOpen(false);
      closeDropdowns();
   }, [pathname, closeDropdowns]);

   useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key !== 'Escape') return;
         setMobileOpen(false);
         closeDropdowns();
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
   }, [closeDropdowns]);

   useEffect(() => {
      if (!mobileOpen) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
         document.body.style.overflow = prev;
      };
   }, [mobileOpen]);

   return (
      <>
         {/* Dropdown backdrop */}
         {openDropdownKey && (
            <div className='fixed inset-0 z-10' onClick={closeDropdowns}>
               <div
                  className={`
              pointer-events-none
              absolute inset-x-0 top-0
              bg-black/10
              backdrop-blur-[4px] ${heroSize}
            `}
               />
            </div>
         )}

         {/* Mobile backdrop */}
         {mobileOpen && (
            <div
               className='fixed inset-0 z-10 bg-black/20 lg:hidden'
               onClick={() => setMobileOpen(false)}
            />
         )}

         <header className='relative z-20 flex justify-center py-6 pt-[70px] md:py-10 md:pt-[80px] px-2 lg:px-0'>
            {/* IMPORTANT: overflow-visible so dropdown isn't clipped */}
            <div className='relative flex h-[70px] w-full items-center justify-between rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur lpg-container overflow-visible md:h-[85px]'>
               <Link
                  href='/'
                  prefetch={false}
                  className='absolute left-0 flex h-full w-[120px] items-center justify-center rounded-l-full bg-[#EEF0FB] md:w-[175px]'>
                  <div className='relative h-[62px] w-[62px] overflow-hidden rounded-full md:h-[82px] md:w-[82px] md:scale-[1.5]'>
                     <Logo />
                  </div>
               </Link>

               <div className='ml-12 flex flex-1 items-center justify-between gap-6 overflow-visible md:ml-16'>
                  <nav className='hidden flex-1 items-center justify-end lg:gap-2 lg:flex  xl:gap-4 overflow-visible'>
                     {MAIN_NAV.map(item => {
                        const hasChildren = !!item.children?.length;
                        const isDropdownOpen = openDropdownKey === item.key;
                        const active = isActive(item.href);
                        return (
                           <div
                              key={item.key}
                              className='relative'
                              onPointerEnter={() =>
                                 hasChildren && openDropdown(item.key)
                              }
                              onPointerLeave={() =>
                                 hasChildren && scheduleCloseDropdowns()
                              }>
                              <Link
                                 href={item.href}
                                 prefetch={false}
                                 aria-haspopup={
                                    hasChildren ? 'menu' : undefined
                                 }
                                 aria-expanded={
                                    hasChildren ? isDropdownOpen : undefined
                                 }
                                 // Touch-friendly: first tap opens, second tap navigates
                                 onClick={e => {
                                    if (!hasChildren) return;
                                    if (!isDropdownOpen) {
                                       e.preventDefault();
                                       openDropdown(item.key);
                                    }
                                 }}
                                 className={`text-[10px] xl:text-[14px] font-semibold uppercase transition-colors ${
                                    active || isDropdownOpen
                                       ? 'text-[#75B553]'
                                       : 'text-[#1C2537] hover:text-[#75B553]'
                                 }`}>
                                 <span className='inline-flex items-center gap-0 tracking-[-0.4]'>
                                    {item.label}
                                    {hasChildren && (
                                       <Caret open={isDropdownOpen} />
                                    )}
                                 </span>
                              </Link>

                              {/* Keep mounted -> enables smooth "drop" transitions if your css has it */}
                              {hasChildren && (
                                 <div
                                    role='menu'
                                    className={`
                          absolute left-1/2 top-full z-30 -translate-x-1/2
                          ${
                             isDropdownOpen
                                ? 'pointer-events-auto opacity-100 translate-y-0'
                                : 'pointer-events-none opacity-0 -translate-y-1'
                          }
                          transition-all duration-150
                        `}
                                    style={{marginTop: 8}} // same as mt-2 but keeps hover-bridge predictable
                                    onPointerEnter={clearCloseTimer}
                                    onPointerLeave={scheduleCloseDropdowns}>
                                    {/* Hover bridge: fixes your screenshot gap */}
                                    <div className='absolute -top-2 left-0 right-0 h-2' />

                                    {/* Use your old classes so it looks like before */}
                                    <div className='dropdown-panel'>
                                       <ul className='dropdown-list'>
                                          {item.children!.map(child => (
                                             <li
                                                key={child.href ?? child.label}>
                                                {child.action ? (
                                                   <button
                                                      type='button'
                                                      className='dropdown-item w-full text-left'
                                                      role='menuitem'
                                                      onClick={() => {
                                                         child.action?.();
                                                         closeDropdowns();
                                                      }}>
                                                      {child.label}
                                                   </button>
                                                ) : (
                                                   <Link
                                                      href={child.href}
                                                      prefetch={false}
                                                      className='dropdown-item'
                                                      role='menuitem'
                                                      onClick={() =>
                                                         closeDropdowns()
                                                      }>
                                                      {child.label}
                                                   </Link>
                                                )}
                                             </li>
                                          ))}
                                       </ul>
                                    </div>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </nav>

                  {/* Desktop auth */}
                  <div className='hidden md:flex justify-end self-end   items-end right-0 w-full lg:w-fit '>
                     {loading ? (
                        <div className='h-[52px] w-[220px]' />
                     ) : isLoggedIn ? (
                        <div className='flex items-center gap-2'>
                           <div className='flex h-[52px] items-center rounded-full border border-[#d0cece75] bg-gradient-to-br from-[#E3E5EF] to-white px-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.08)]'>
                              <Link
                                 href='/dashboard'
                                 className='flex h-[42px] items-center justify-center rounded-full bg-[#009970] px-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(0,166,81,0.25)]'>
                                 Dashboard
                              </Link>
                           </div>

                           <button
                              type='button'
                              onClick={() => void logout()}
                              className='h-[42px] rounded-full border border-slate-200 bg-white px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1C2537] hover:bg-slate-50 hidden xl:block'>
                              Logout
                           </button>
                        </div>
                     ) : (
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
                     )}
                  </div>
                  {/* Mobile hamburger */}
                  <button
                     type='button'
                     onClick={() => setMobileOpen(v => !v)}
                     className='ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur transition hover:bg-white lg:hidden'
                     aria-label={
                        mobileOpen ? 'Close navigation' : 'Open navigation'
                     }
                     aria-expanded={mobileOpen}>
                     {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
               </div>

               {/* Mobile menu */}
               {mobileOpen && (
                  <div className='absolute left-0 right-0 top-full z-20 mt-3 rounded-3xl bg-white/98 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] lg:hidden'>
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

                              {item.children && (
                                 <div className='ml-3 flex flex-col gap-1'>
                                    {item.children.map(child =>
                                       child.action ? (
                                          <button
                                             key={child.href ?? child.label}
                                             type='button'
                                             onClick={() => {
                                                setMobileOpen(false);
                                                child.action?.();
                                             }}
                                             className='text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#6B7280]'>
                                             {child.label}
                                          </button>
                                       ) : (
                                          <Link
                                             key={child.href}
                                             href={child.href}
                                             onClick={() =>
                                                setMobileOpen(false)
                                             }
                                             className='text-[10px] font-medium uppercase tracking-[0.14em] text-[#6B7280]'>
                                             {child.label}
                                          </Link>
                                       )
                                    )}
                                 </div>
                              )}
                           </div>
                        ))}
                     </nav>

                     <div className='mt-4 flex gap-2 md:hidden'>
                        {loading ? (
                           <div className='h-10 w-full rounded-full bg-slate-100' />
                        ) : isLoggedIn ? (
                           <>
                              <Link
                                 href='/dashboard'
                                 onClick={() => setMobileOpen(false)}
                                 className='flex-1 rounded-full bg-[#00A651] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white'>
                                 Dashboard
                              </Link>
                              <button
                                 type='button'
                                 onClick={() => {
                                    setMobileOpen(false);
                                    void logout();
                                 }}
                                 className='flex-1 rounded-full bg-[#F3F5FA] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C2537]'>
                                 Logout
                              </button>
                           </>
                        ) : (
                           <>
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
                           </>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </header>
      </>
   );
}
