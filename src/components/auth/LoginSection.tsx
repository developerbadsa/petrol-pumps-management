'use client';

import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import MeshCorners from '@/components/ui/MeshCorners';

type Step = 'PHONE' | 'OTP' | 'CREDS' | 'DONE';

type OtpMeta = {
   requestId: string;
   sentAt: number; // ms
};

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

// Mock API (replace later with real OTP endpoints)
async function requestOtpApi(phone: string): Promise<{requestId: string}> {
   await new Promise(r => setTimeout(r, 650));
   return {
      requestId: `req_${phone.replace(/\D/g, '').slice(-6)}_${Date.now()}`,
   };
}

// For testing: accept "1234"
async function verifyOtpApi(args: {
   requestId: string;
   phone: string;
   otp: string;
}): Promise<{ok: true}> {
   await new Promise(r => setTimeout(r, 450));
   if (args.otp !== '1234') throw new Error('Invalid OTP');
   return {ok: true};
}

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
   // keeps it flexible (BD or intl). tighten later if needed.
   return d.length >= 10 && d.length <= 14;
}

export default function LoginSection() {
   const router = useRouter();

   const [step, setStep] = useState<Step>('PHONE');
   const [phone, setPhone] = useState('');
   const [otp, setOtp] = useState('');
   const [meta, setMeta] = useState<OtpMeta | null>(null);

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const [pending, setPending] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const [now, setNow] = useState(() => Date.now());
   useEffect(() => {
      if (step !== 'OTP' || !meta) return;
      const t = setInterval(() => setNow(Date.now()), 500);
      return () => clearInterval(t);
   }, [step, meta]);

   const resendLeft = useMemo(() => {
      if (!meta) return 0;
      const elapsed = Math.floor((now - meta.sentAt) / 1000);
      return Math.max(0, RESEND_SECONDS - elapsed);
   }, [meta, now]);

   const canSendOtp = isValidPhone(phone) && !pending;
   const canVerify =
      otp.length === OTP_LENGTH && Boolean(meta?.requestId) && !pending;

   const canLogin =
      isValidPhone(phone) &&
      email.trim().length > 3 &&
      password.length >= 4 &&
      !pending;

   const submitPhone = async () => {
      setError(null);
      const p = phone.trim();
      if (!isValidPhone(p)) {
         setError('Please enter a valid phone number.');
         return;
      }

      setPending(true);
      try {
         const res = await requestOtpApi(p);
         setMeta({requestId: res.requestId, sentAt: Date.now()});
         setOtp('');
         setStep('OTP');
      } catch {
         setError('Failed to send OTP. Please try again.');
      } finally {
         setPending(false);
      }
   };

   const resendOtp = async () => {
      if (!isValidPhone(phone) || resendLeft > 0) return;
      setError(null);

      setPending(true);
      try {
         const res = await requestOtpApi(phone.trim());
         setMeta({requestId: res.requestId, sentAt: Date.now()});
         setOtp('');
      } catch {
         setError('Failed to resend OTP. Please try again.');
      } finally {
         setPending(false);
      }
   };

   const submitOtp = async () => {
      if (!meta?.requestId) return;

      setError(null);
      if (otp.length !== OTP_LENGTH) {
         setError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
         return;
      }

      setPending(true);
      try {
         await verifyOtpApi({
            requestId: meta.requestId,
            phone: phone.trim(),
            otp,
         });

         // After OTP: ask for email + password (backend login requires them)
         setStep('CREDS');
      } catch {
         setError('OTP did not match. Please try again.');
      } finally {
         setPending(false);
      }
   };

   const submitCreds = async () => {
      setError(null);

      const p = phone.trim();
      const e = email.trim();

      if (!isValidPhone(p)) {
         setError('Please enter a valid phone number.');
         return;
      }
      if (!e) {
         setError('Please enter your email.');
         return;
      }
      if (!password) {
         setError('Please enter your password.');
         return;
      }

      setPending(true);
      try {
         // Your Next.js route handler should proxy to Laravel /login and set HttpOnly cookie
         const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               phone_number: p,
               email: e,
               password,
            }),
         });

         const data = await res.json().catch(() => null);

         if (!res.ok) {
            const firstFieldError =
               data?.errors &&
               Object.values(data.errors)?.[0] &&
               (Object.values(data.errors)[0] as string[])?.[0];

            throw new Error(firstFieldError || data?.message || 'Login failed');
         }

         setStep('DONE');
      } catch (e: any) {
         setError(e?.message ?? 'Login failed. Please try again.');
      } finally {
         setPending(false);
      }
   };

   const goBackToPhone = () => {
      setError(null);
      setOtp('');
      setMeta(null);
      setStep('PHONE');
   };

   const goBackToOtp = () => {
      setError(null);
      setStep('OTP');
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
            {/* glass panel like screenshot */}
            <div className='rounded-[18px] bg-white/45 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.10)] backdrop-blur-sm md:p-12'>
               <div className='mx-auto w-full max-w-[560px] overflow-hidden rounded-[10px] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.08)]'>
                  {/* card header */}
                  <div className='flex h-11 items-center justify-center bg-[#009970]'>
                     <h3 className='text-[13px] font-semibold text-white'>
                        Login
                     </h3>
                  </div>

                  {/* card body */}
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
                           <div className='flex items-center justify-center gap-3'>
                              <label className='text-[10px] text-[#6F8093]'>
                                 Phone
                              </label>
                              <input
                                 value={phone}
                                 onChange={e => setPhone(e.target.value)}
                                 placeholder=''
                                 inputMode='tel'
                                 autoComplete='tel'
                                 className={cx(
                                    'h-7 w-[200px] rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none',
                                    'focus:border-[#0B8B4B]'
                                 )}
                              />
                           </div>

                           <div className='flex items-center justify-center'>
                              <button
                                 type='button'
                                 onClick={submitPhone}
                                 disabled={!canSendOtp}
                                 className={cx(
                                    'inline-flex h-8 items-center justify-center rounded-full px-6 text-[10px] font-semibold',
                                    'bg-[#009970] text-white shadow-sm transition hover:brightness-110 active:brightness-95',
                                    'disabled:opacity-60 disabled:hover:brightness-100'
                                 )}>
                                 {pending ? 'Sending...' : 'Send OTP'}
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

                     {step === 'OTP' && (
                        <div className='space-y-5'>
                           <p className='text-center text-[11px] text-[#6F8093]'>
                              OTP sent to{' '}
                              <span className='font-semibold text-[#133374]'>
                                 {maskPhone(phone)}
                              </span>
                           </p>

                           <div className='flex items-center justify-center gap-3'>
                              <label className='text-[10px] text-[#6F8093]'>
                                 OTP
                              </label>
                              <input
                                 value={otp}
                                 onChange={e =>
                                    setOtp(
                                       onlyDigits(e.target.value).slice(
                                          0,
                                          OTP_LENGTH
                                       )
                                    )
                                 }
                                 inputMode='numeric'
                                 autoComplete='one-time-code'
                                 className={cx(
                                    'h-7 w-[200px] rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] tracking-[0.35em] text-[#2B3A4A] outline-none',
                                    'focus:border-[#0B8B4B]'
                                 )}
                              />
                           </div>

                           <div className='flex items-center justify-center gap-3'>
                              <button
                                 type='button'
                                 onClick={goBackToPhone}
                                 disabled={pending}
                                 className='h-8 rounded-full border border-black/10 bg-white px-5 text-[10px] font-semibold text-[#2B3A4A] shadow-sm disabled:opacity-60'>
                                 Edit Phone
                              </button>

                              <button
                                 type='button'
                                 onClick={submitOtp}
                                 disabled={!canVerify}
                                 className={cx(
                                    'inline-flex h-8 items-center justify-center rounded-full px-6 text-[10px] font-semibold',
                                    'bg-[#009970] text-white shadow-sm transition hover:brightness-110 active:brightness-95',
                                    'disabled:opacity-60 disabled:hover:brightness-100'
                                 )}>
                                 {pending ? 'Verifying...' : 'Verify'}
                              </button>
                           </div>

                           <div className='text-center text-[10px] text-[#6F8093]'>
                              {resendLeft > 0 ? (
                                 <span>Resend OTP in {resendLeft}s</span>
                              ) : (
                                 <button
                                    type='button'
                                    onClick={resendOtp}
                                    disabled={pending}
                                    className='font-semibold text-[#009970] hover:underline disabled:opacity-60'>
                                    Resend OTP
                                 </button>
                              )}
                           </div>

                           <p className='text-center text-[10px] text-[#6F8093]'>
                              Test OTP (dev):{' '}
                              <span className='font-semibold text-[#133374]'>
                                 1234
                              </span>
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
                              <div className='flex items-center justify-center gap-3'>
                                 <label className='text-[10px] text-[#6F8093]'>
                                    Email
                                 </label>
                                 <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    inputMode='email'
                                    autoComplete='email'
                                    className={cx(
                                       'h-7 w-[200px] rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none',
                                       'focus:border-[#0B8B4B]'
                                    )}
                                 />
                              </div>

                              <div className='flex items-center justify-center gap-3'>
                                 <label className='text-[10px] text-[#6F8093]'>
                                    Pass
                                 </label>
                                 <input
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    type='password'
                                    autoComplete='current-password'
                                    className={cx(
                                       'h-7 w-[200px] rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none',
                                       'focus:border-[#0B8B4B]'
                                    )}
                                 />
                              </div>
                           </div>

                           <div className='flex items-center justify-center gap-3'>
                              <button
                                 type='button'
                                 onClick={goBackToOtp}
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
