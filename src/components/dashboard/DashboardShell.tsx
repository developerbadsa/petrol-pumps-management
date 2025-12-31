'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardShell({
   children,
}: {
   children: React.ReactNode;
}) {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      setSidebarOpen(false);
   }, [pathname]);

   return (
      <div className='min-h-dvh lg:flex'>
         <Sidebar />
         <Sidebar
            variant='drawer'
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
         />

         <div className='min-w-0 flex-1'>
            <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
            <main className='p-6'>{children}</main>
         </div>
      </div>
   );
}
