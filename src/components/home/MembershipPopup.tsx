'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';

const STORAGE_KEY = 'lpg-membership-popup-date';

const getTodayKey = () => new Date().toLocaleDateString('en-CA');

export default function MembershipPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = getTodayKey();
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown !== today) {
      setOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    const today = getTodayKey();
    localStorage.setItem(STORAGE_KEY, today);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  if (!open) return null;

  const node = typeof document !== 'undefined' ? document.body : null;
  if (!node) return null;

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8'>
      <button
        type='button'
        aria-label='Close popup'
        onClick={handleClose}
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
      />

      <div className='relative w-full max-w-[960px] overflow-hidden rounded-[14px] border border-[#E7EBF7] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.35)]'>
        <button
          type='button'
          onClick={handleClose}
          aria-label='Close'
          className='absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[#E6E8F1] text-[#1B2B7A] hover:bg-[#F4F6FF]'>
          <X size={16} />
        </button>

        <div className='relative flex flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between'>
          <div className='absolute left-6 top-6 hidden text-[86px] font-extrabold leading-none text-[#E6EEF7] sm:block'>
            “
          </div>

          <div className='relative space-y-4 lg:max-w-[62%]'>
            <p className='text-[16px] font-semibold leading-relaxed text-[#1B2B7A] sm:text-[18px]'>
              বাংলাদেশ পেট্রোলিয়াম ডিলারস, ডিস্ট্রিবিউটরস, এজেন্ট এন্ড পেট্রোল পাম্প
              ওনার্স এসোসিয়েশন
            </p>
            <p className='text-[18px] font-bold text-[#3A8D3B] sm:text-[22px]'>
              মেম্বারশীপ ফরমটি পূরণ করুন
            </p>

            <div className='flex flex-wrap items-center gap-3'>
              <Link
                href='/membership-form'
                onClick={handleClose}
                className='inline-flex items-center justify-center rounded-full bg-[#129869] px-6 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(18,152,105,0.35)] transition hover:bg-[#0f815a]'>
                অনলাইনে আবেদন করুন
              </Link>
              <a
                href='/Membership Form.pdf'
                download
                onClick={handleClose}
                className='inline-flex items-center justify-center rounded-full bg-[#1B2B7A] px-6 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(27,43,122,0.35)] transition hover:bg-[#15235f]'>
                ফরম ডাউনলোড করুন
              </a>
            </div>
          </div>

          <div className='hidden h-[140px] w-[180px] rounded-[16px] border border-dashed border-[#C9D3EE] bg-[#F7F9FD] lg:flex' />
        </div>
      </div>
    </div>,
    node
  );
}
