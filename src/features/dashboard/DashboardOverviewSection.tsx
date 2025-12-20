'use client';

import {
   Image as ImageIcon,
   Mail,
   MapPin,
   Phone,
   ShoppingCart,
   Users,
   FileText,
   Newspaper,
   User2,
} from 'lucide-react';
import {useDashboardStats, useMyProfile} from './queries';

export default function DashboardOverviewSection() {
   const statsQ = useDashboardStats();
   const profileQ = useMyProfile();

   if (statsQ.isLoading || profileQ.isLoading) {
      return <div className='text-sm text-slate-600'>Loading...</div>;
   }

   if (statsQ.isError || profileQ.isError) {
      return (
         <div className='text-sm text-red-600'>
            Failed to load dashboard data.
         </div>
      );
   }

   const stats = statsQ.data!;
   const me = profileQ.data!;

   return (
      <section className='min-h-[520px] rounded-2xl bg-white'>
         <div className='space-y-8'>
            {/* Top row */}
            <div className='grid gap-10 lg:grid-cols-[320px_1fr]'>
               {/* Upload card */}
               <div className='rounded-2xl bg-[#F3F6FF] p-6 shadow-[0_18px_38px_rgba(2,6,23,0.12)]'>
                  <div className='grid h-[240px] place-items-center'>
                     <div className='w-[200px] rounded-2xl border-2 border-dashed border-emerald-300/80 bg-white/40 px-6 py-10 text-center'>
                        <div className='mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm'>
                           <ImageIcon className='text-emerald-600' size={20} />
                        </div>

                        <p className='mt-4 text-[11px] font-medium text-slate-600'>
                           Choose images or drag &amp; drop it here.
                        </p>
                        <p className='mt-1 text-[10px] text-slate-500/80'>
                           JPG, PNG up to 2MB
                        </p>
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
                  date='04/08/20'
                  value={stats.totalStations}
                  icon={<ShoppingCart size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#4AD7F3] to-[#19B6D9] py-12'
               />
               <StatTile
                  title='Active Users'
                  date='04/08/20'
                  value={stats.activeUsers}
                  icon={<Users size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#5DEC97] to-[#4ADA95] py-12'
               />
               <StatTile
                  title='Total'
                  date='04/08/20'
                  value={stats.totalOwners}
                  icon={<FileText size={22} className='text-white/90' />}
                  className='bg-gradient-to-r from-[#FCDA8A] to-[#FDBA65] py-12'
               />
               <StatTile
                  title='Total Notices'
                  date='04/08/20'
                  value={stats.totalNotices}
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
            {/* value hidden in screenshot tiles; keep subtle */}
            <div className='text-lg font-semibold text-white/95'>{value}</div>
            <div className='grid h-9 w-9 place-items-center rounded-lg bg-white/15'>
               {icon}
            </div>
         </div>
      </div>
   );
}
