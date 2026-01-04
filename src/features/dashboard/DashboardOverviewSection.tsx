'use client';

import React from 'react';
import {
   Mail,
   MapPin,
   Phone,
   ShoppingCart,
   Users,
   FileText,
   Newspaper,
   User2,
} from 'lucide-react';

import {useDashboardStats} from './queries';
import {useAuth} from '@/features/auth/AuthProvider';
import Loader from '@/components/shared/Loader';

export default function DashboardOverviewSection() {
   const statsQ = useDashboardStats();
   const {user, loading: authLoading} = useAuth();

   if (authLoading || statsQ.isLoading) {
      return <Loader label='Loading...' />;
   }

   if (!user) {
      return <div className='text-sm text-red-600'>Not authenticated.</div>;
   }

   if (statsQ.isError) {
      return (
         <div className='text-sm text-red-600'>
            {(statsQ.error as Error)?.message ??
               'Failed to load dashboard data.'}
         </div>
      );
   }

   const stats = statsQ.data!;

   const me = {
      fullName: user.full_name ?? '—',
      email: user.email ?? '—',
      phone: user.phone_number ?? '—',
      address: (user as any)?.address ?? '—',
   };

   const ASSET_ORIGIN =
      process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
      'https://admin.petroleumstationbd.com';

   const avatarSrc = user.avatar_url
      ? new URL(user.avatar_url, ASSET_ORIGIN).toString()
      : null;

   return (
      <section className='min-h-[520px] rounded-2xl bg-white'>
         <div className='space-y-8'>
            {/* Top row */}
            <div className='grid gap-10 lg:grid-cols-[320px_1fr]'>
               <div className='rounded-2xl bg-[#F3F6FF] p-6'>
                  <div className='grid h-[240px] place-items-center'>
                     <div className='h-[200px] w-[200px] overflow-hidden'>
                        {avatarSrc ? (
                           <img
                              src={avatarSrc}
                              alt={me.fullName}
                              className='h-full w-full object-cover'
                              loading='lazy'
                           />
                        ) : (
                           <div className='grid h-full w-full place-items-center text-slate-400'>
                              <User2 size={28} />
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Information */}
               <div className='pt-2'>
                  <HeaderWithLine title='Information' />

                  <div className='mt-6 grid gap-5'>
                     <InfoField
                        label='Full Name'
                        icon={<User2 size={14} />}
                        value={me.fullName}
                     />
                     <InfoField
                        label='Email'
                        icon={<Mail size={14} />}
                        value={me.email}
                     />
                     <InfoField
                        label='Phone'
                        icon={<Phone size={14} />}
                        value={me.phone}
                     />
                     <InfoField
                        label='Address'
                        icon={<MapPin size={14} />}
                        value={me.address}
                     />
                  </div>
               </div>
            </div>

            {/* Stat tiles */}
            <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
               <StatTile
                  title='Total Stations'
                  date=' '
                  value={stats.totalStations}
                  icon={<ShoppingCart size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#4AD7F3] to-[#19B6D9] py-12'
               />
               <StatTile
                  title='Station Owners'
                  date=' '
                  value={stats.totalOwners}
                  icon={<Users size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#5DEC97] to-[#4ADA95] py-12'
               />
               <StatTile
                  title='Unread Messages'
                  date=''
                  value={stats.unreadMessages}
                  icon={<FileText size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#FCDA8A] to-[#FDBA65] py-12'
               />
               <StatTile
                  title='Active Notices'
                  date=''
                  value={stats.activeNotices}
                  icon={<Newspaper size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#FEBB77] to-[#FB6D5E] py-12'
               />
            </div>
         </div>
      </section>
   );
}

function HeaderWithLine({title}: {title: string}) {
   return (
      <div className='flex items-center gap-4'>
         <h3 className='text-sm font-semibold text-slate-600'>{title}</h3>
         <div className='h-px flex-1 bg-slate-200' />
      </div>
   );
}

function InfoField({
   label,
   icon,
   value,
}: {
   label: string;
   icon: React.ReactNode;
   value: string;
}) {
   return (
      <div className='max-w-[520px]'>
         <label className='block text-[11px] font-semibold text-slate-600'>
            {label}
         </label>

         <div className='relative mt-2'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
               {icon}
            </span>

            <input
               value={value}
               readOnly
               className='h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none'
            />
         </div>
      </div>
   );
}

function StatTile({
   title,
   date,
   value,
   icon,
   className,
}: {
   title: string;
   date: string;
   value: number;
   icon: React.ReactNode;
   className: string;
}) {
   return (
      <div
         className={[
            'flex h-[68px] items-center justify-between rounded-xl px-5 shadow-[0_12px_24px_rgba(2,6,23,0.10)]',
            className,
         ].join(' ')}>
         <div>
            <div className='text-sm font-semibold text-white'>{title}</div>
            <div className='mt-0.5 text-[10px] text-white/80'>{date}</div>
         </div>

         <div className='flex items-center gap-3'>
            <div className='text-lg font-semibold text-white/95'>{value}</div>
            <div className='grid h-9 w-9 place-items-center rounded-lg bg-white/15'>
               {icon}
            </div>
         </div>
      </div>
   );
}
