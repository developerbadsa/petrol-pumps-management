'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

const flowerIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 28 28"
    className="h-6 w-6 text-[#F47B20]">
    <path
      fill="currentColor"
      d="M14 2.5c1.7 0 3.1 1.4 3.1 3.1 0 .9-.4 1.8-1 2.4 1.1.1 2.2-.2 3.1-.9 1.4-1.1 3.4-.8 4.5.6 1.1 1.4.8 3.4-.6 4.5-.9.7-2 .9-3.1.8.7.8 1 1.8 1 2.8 0 1.7-1.4 3.1-3.1 3.1-1 0-1.9-.5-2.4-1.2-.2 1.1-.8 2.1-1.7 2.8-1.4 1.1-3.4.8-4.5-.6-1.1-1.4-.8-3.4.6-4.5.9-.7 2-1 3.1-.9-.7-.8-1-1.8-1-2.8 0-1.7 1.4-3.1 3.1-3.1 1 0 1.9.5 2.4 1.2.2-1.1.8-2.1 1.7-2.8.5-.4 1.1-.7 1.7-.8-.8-.5-1.4-1.4-1.4-2.4C10.9 3.9 12.3 2.5 14 2.5z"
    />
  </svg>
);

export default function RegisterSection() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(email.trim()) && Boolean(password) && !pending;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setPending(true);
    try {
      const derivedName = email.split('@')[0] || 'User';

      const payload = {
        full_name: derivedName,
        email: email.trim(),
        password,
        password_confirmation: password,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        cache: 'no-store',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const firstFieldError =
          data?.errors && Object.values(data.errors)?.[0]
            ? (Object.values(data.errors)[0] as string[])?.[0]
            : null;

        throw new Error(
          firstFieldError || data?.message || 'Registration failed'
        );
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-160px)] items-center justify-center overflow-hidden bg-[#4B4542] px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative w-full max-w-[960px]">
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_rgba(0,0,0,0.25)] md:grid-cols-[1fr_1.15fr]">
          <div className="relative min-h-[320px] bg-gradient-to-br from-[#F5D7CB] via-[#F3BFA4] to-[#FF7D3D]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.35),transparent_55%)]" />
          </div>

          <div className="px-6 py-10 md:px-12 md:py-12">
            <div className="flex items-center gap-3">
              {flowerIcon}
              <h2 className="text-[20px] font-semibold uppercase tracking-[0.08em] text-[#3A3A3A]">
                Register
              </h2>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              {error && (
                <div
                  className="rounded-[10px] border border-red-500/15 bg-red-500/5 px-4 py-3 text-[12px] text-red-700"
                  role="alert"
                  aria-live="polite">
                  {error}
                </div>
              )}

              <label className="block text-[12px] font-medium text-[#7A7A7A]">
                Email address <span className="text-[#F47B20]">*</span>
                <input
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className="mt-2 h-10 w-full rounded-full border border-[#E3E3E3] px-4 text-[13px] text-[#3A3A3A] outline-none transition focus:border-[#F47B20]"
                  autoComplete="email"
                />
              </label>

              <label className="block text-[12px] font-medium text-[#7A7A7A]">
                Password <span className="text-[#F47B20]">*</span>
                <input
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  type="password"
                  className="mt-2 h-10 w-full rounded-full border border-[#E3E3E3] px-4 text-[13px] text-[#3A3A3A] outline-none transition focus:border-[#F47B20]"
                  autoComplete="new-password"
                />
              </label>

              <div className="flex items-center gap-3 rounded-[14px] border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2">
                <input
                  type="checkbox"
                  aria-label="I am not a robot"
                  className="h-4 w-4 rounded border-[#CFCFCF] text-[#F47B20]"
                />
                <div className="text-[11px] text-[#6B6B6B]">
                  I&apos;m not a robot
                  <p className="text-[9px] text-[#B0B0B0]">reCAPTCHA</p>
                </div>
                <div className="ml-auto h-8 w-8 rounded bg-white shadow-inner" />
              </div>

              <p className="text-[11px] leading-relaxed text-[#8E8E8E]">
                Your personal data will be used to support your experience throughout this
                website, to manage access to your account, and for other purposes described
                in our privacy policy.
              </p>

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-[#F47B20] px-8 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
                {pending ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
