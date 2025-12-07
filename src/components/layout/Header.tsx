'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Logo} from './../ui/Logo';

const MAIN_NAV = [
   {label: 'ABOUT US', href: '/about'},
   {label: 'GALLERY', href: '/gallery'},
   {label: 'COMMITTEE', href: '/committee'},
   {label: 'MEMBER STATIONS', href: '/stations'},
   {label: 'CONTACT', href: '/contact'},
   {label: 'DOWNLOAD', href: '/downloads'},
   {label: 'NOTICES', href: '/notices'},
];

export function Header() {
   const pathname = usePathname();
   const [open, setOpen] = useState(false);

   const isActive = (href: string) => pathname.startsWith(href);

   return (
      <header className='relative z-20 mt-16 flex justify-center'>
         {/* White pill bar */}
         <div className='relative flex w-full lpg-container items-center justify-between rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur h-[85px]'>
            {/* Logo bubble */}
            <div className='pointer-events-none bg-[#EEF0FB] h-full w-[225px] rounded-l-full absolute left-0 flex justify-center items-center'>
               <div className='flex items-center h-full justify-center rounded-full   absolute  left-10 '>
                  <Logo style={'!w-[180px !h-[180px bg-red-400'} />
               </div>
            </div>

            {/* Left spacer because of absolute logo */}
            <div className='ml-16 flex flex-1 items-center justify-between gap-6'>
               {/* Desktop nav */}
               <nav className='hidden flex-1 items-center justify-end gap-3 lg:flex'>
                  {MAIN_NAV.map(item => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={`text-[13px] font-semibold ${
                           isActive(item.href)
                              ? 'text-[#75B553]'
                              : 'text-[#1C2537] hover:text-[#75B553]'
                        } uppercase transition-colors`}>
                        {item.label}
                     </Link>
                  ))}
               </nav>

{/* Auth buttons */}
{/* Auth buttons (Figma pill) */}
<div className="hidden items-center lg:flex">
  {/* light inner pill */}
  <div className="flex h-[52px] items-center rounded-full border border-[#d0cece75] bg-linear-to-br from-[#d0d0d0] to-[#fff] px-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.08)] p-2">
    {/* LOGIN */}
    <Link
      href="/"
      className="flex h-8 items-center justify-center px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C2537]"
    >
      Login
    </Link>

    {/* REGISTER */}
    <Link
      href="/"
      className="flex h-[42px] items-center justify-center rounded-full bg-[#009970] px-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(0,166,81,0.15)]"
    >
      Register
    </Link>
  </div>
</div>

               {/* Mobile hamburger */}
               <button
                  type='button'
                  onClick={() => setOpen(v => !v)}
                  className='ml-auto inline-flex items-center justify-center rounded-full border border-slate-200 p-1.5 lg:hidden'
                  aria-label='Toggle navigation'>
                  <span className='block h-0.5 w-5 bg-slate-800' />
                  <span className='mt-1 block h-0.5 w-5 bg-slate-800' />
               </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
               <div className='absolute left-0 right-0 top-full mt-3 rounded-3xl bg-white/98 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] lg:hidden'>
                  <nav className='flex flex-col gap-3'>
                     {MAIN_NAV.map(item => (
                        <Link
                           key={item.href}
                           href={item.href}
                           onClick={() => setOpen(false)}
                           className={`text-xs font-semibold tracking-[0.18em] ${
                              isActive(item.href)
                                 ? 'text-[#68B52F]'
                                 : 'text-[#1C2537] hover:text-[#68B52F]'
                           } uppercase`}>
                           {item.label}
                        </Link>
                     ))}
                  </nav>
                  <div className='mt-4 flex gap-2'>
                     <Link
                        href='/login'
                        onClick={() => setOpen(false)}
                        className='flex-1 rounded-full bg-[#F3F5FA] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C2537]'>
                        Login
                     </Link>
                     <Link
                        href='/register'
                        onClick={() => setOpen(false)}
                        className='flex-1 rounded-full bg-[#00A651] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white'>
                        Register
                     </Link>
                  </div>
               </div>
            )}
         </div>
      </header>
   );
}
