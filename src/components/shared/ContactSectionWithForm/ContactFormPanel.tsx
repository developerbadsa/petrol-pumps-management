'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import captchaImage from './img/capcha.png';

type ContactFormPanelProps = {
  mapUrl: string;
};

type FormState = {
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  subject: string;
  message: string;
  captcha?: string; // UI-only for now
};

type ApiErrorShape = {
  message?: string;
  errors?: Record<string, string[]>;
};

const fieldBase =
  'rounded-[12px] border border-[#E1EBF7] bg-white ' +
  'text-[13px] text-[#1E2F4D] placeholder:text-[#9AA6BD] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#16B55B33] ' +
  'shadow-[0_10px_22px_rgba(9,46,94,0.06)]';

function firstLaravelError(err: ApiErrorShape | null | undefined) {
  const errors = err?.errors;
  if (!errors) return null;
  const firstKey = Object.keys(errors)[0];
  const firstMsg = firstKey ? errors[firstKey]?.[0] : null;
  return firstMsg ?? null;
}

function CaptchaRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* left: captcha pill + refresh */}
      <div className="flex flex-1 items-center gap-3">
        <div
          className="
            relative h-[54px] flex-1 overflow-hidden
            rounded-[999px]
            border border-[#E1EBF7]
            bg-white
            shadow-[0_10px_22px_rgba(9,46,94,0.08)]
          "
        >
          <Image src={captchaImage} alt="Captcha" fill className="object-cover" />
        </div>

        <button
          type="button"
          className="
            flex h-[54px] w-[54px] items-center justify-center
            rounded-[12px]
            border border-[#E1EBF7]
            bg-white text-[#1E2F4D]
            shadow-[0_10px_22px_rgba(9,46,94,0.08)]
          "
          onClick={() => {
            // UI-only placeholder. Add real captcha refresh when backend supports it.
          }}
          aria-label="Refresh captcha"
        >
          ⟳
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter Captcha"
        className={`h-[54px] px-4 md:flex-[0.9] ${fieldBase}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function ContactFormPanel({ mapUrl }: ContactFormPanelProps) {
  const [form, setForm] = useState<FormState>({
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    subject: '',
    message: '',
    captcha: '',
  });

  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const canSubmit = useMemo(() => {
    return (
      form.sender_name.trim().length > 0 &&
      form.sender_email.trim().length > 0 &&
      form.sender_phone.trim().length > 0 &&
      form.subject.trim().length > 0 &&
      form.message.trim().length > 0
    );
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setStatus(null);
    setPending(true);

    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          sender_name: form.sender_name.trim(),
          sender_email: form.sender_email.trim(),
          sender_phone: form.sender_phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiErrorShape | null;

      if (!res.ok) {
        const firstErr = firstLaravelError(data);
        throw new Error(firstErr ?? data?.message ?? 'Failed to send message');
      }

      setStatus({ type: 'success', text: 'Message sent successfully.' });
      setForm({
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        subject: '',
        message: '',
        captcha: '',
      });
    } catch (err: any) {
      setStatus({ type: 'error', text: err?.message ?? 'Failed to send message.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* MAP */}
      <div
        className="
          relative h-[288px] w-full overflow-hidden
          rounded-[12px]
          neon-pill
          bg-white
          shadow-[0_18px_32px_rgba(9,46,94,0.18)] border-4
        "
      >
        <iframe
          src={mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* FORM */}
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
            value={form.sender_name}
            onChange={(e) => setForm((p) => ({ ...p, sender_name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Your Email*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
            value={form.sender_email}
            onChange={(e) => setForm((p) => ({ ...p, sender_email: e.target.value }))}
          />
        </div>

        {/* row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Subject*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          />
          <input
            type="tel"
            placeholder="Your Phone*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
            value={form.sender_phone}
            onChange={(e) => setForm((p) => ({ ...p, sender_phone: e.target.value }))}
          />
        </div>

        {/* row 3 */}
        <textarea
          placeholder="Message*"
          required
          className={`
            min-h-[170px] w-full resize-none
            px-4 py-3
            ${fieldBase}
          `}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
        />

        {/* row 4 – captcha UI only */}
        <CaptchaRow
          value={form.captcha ?? ''}
          onChange={(v) => setForm((p) => ({ ...p, captcha: v }))}
        />

        {/* status */}
        {status ? (
          <div
            className={`text-center text-[12px] ${
              status.type === 'success' ? 'text-emerald-700' : 'text-red-600'
            }`}
            aria-live="polite"
          >
            {status.text}
          </div>
        ) : null}

        {/* button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!canSubmit || pending}
            className="
              inline-flex h-10 items-center justify-center
              rounded-full btn-bg
              px-12 text-[12px] font-semibold uppercase tracking-[0.18em]
              text-white
              hover:bg-[#14a153] transition-colors
              disabled:opacity-60 disabled:hover:bg-inherit
            "
          >
            {pending ? 'SENDING...' : 'GET STARTED'}
          </button>
        </div>
      </form>
    </div>
  );
}
