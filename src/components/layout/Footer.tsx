'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Logo } from './../ui/Logo';

const usefulLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Committee', href: '/committee' },
  { label: 'Member Stations', href: '/stations' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Notices', href: '/notices' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const services = [
  'Owners Chain Management',
  'LPG Autogas Station Management',
  'LPG Conversion Workshop',
  'Training & Certification',
  'Regulatory Compliance Support',
];

const paymentIcons = [
  '/icons/visa.svg',
  '/icons/mastercard.svg',
  '/icons/bkash.svg',
  '/icons/nagad.svg',
];

export function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-r from-[#00468D] via-[#007D6E] to-[#00A651] text-white  py-22">
      <div className="page-shell lpg-container ">
        {/* top row: 4 columns */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          {/* left: logo + org info */}
          <div className="lg:w-[32%]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
  
                  <Logo/>
                </div>
              </div>
              <div className="text-[11px] font-semibold leading-snug tracking-[0.16em] uppercase">
                Bangladesh LPG Autogas
                <br />
                Station &amp; Conversion Workshop
                <br />
                Owner&apos;s Association
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-white/80">
              We represent LPG autogas stations and conversion workshops across
              Bangladesh, working to ensure safety, compliance and sustainable
              growth of the sector.
            </p>

            <div className="mt-4 space-y-1 text-[12px] text-white/75">
              <div>
                <span className="font-semibold">Address:</span> 2/2 Pallabi,
                Dhaka, Bangladesh
              </div>
              <div>
                <span className="font-semibold">Phone:</span> +880 1XXX-XXXXXX
              </div>
              <div>
                <span className="font-semibold">Email:</span>{' '}
                info@lpgautogasbd.com
              </div>
            </div>
          </div>

          {/* middle: useful links */}
          <div className="lg:w-[22%]">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em]">
              Useful Links
            </h4>
            <ul className="mt-4 space-y-1.5 text-[12px] text-white/80">
              {usefulLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    • {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* middle-right: services */}
          <div className="lg:w-[22%]">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em]">
              Our Services
            </h4>
            <ul className="mt-4 space-y-1.5 text-[12px] text-white/80">
              {services.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* right: newsletter */}
          <div className="lg:w-[24%]">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em]">
              Join Our Newsletter
            </h4>
            <p className="mt-3 text-[12px] text-white/80">
              Join our newsletter to get the latest updates of the association.
            </p>

            <form
              className="mt-4 flex rounded-full bg-white/10 p-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full bg-transparent px-4 text-[12px] text-white placeholder:text-white/55 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00A651] shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3 text-[11px] text-white/75">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                f
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                in
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                yt
              </span>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="mt-8 h-px w-full bg-white/25" />

        {/* bottom row: payment icons + copyright */}
        <div className="mt-5 flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
            {paymentIcons.map((src) => (
              <div
                key={src}
                className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-white/90"
              >
                {/* placeholder small logo box */}
                <Image
                  src={src}
                  alt="payment"
                  width={24}
                  height={14}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-white/75">
            © {new Date().getFullYear()} Bangladesh LPG Autogas Station &amp;
            Conversion Workshop Owner&apos;s Association. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
