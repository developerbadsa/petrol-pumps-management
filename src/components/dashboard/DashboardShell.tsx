import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardShell({
   children,
}: {
   children?: React.ReactNode;
}) {
   return (
      <div className='min-h-dvh bg-white'>
         <div className='mx-auto flex min-h-dvh w-full max-w-[1400px]'>
            <Sidebar />

            <div className='flex min-w-0 flex-1 flex-col'>
               <Topbar />

               <main className='min-w-0 flex-1 px-6 pb-10 pt-6'>
                  <div className='px-6 pb-10 pt-6'>{children}</div>

                  <div className='pt-10 text-center text-xs text-slate-500'>
                     © Copyright Reserved by Bangladesh LPG Autogas Station &
                     Conversion Workshop Owner&apos;s Association
                  </div>
               </main>
            </div>
         </div>
      </div>
   );
}
