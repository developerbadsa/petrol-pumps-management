'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import MeshCorners from '@/components/ui/MeshCorners';

type Step = 'FORM' | 'DONE';

type FormState = {
  stationOwnerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function onlyDigits(s: string) {
  return s.replace(/\D/g, '');
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v: string) {
  const d = onlyDigits(v);
  return d.length >= 10 && d.length <= 14;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label className="w-full text-left text-[10px] text-[#6F8093] sm:w-[140px] sm:text-right">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function RegisterSection() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('FORM');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    stationOwnerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const canSubmit = useMemo(() => {
    if (pending) return false;
    if (!form.stationOwnerName.trim()) return false;
    if (!isValidEmail(form.email)) return false;
    if (!isValidPhone(form.phone)) return false;
    if (form.password.length < 6) return false;
    if (form.confirmPassword !== form.password) return false;
    if (!form.address.trim()) return false;
    return true;
  }, [form, pending]);

  const onChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({...prev, [key]: e.target.value}));
    };

  const submit = async () => {
    setError(null);

    if (!form.stationOwnerName.trim())
      return setError('Station owner name is required.');
    if (!isValidEmail(form.email))
      return setError('Please enter a valid email address.');
    if (!isValidPhone(form.phone))
      return setError('Please enter a valid phone number.');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.');
    if (form.confirmPassword !== form.password)
      return setError('Confirm password does not match.');
    if (!form.address.trim())
      return setError('Residential address is required.');

    setPending(true);
    try {
      // Map your UI fields to backend required fields
      const payload = {
        full_name: form.stationOwnerName.trim(),
        email: form.email.trim(),
        phone_number: form.phone.trim(),
        password: form.password,
        password_confirmation: form.confirmPassword,
        // backend supports these, optional:
        // username: '',
        // bio: form.address.trim(),
      };

      // Next.js route handler: /api/auth/register -> Laravel /register -> sets HttpOnly token cookie
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        cache: 'no-store',
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const firstFieldError =
          data?.errors && Object.values(data.errors)?.[0]
            ? (Object.values(data.errors)[0] as string[])?.[0]
            : null;

        throw new Error(
          firstFieldError || data?.message || 'Registration failed'
        );
      }

      setStep('DONE');

      // If register sets cookie token, you can go directly to dashboard
      router.replace('/dashboard');
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F4F9F4] py-14">
      <MeshCorners
        className="z-0"
        color="#2D8A2D"
        opacity={0.28}
        width={260}
        height={480}
        strokeWidth={1}
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(45,138,45,0.10),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(45,138,45,0.10),transparent_60%)]" />

      <div className="lpg-container relative z-10">
        <div className="rounded-[18px] bg-white/45 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.10)] backdrop-blur-sm md:p-12">
          <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[10px] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.08)]">
            {/* header (same as screenshot) */}
            <div className="flex h-11 items-center justify-center bg-[#009970]">
              <h3 className="text-[13px] font-semibold text-white">Register</h3>
            </div>

            <div className="px-7 py-9 md:px-10">
              {error && (
                <div
                  className="mb-4 rounded-[10px] border border-red-500/15 bg-red-500/5 px-4 py-3 text-[11px] text-red-700"
                  role="alert"
                  aria-live="polite">
                  {error}
                </div>
              )}

              {step === 'FORM' && (
                <div className="space-y-3.5">
                  <FieldRow label="Station Owner Name">
                    <input
                      value={form.stationOwnerName}
                      onChange={onChange('stationOwnerName')}
                      className={cx(
                        'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                        'focus:border-[#0B8B4B]'
                      )}
                    />
                  </FieldRow>

                  <FieldRow label="E-Mail Address">
                    <input
                      value={form.email}
                      onChange={onChange('email')}
                      inputMode="email"
                      autoComplete="email"
                      className={cx(
                        'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                        'focus:border-[#0B8B4B]'
                      )}
                    />
                  </FieldRow>

                  <FieldRow label="Phone">
                    <input
                      value={form.phone}
                      onChange={onChange('phone')}
                      inputMode="tel"
                      autoComplete="tel"
                      className={cx(
                        'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                        'focus:border-[#0B8B4B]'
                      )}
                    />
                  </FieldRow>

                  <FieldRow label="Password">
                    <input
                      value={form.password}
                      onChange={onChange('password')}
                      type="password"
                      autoComplete="new-password"
                      className={cx(
                        'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                        'focus:border-[#0B8B4B]'
                      )}
                    />
                  </FieldRow>

                  <FieldRow label="Confirm Password">
                    <input
                      value={form.confirmPassword}
                      onChange={onChange('confirmPassword')}
                      type="password"
                      autoComplete="new-password"
                      className={cx(
                        'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                        'focus:border-[#0B8B4B]'
                      )}
                    />
                  </FieldRow>

                  <FieldRow label="Residential Address">
                    <input
                      value={form.address}
                      onChange={onChange('address')}
                      className={cx(
                        'h-8 w-full rounded-[6px] border border-black/10 bg-[#F5F7F9] px-3 text-[11px] text-[#2B3A4A] outline-none sm:h-7 sm:w-[200px]',
                        'focus:border-[#0B8B4B]'
                      )}
                    />
                  </FieldRow>

                  <div className="pt-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!canSubmit}
                      className={cx(
                        'inline-flex h-8 items-center justify-center rounded-full px-6 text-[10px] font-semibold',
                        'bg-[#009970] text-white shadow-sm transition hover:brightness-110 active:brightness-95',
                        'disabled:opacity-60 disabled:hover:brightness-100'
                      )}>
                      {pending ? 'Registering...' : 'Register'}
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-[#6F8093]">
                    Already registered?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-[#009970] hover:underline">
                      Login Now →
                    </Link>
                  </p>
                </div>
              )}

              {step === 'DONE' && (
                <div className="space-y-4 text-center">
                  <div className="mx-auto inline-flex rounded-full bg-[#EAF7EA] px-4 py-2 text-[11px] font-semibold text-[#2D8A2D] ring-1 ring-[#2D8A2D]/15">
                    Registration successful
                  </div>

                  <Link
                    href="/dashboard"
                    className="inline-flex h-8 items-center justify-center rounded-full bg-[#009970] px-6 text-[10px] font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95">
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
