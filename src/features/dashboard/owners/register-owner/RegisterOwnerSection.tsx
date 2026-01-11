'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {registerOwnerSchema} from './schemas';
import type {RegisterOwnerInput} from './types';
import {useRegisterOwner} from './queries';

const BRAND = '#009970';

export default function RegisterOwnerSection() {
   const router = useRouter();
   const registerM = useRegisterOwner();
   const [toast, setToast] = useState<{
      type: 'ok' | 'err';
      text: string;
   } | null>(null);

   const form = useForm<RegisterOwnerInput>({
      resolver: zodResolver(registerOwnerSchema),
      defaultValues: {
         stationOwnerName: '',
         email: '',
         phone: '',
         password: '',
         confirmPassword: '',
         residentialAddress: '',
         profileImage: null,
      },
   });

   const onSubmit = form.handleSubmit(async values => {
      try {
         await registerM.mutateAsync(values);
         form.reset();
         setToast({type: 'ok', text: 'Owner registered successfully.'});
         setTimeout(() => {
            router.push('/manage-owners/unverified');
         }, 1200);
      } catch (e: any) {
         const msg = e?.message ?? 'Failed to register';

         setToast({type: 'err', text: msg});

         // common Laravel messages
         if (/email/i.test(msg)) form.setError('email', {message: msg});
         else if (/phone/i.test(msg)) form.setError('phone', {message: msg});
         else form.setError('stationOwnerName', {message: msg});
      }
   });

   return (
      <section className='space-y-6'>
         <h2 className='text-center text-[16px] font-semibold text-[#2B3A4A]'>
            Bangladesh petroleum dealer&apos;s Distributor&apos;s Agent&apos;s &amp; Petrol
            Pump Owner&apos;s Association
         </h2>
         <p className='text-center text-[12px] font-medium text-[#6F8093]'>
            Register a New Station Owner
         </p>

         {toast ? (
            <div className='fixed right-6 top-6 z-50 rounded-[10px] border border-black/5 bg-white px-4 py-3 text-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.12)]'>
               <span
                  className={
                     toast.type === 'ok' ? 'text-[#2D8A2D]' : 'text-[#D64242]'
                  }>
                  {toast.text}
               </span>
            </div>
         ) : null}

         <div className='mx-auto w-full max-w-[640px] overflow-hidden rounded-[10px] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.12)]'>
            {/* Header bar */}
            <div className='h-[58px] w-full bg-[var(--brand)] text-white'>
               <div className='grid h-full place-items-center text-[16px] font-semibold'>
                  Register
               </div>
            </div>

            <form
               onSubmit={onSubmit}
               className='px-10 pb-10 pt-8'
               style={{['--brand' as any]: BRAND}}>
               <div className='space-y-4'>
                  <FieldRow
                     label='Station Owner Name'
                     error={form.formState.errors.stationOwnerName?.message}>
                     <input
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]'
                        {...form.register('stationOwnerName')}
                     />
                  </FieldRow>

                  <FieldRow
                     label='E-Mail Address'
                     error={form.formState.errors.email?.message}>
                     <input
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]'
                        {...form.register('email')}
                     />
                  </FieldRow>

                  <FieldRow
                     label='Phone'
                     error={form.formState.errors.phone?.message}>
                     <input
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]'
                        {...form.register('phone')}
                     />
                  </FieldRow>

                  <FieldRow
                     label='Password'
                     error={form.formState.errors.password?.message}>
                     <input
                        type='password'
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]'
                        {...form.register('password')}
                     />
                  </FieldRow>

                  <FieldRow
                     label='Confirm Password'
                     error={form.formState.errors.confirmPassword?.message}>
                     <input
                        type='password'
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]'
                        {...form.register('confirmPassword')}
                     />
                  </FieldRow>

                  <FieldRow
                     label='Residential Address'
                     error={form.formState.errors.residentialAddress?.message}>
                     <input
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]'
                        {...form.register('residentialAddress')}
                     />
                  </FieldRow>

                  <FieldRow
                     label='Profile Image'
                     error={form.formState.errors.profileImage?.message}>
                     <input
                        type='file'
                        accept='image/*'
                        className='h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 py-[6px] text-[12px] text-[#2B3A4A] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-1 file:text-[11px] file:font-semibold file:text-[#2B3A4A] focus:border-[#009970]'
                        {...form.register('profileImage')}
                     />
                  </FieldRow>
               </div>

               <div className='mt-8 flex justify-center'>
                  <button
                     type='submit'
                     disabled={registerM.isPending}
                     className='h-9 rounded-full bg-[#009970] px-12 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95 disabled:opacity-60'>
                     {registerM.isPending ? 'Registering...' : 'Register'}
                  </button>
               </div>

               <div className='mt-6 text-center text-[11px] text-[#6F8093]'>
                  Not registered yet?{' '}
                  <span className='cursor-pointer text-[#009970]'>
                     Register Now →
                  </span>
               </div>
            </form>
         </div>
      </section>
   );
}

function FieldRow({
   label,
   children,
   error,
}: {
   label: string;
   children: React.ReactNode;
   error?: string;
}) {
   return (
      <div className='grid items-center gap-3 md:grid-cols-[190px_1fr]'>
         <div className='text-[11px] font-semibold text-[#2B3A4A] md:text-right'>
            {label}
         </div>

         <div>
            {children}
            {error ? (
               <div className='mt-1 text-[11px] text-red-600'>{error}</div>
            ) : null}
         </div>
      </div>
   );
}
