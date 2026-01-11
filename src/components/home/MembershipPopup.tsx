'use client';

import {useEffect, useRef, useState} from 'react';
import MembershipFormPopup from '@/components/MembershipFormPopup';

const STORAGE_KEY = 'membership_popup_closed_at';
const SHOW_AFTER_MS = 1600;
const COOLDOWN_MS = 3 * 1000;

export default function MembershipPopup() {
   const [open, setOpen] = useState(false);
   const timerRef = useRef<number | null>(null);

   useEffect(() => {
      // only open if cooldown passed
      try {
         const lastClosed = Number(localStorage.getItem(STORAGE_KEY) ?? '0');
         const canShow = !lastClosed || Date.now() - lastClosed > COOLDOWN_MS;

         if (!canShow) return;

         timerRef.current = window.setTimeout(() => {
            setOpen(true);
         }, SHOW_AFTER_MS);
      } catch {
         // if localStorage blocked, just show once normally
         timerRef.current = window.setTimeout(
            () => setOpen(true),
            SHOW_AFTER_MS
         );
      }

      return () => {
         if (timerRef.current) window.clearTimeout(timerRef.current);
      };
   }, []);

   const close = () => {
      setOpen(false);
      try {
         localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {}
   };

   return (
      <MembershipFormPopup
         open={open}
         onClose={close}
         // onOnlineApply={() => {

         //    close();
         //    window.location.href = '/membership-form';
         // }}
         onDownload={() => {
            close();
            window.open('/files/membership-form.pdf', '_blank');
         }}
      />
   );
}
