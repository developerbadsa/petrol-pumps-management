'use client';

import Image from 'next/image';
import captchaImage from './img/capcha.png';

type ContactFormPanelProps = {
  mapUrl: string;
};

const fieldBase =
  'rounded-[12px] border border-[#E1EBF7] bg-white ' +
  'text-[13px] text-[#1E2F4D] placeholder:text-[#9AA6BD] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#16B55B33] ' +
  'shadow-[0_10px_22px_rgba(9,46,94,0.06)]';

function CaptchaRow() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* left: captcha pill + refresh */}
      <div className="flex flex-1 items-center gap-3">
        {/* captcha pill */}
        <div
          className="
            relative h-[54px] flex-1 overflow-hidden
            rounded-[999px]
            border border-[#E1EBF7]
            bg-white
            shadow-[0_10px_22px_rgba(9,46,94,0.08)]
          "
        >
          <Image
            src={captchaImage}
            alt="Captcha"
            fill
            className="object-cover"
          />
        </div>

        {/* refresh button */}
        <button
          type="button"
          className="
            flex h-[54px] w-[54px] items-center justify-center
            rounded-[12px]
            border border-[#E1EBF7]
            bg-white text-[#1E2F4D]
            shadow-[0_10px_22px_rgba(9,46,94,0.08)]
          "
        >
          ⟳
        </button>
      </div>

      {/* right: input */}
      <input
        type="text"
        placeholder="Enter Captcha*"
        className={`h-[54px] px-4 md:flex-[0.9] ${fieldBase}`}
        required
      />
    </div>
  );
}

export default function ContactFormPanel({ mapUrl }: ContactFormPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* MAP – bordered & shadowed like figma */}
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
      <form className="space-y-4">
        {/* row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
          />
          <input
            type="email"
            placeholder="Your Email*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
          />
        </div>

        {/* row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Subject"
            className={`h-[80px] px-4 ${fieldBase}`}
          />
          <input
            type="tel"
            placeholder="Your Phone*"
            className={`h-[80px] px-4 ${fieldBase}`}
            required
          />
        </div>

        {/* row 3 – message full width */}
        <textarea
          placeholder="Message"
          className={`
            min-h-[170px] w-full resize-none
            px-4 py-3
            ${fieldBase}
          `}
        />

        {/* row 4 – captcha like figma */}
        <CaptchaRow />

        {/* button row – centered below form */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="
              inline-flex h-10 items-center justify-center
              rounded-full btn-bg
              px-12 text-[12px] font-semibold uppercase tracking-[0.18em]
              text-white
              hover:bg-[#14a153] transition-colors"
          >
            GET STARTED
          </button>
        </div>
      </form>
    </div>
  );
}