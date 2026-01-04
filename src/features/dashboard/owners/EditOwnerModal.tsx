'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import type { OwnerRow } from './types';

export default function EditOwnerModal({
  open,
  owner,
  busy,
  onClose,
  onSave,
}: {
  open: boolean;
  owner: OwnerRow | null;
  busy: boolean;
  onClose: () => void;
  onSave: (input: { fullName: string; phoneNumber: string; email: string; address: string }) => void;
}) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!open || !owner) return;
    setFullName(owner.ownerName ?? '');
    setPhoneNumber(owner.phone ?? '');
    setEmail(owner.email ?? '');
    setAddress(owner.address ?? '');
  }, [open, owner]);

  return (
    <Modal open={open} title="Edit Owner" onClose={onClose} maxWidthClassName="max-w-[640px]">
      <div className="p-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Full name</div>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Phone number</div>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[160px_1fr] items-center">
          <div className="text-[11px] font-semibold text-[#2B3A4A] md:text-right">Address</div>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-black/10 bg-[#F7F9FC] px-3 text-[12px] text-[#2B3A4A] outline-none focus:border-[#009970]"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-9 rounded-[8px] bg-[#F1F3F6] px-6 text-[12px] font-semibold text-[#2B3A4A] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave({ fullName, phoneNumber, email, address })}
            disabled={busy}
            className="h-9 rounded-[8px] bg-[#009970] px-8 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
          >
            {busy ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
