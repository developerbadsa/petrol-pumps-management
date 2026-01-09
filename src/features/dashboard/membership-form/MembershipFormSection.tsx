import Image from 'next/image';
import Link from 'next/link';
import {FileText, PenLine} from 'lucide-react';

function QuoteBg() {
  return (
    <svg
      width="190"
      height="120"
      viewBox="0 0 190 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[92px] w-[150px] md:h-[110px] md:w-[180px]"
    >
      <path
        d="M80 60C80 26 56 6 22 6V32C38 32 46 42 46 60H22V114H80V60Z"
        fill="#DFF3E8"
      />
      <path
        d="M168 60C168 26 144 6 110 6V32C126 32 134 42 134 60H110V114H168V60Z"
        fill="#DFF3E8"
      />
    </svg>
  );
}

const inputBase =
  'h-10 w-full rounded-[8px] border border-black/10 px-3 text-[12px] text-[#173A7A] outline-none focus:border-black/20';

export default function MembershipFormSection() {
  return (
    <section className="mx-auto max-w-[980px] space-y-10">
      <div className="relative overflow-hidden rounded-[12px] border border-black/10 bg-white px-6 py-10 shadow-[0_14px_30px_rgba(9,30,66,0.12)] sm:px-10">
        <div className="pointer-events-none absolute left-6 top-6 opacity-80 md:left-10 md:top-8">
          <QuoteBg />
        </div>
        <div className="relative text-center">
          <h1 className="text-[18px] font-extrabold leading-[1.35] text-[#0C3364] md:text-[26px]">
            বাংলাদেশ পেট্রোলিয়াম ডিলার্স, ডিস্ট্রিবিউটরস, এজেন্ট এন্ড
            <br />
            পেট্রোল পাম্প ওনার্স এসোসিয়েশন
          </h1>
          <p className="mt-6 text-[20px] font-extrabold text-[#8BC53F] md:mt-8 md:text-[30px]">
            মেম্বারশীপ ফরমটি পূরণ করুন
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 md:mt-8">
            <Link
              href="#online-application"
              className="inline-flex items-center gap-2 rounded-full bg-[#019769] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(1,151,105,0.28)] transition hover:brightness-95 active:scale-[0.99]"
            >
              <PenLine className="h-4 w-4" />
              অনলাইন আবেদন করুন
            </Link>
            <a
              href="/files/membership-form.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-[#0C3364] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(12,51,100,0.22)] transition hover:brightness-95 active:scale-[0.99]"
              target="_blank"
              rel="noreferrer"
            >
              <FileText className="h-4 w-4" />
              আবেদন ফর্ম ডাউনলোড
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 right-6 hidden sm:block">
          <Image
            src="/popup-corner-art.svg"
            alt=""
            width={420}
            height={140}
            className="h-auto w-[220px] opacity-80 md:w-[260px]"
            priority
          />
        </div>
      </div>

      <div
        id="online-application"
        className="rounded-[12px] border border-black/10 bg-white px-6 py-8 shadow-[0_12px_26px_rgba(9,30,66,0.08)]"
      >
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-[16px] font-semibold text-[#133374]">Online Membership Application</h2>
          <p className="text-[12px] text-[#7B8EA3]">
            Fill out the form below to start your membership registration. Our team will review and contact you.
          </p>
        </div>

        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Applicant Name</label>
            <input className={inputBase} placeholder="Full name" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Email</label>
            <input type="email" className={inputBase} placeholder="name@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Phone Number</label>
            <input type="tel" className={inputBase} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Station / Business Name</label>
            <input className={inputBase} placeholder="Business name" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Division</label>
            <input className={inputBase} placeholder="Division" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">District</label>
            <input className={inputBase} placeholder="District" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Upazila / Thana</label>
            <input className={inputBase} placeholder="Upazila / Thana" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Address</label>
            <input className={inputBase} placeholder="Street address" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Notes</label>
            <textarea
              className="min-h-[110px] w-full rounded-[8px] border border-black/10 px-3 py-2 text-[12px] text-[#173A7A] outline-none focus:border-black/20"
              placeholder="Any additional information..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-[6px] bg-[#009970] px-6 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
