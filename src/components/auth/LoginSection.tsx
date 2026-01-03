'use client';

import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import MeshCorners from '@/components/ui/MeshCorners';
import {useAuth} from '@/features/auth/AuthProvider';

type Step = 'PHONE' | 'CREDS' | 'DONE';

function cx(...v: Array<string | false | null | undefined>) {
   return v.filter(Boolean).join(' ');
}

function onlyDigits(s: string) {
   return s.replace(/\D/g, '');
}

function maskPhone(p: string) {
   const d = onlyDigits(p);
   if (d.length <= 4) return d;
   return `${d.slice(0, 3)}******${d.slice(-2)}`;
}

function isValidPhone(p: string) {
   const d = onlyDigits(p);
   return d.length >= 10 && d.length <= 14;
}

/*
   OTP is temporarily disabled.
   Keep these here if you want to re-enable later:

   const OTP_LENGTH = 4;
   const RESEND_SECONDS = 30;

   async function requestOtpApi(phone: string): Promise<{requestId: string}> { ... }
   async function verifyOtpApi(args: { requestId: string; phone: string; otp: string; }): Promise<{ok: true}> { ... }
*/

export default function LoginSection() {
   const router = useRouter();

   const [step, setStep] = useState<Step>('PHONE');
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');

   const [pending, setPending] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const {refresh} = useAuth();

   const canContinue = isValidPhone(phone) && !pending;
   const canLogin = isValidPhone(phone) && password.length >= 4 && !pending;

   const submitPhone = async () => {
      setError(null);
      const p = phone.trim();
      if (!isValidPhone(p)) {
         setError('Please enter a valid phone number.');
         return;
      }

      // OTP disabled: directly go to password step
      setStep('CREDS');
   };

   const submitCreds = async () => {
      setError(null);

      const p = phone.trim();

      if (!isValidPhone(p)) {
         setError('Please enter a valid phone number.');
         return;
      }
      if (!password) {
         setError('Please enter your password.');
         return;
      }

      setPending(true);
      try {
         const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               phone_number: p,
               password,
            }),
            credentials: 'include',
         });

         const data = await res.json().catch(() => null);

         if (!res.ok) {
            const firstFieldError =
               data?.errors &&
               Object.values(data.errors)?.[0] &&
               (Object.values(data.errors)[0] as string[])?.[0];

            throw new Error(firstFieldError || data?.message || 'Login failed');
         }

         await refresh();
         router.refresh();
         setStep('DONE');
      } catch (e: any) {
         setError(e?.message ?? 'Login failed. Please try again.');
      } finally {
         setPending(false);
      }
   };

   const goBackToPhone = () => {
      setError(null);
      setPassword('');
      setStep('PHONE');
   };

   return (
      <section className='relative overflow-hidden bg-[#F4F9F4] py-14'>
         <div className='bg-red-400'>
            <MeshCorners
               className='z-0'
               color='#2D8A2D'
               opacity={0.28}
               width={260}
               height={480}
               strokeWidth={1}
            />
         </div>

         <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]' />

         <div className='lpg-container relative z-10'>
            <div className='rounded-[18px] bg-white/45 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.10)] backdrop-blur-sm md:p-12'>
               <div className='mx-auto w-full max-w-[560px] overflow-hidden rounded-[10px] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.08)]'>
                  <div className='flex h-11 items-center justify-center bg-[#009970]'>
                     <h3 className='text-[13px] font-semibold text-white'>
                        Login
                     </h3>
                  </div>

                  <div className='px-7 py-9 md:px-10'>
                     {error && (
                        <div
                           className='mb-4 rounded-[10px] border border-red-500/15 bg-red-500/5 px-4 py-3 text-[11px] text-red-700'
                           role='alert'
                           aria-live='polite'>
                           {error}
                        </div>
                     )}

                     {step === 'PHONE' && (
                        <div className='space-y-5'>
                           <div className='flex flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:gap-3'>
                              <label className='w-full text-left text-[10px] text-[#6F8093] sm:w-auto sm:text-right'>
                                 Phone
                              </label>
                              <input
                                 value={phone}
                                 onChange={e => setPhone(e.target.value)}
                                 placeholder=''
                                 inputMode='tel'
                                 autoComplete='tel'
                                 className={cx(
                                    'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                                    'focus:border-[#0B8B4B]'
                                 )}
                              />
                           </div>

                           <div className='flex items-center justify-center'>
                              <button
                                 type='button'
                                 onClick={submitPhone}
                                 disabled={!canContinue}
                                 className={cx(
                                    'inline-flex h-8 items-center justify-center rounded-full px-6 text-[10px] font-semibold',
                                    'bg-[#009970] text-white shadow-sm transition hover:brightness-110 active:brightness-95',
                                    'disabled:opacity-60 disabled:hover:brightness-100'
                                 )}>
                                 Continue
                              </button>
                           </div>

                           <p className='text-center text-[10px] text-[#6F8093]'>
                              Not registered yet?{' '}
                              <Link
                                 href='/register'
                                 className='font-semibold text-[#009970] hover:underline'>
                                 Register Now →
                              </Link>
                           </p>
                        </div>
                     )}

                     {step === 'CREDS' && (
                        <div className='space-y-5'>
                           <p className='text-center text-[11px] text-[#6F8093]'>
                              Continue login for{' '}
                              <span className='font-semibold text-[#133374]'>
                                 {maskPhone(phone)}
                              </span>
                           </p>

                           <div className='space-y-3'>
                              <div className='flex flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:gap-3'>
                                 <label className='w-full text-left text-[10px] text-[#6F8093] sm:w-auto sm:text-right'>
                                    Pass
                                 </label>
                                 <input
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    type='password'
                                    autoComplete='current-password'
                                    className={cx(
                                       'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                                       'focus:border-[#0B8B4B]'
                                    )}
                                 />
                              </div>
                           </div>

                           <div className='flex items-center justify-center gap-3'>
                              <button
                                 type='button'
                                 onClick={goBackToPhone}
                                 disabled={pending}
                                 className='h-8 rounded-full border border-black/10 bg-white px-5 text-[10px] font-semibold text-[#2B3A4A] shadow-sm disabled:opacity-60'>
                                 Back
                              </button>

                              <button
                                 type='button'
                                 onClick={submitCreds}
                                 disabled={!canLogin}
                                 className={cx(
                                    'inline-flex h-8 items-center justify-center rounded-full px-6 text-[10px] font-semibold',
                                    'bg-[#009970] text-white shadow-sm transition hover:brightness-110 active:brightness-95',
                                    'disabled:opacity-60 disabled:hover:brightness-100'
                                 )}>
                                 {pending ? 'Logging in...' : 'Login'}
                              </button>
                           </div>
                        </div>
                     )}

                     {step === 'DONE' && (
                        <div className='space-y-4 text-center'>
                           <div className='mx-auto inline-flex rounded-full bg-[#EAF7EA] px-4 py-2 text-[11px] font-semibold text-[#2D8A2D] ring-1 ring-[#2D8A2D]/15'>
                              Login successful
                           </div>

                           <div className='flex items-center justify-center gap-3'>
                              <button
                                 type='button'
                                 onClick={() => router.push('/dashboard')}
                                 className='inline-flex h-8 items-center justify-center rounded-full bg-[#009970] px-6 text-[10px] font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95'>
                                 Go to Dashboard
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
