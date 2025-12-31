'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useMemo, useState, useCallback} from 'react';
import {ChevronDown} from 'lucide-react';
import {DASH_FOOTER, DASH_NAV, type NavItem} from './nav';
import {Logo} from './../ui/Logo';
import {useAuth} from '@/features/auth/AuthProvider';

const isActive = (pathname: string, href?: string) =>
   href ? pathname === href || pathname.startsWith(href + '/') : false;

type SidebarProps = {
   variant?: 'static' | 'drawer';
   open?: boolean;
   onClose?: () => void;
};

export default function Sidebar({
   variant = 'static',
   open: drawerOpen = false,
   onClose,
}: SidebarProps) {
   const pathname = usePathname();
   const router = useRouter();
   const {logout, loading} = useAuth();

   const defaultOpenKeys = useMemo(() => {
      const keys = new Set<string>();
      for (const item of DASH_NAV) {
         if (item.children?.some(c => isActive(pathname, c.href)))
            keys.add(item.key);
      }
      return keys;
   }, [pathname]);

   const [open, setOpen] = useState<Record<string, boolean>>(() => {
      const o: Record<string, boolean> = {};
      defaultOpenKeys.forEach(k => (o[k] = true));
      return o;
   });

   const toggle = (key: string) => setOpen(s => ({...s, [key]: !s[key]}));

   const onLogout = useCallback(async () => {
      try {
         await logout();
      } finally {
         router.replace('/login');
         router.refresh();
      }
   }, [logout, router]);

   const closeIfDrawer = () => {
      if (variant === 'drawer') onClose?.();
   };

   const renderItem = (item: NavItem) => {
      const Icon = item.icon;

      if (item.action === 'logout') {
         return (
            <button
               key={item.key}
               type='button'
               onClick={onLogout}
               disabled={loading}
               className={[
                  'mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100/70',
                  loading ? 'opacity-60' : '',
               ].join(' ')}>
               <Icon size={16} />
               {item.label}
            </button>
         );
      }

      if (item.children?.length) {
         const expanded = !!open[item.key];
         const groupActive = item.children.some(c => isActive(pathname, c.href));

         return (
            <div key={item.key} className='mt-1'>
               <button
                  type='button'
                  aria-expanded={expanded}
                  onClick={() => toggle(item.key)}
                  className={[
                     'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm',
                     groupActive
                        ? 'bg-green-100 text-slate-900'
                        : 'text-slate-700 hover:bg-slate-100/70',
                  ].join(' ')}>
                  <span className='flex items-center gap-2'>
                     <Icon size={16} />
                     {item.label}
                  </span>
                  <ChevronDown
                     size={16}
                     className={[
                        'transition-transform',
                        expanded ? 'rotate-180' : '',
                     ].join(' ')}
                  />
               </button>

               {expanded && (
                  <div className='mt-1 space-y-1 pl-2'>
                     {item.children.map(c => {
                        const active = isActive(pathname, c.href);
                        return (
                           <Link
                              key={c.href}
                              href={c.href}
                              onClick={closeIfDrawer}
                              className={[
                                 'block rounded-xl px-3 py-2 text-sm',
                                 active
                                    ? 'bg-green-100 text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-100/70',
                              ].join(' ')}>
                              {c.label}
                           </Link>
                        );
                     })}
                  </div>
               )}
            </div>
         );
      }

      const active = isActive(pathname, item.href);
      return (
         <Link
            key={item.key}
            href={item.href ?? '#'}
            onClick={closeIfDrawer}
            className={[
               'mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
               active
                  ? 'bg-green-100 text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100/70',
            ].join(' ')}>
            <Icon size={16} />
            {item.label}
         </Link>
      );
   };

   const sidebarInner = (
      <div className='flex h-full flex-col px-4 py-6'>
         <div className='mb-6 flex items-center justify-center'>
            <div className='relative h-[76px] w-[76px] overflow-hidden rounded-full border border-slate-200 bg-white'>
               <Logo />
            </div>
         </div>

         <nav className='min-h-0 flex-1 overflow-auto pr-1'>{DASH_NAV.map(renderItem)}</nav>

         <div className='mt-4 border-t border-slate-200/60 pt-4'>
            {DASH_FOOTER.map(renderItem)}
         </div>
      </div>
   );

   if (variant === 'drawer') {
      return (
         <div
            className={[
               'fixed inset-0 z-40 lg:hidden',
               drawerOpen ? '' : 'pointer-events-none',
            ].join(' ')}>
            <button
               type='button'
               aria-label='Close sidebar'
               onClick={onClose}
               className={[
                  'absolute inset-0 bg-[#ddd]/30 transition-opacity',
                  drawerOpen ? 'opacity-100' : 'opacity-0',
               ].join(' ')}
            />
            <aside
               className={[
                  'absolute left-0 top-0 h-dvh w-[270px] shrink-0 border-r border-slate-200/60 bg-[#9191910D] backdrop-blur transition-transform',
                  drawerOpen ? 'translate-x-0' : '-translate-x-full',
               ].join(' ')}>
               {sidebarInner}
            </aside>
         </div>
      );
   }

   return (
      <aside className='sticky top-0 hidden h-dvh w-[270px] shrink-0 border-r border-slate-200/60 bg-[#9191910D] backdrop-blur lg:block'>
         {sidebarInner}
      </aside>
   );
}
