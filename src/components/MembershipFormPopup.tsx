'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FileText, PenLine, X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onOnlineApply?: () => void;
  onDownload?: () => void;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

function QuoteBg() {
  // big soft-green quote marks (left side) like screenshot
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

export default function MembershipFormPopup({
  open,
  onClose,
  onOnlineApply,
  onDownload,
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mouseDownOnBackdrop = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-[2px] px-3"
      onMouseDown={(e) => {
        // only close when user clicks backdrop (not dragging from inside panel)
        mouseDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onMouseUp={() => {
        if (mouseDownOnBackdrop.current) onClose();
        mouseDownOnBackdrop.current = false;
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={panelRef}
        className={cx(
          'relative w-[92vw] max-w-[980px]',
          'rounded-[10px] bg-white',
          'shadow-[0_18px_60px_rgba(0,0,0,0.35)]',
          'border border-black/10'
        )}
      >
        {/* Close button (top-right red circle like screenshot) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
          className={cx(
            'absolute right-4 top-4 z-20',
            'grid h-6 w-6 place-items-center rounded-full',
            'border border-red-500 text-red-500',
            'bg-white hover:bg-red-50'
          )}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Quote background (left-top) */}
        <div className="pointer-events-none absolute left-6 top-6 opacity-80 md:left-10 md:top-8">
          <QuoteBg />
        </div>

        <div className="relative px-5 py-10 md:px-14 md:py-12">
          <div className="mx-auto max-w-[860px] text-center">
            <h2 className="text-[#0C3364] text-[18px] font-extrabold leading-[1.35] md:text-[26px]">
              বাংলাদেশ পেট্রোলিয়াম ডিলার্স, ডিস্ট্রিবিউটরস, এজেন্ট এন্ড
              <br />
              পেট্রোল পাম্প ওনার্স এসোসিয়েশন
            </h2>

            <p className="mt-8 text-[#8BC53F] text-[22px] font-extrabold md:mt-9 md:text-[34px]">
              মেম্বারশীপ ফরমটি পূরণ করুন
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 md:mt-8">
              <button
                type="button"
                onClick={onOnlineApply}
                className={cx(
                  'inline-flex items-center gap-2',
                  'rounded-full bg-[#019769] px-6 py-3',
                  'text-white font-semibold text-[14px]',
                  'shadow-[0_10px_22px_rgba(1,151,105,0.28)]',
                  'hover:brightness-95 active:scale-[0.99]',
                  'transition'
                )}
              >
                <PenLine className="h-4 w-4" />
                অনলাইন আবেদন করুন
              </button>

              <button
                type="button"
                onClick={onDownload}
                className={cx(
                  'inline-flex items-center gap-2',
                  'rounded-full bg-[#0C3364] px-6 py-3',
                  'text-white font-semibold text-[14px]',
                  'shadow-[0_10px_22px_rgba(12,51,100,0.22)]',
                  'hover:brightness-95 active:scale-[0.99]',
                  'transition'
                )}
              >
                <FileText className="h-4 w-4" />
                আবেদন ফর্ম ডাউনলোড
              </button>
            </div>
          </div>

          {/* Right-bottom illustration (your SVG) */}
          <div className="pointer-events-none absolute bottom-6 right-10 hidden sm:block md:bottom-7 md:right-12">
            <Image
              src="/popup-corner-art.svg"
              alt=""
              width={420}
              height={140}
              className="h-auto w-[260px] opacity-80 md:w-[310px]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
