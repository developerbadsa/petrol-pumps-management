'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { InboxMessage } from './types';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

type Props = {
  open: boolean;
  message: InboxMessage | null;
  busy?: boolean;
  onClose: () => void;
  onSend: (payload: { messageId: number; text: string }) => void;
};

export default function ReplyModal({ open, message, busy, onClose, onSend }: Props) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!open) return;
    setText('');
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const canSend = useMemo(() => {
    if (!message) return false;
    if (!message.senderEmail) return false;
    return text.trim().length > 0;
  }, [text, message]);

  if (!open || !message) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
      />

      {/* Dialog */}
      <div className="relative mx-auto mt-[10vh] w-[92%] max-w-[720px]">
        <div
          role="dialog"
          aria-modal="true"
          className={cx(
            'overflow-hidden rounded-[18px] border border-black/10 bg-white/90 shadow-[0_18px_55px_rgba(0,0,0,0.14)] backdrop-blur'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#009970] px-5 py-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.avatarUrl}
                alt={message.senderName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/40"
              />
              <div className="leading-tight">
                <div className="text-[13px] font-semibold text-white">{message.senderName}</div>
                <div className="text-[11px] text-white/80">{message.dateLabel}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-[10px] bg-white/15 text-white hover:bg-white/20 active:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="rounded-[12px] border border-black/5 bg-[#F4F7FB] px-4 py-3">
              <div className="text-[11px] font-semibold text-[#133374]">Subject</div>
              <div className="mt-1 text-[11px] text-[#2B3A4A]">{message.subject || '—'}</div>

              <div className="mt-3 text-[11px] font-semibold text-[#133374]">Message</div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#6F8093]">{message.message}</p>

              {(message.senderEmail || message.senderPhone) ? (
                <div className="mt-3 border-t border-black/5 pt-3 text-[11px] text-[#6F8093]">
                  {message.senderEmail ? <div>Email: {message.senderEmail}</div> : null}
                  {message.senderPhone ? <div>Phone: {message.senderPhone}</div> : null}
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <div className="text-[11px] font-semibold text-[#133374]">Your Reply</div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  message.senderEmail ? 'Type your reply...' : 'No sender email available for reply.'
                }
                className={cx(
                  'mt-2 h-[120px] w-full resize-none rounded-[12px] border border-black/10 bg-white px-4 py-3',
                  'text-[12px] text-[#2B3A4A] shadow-sm outline-none',
                  'focus:border-[#0B8B4B]',
                  !message.senderEmail && 'opacity-80'
                )}
                disabled={!message.senderEmail}
              />

              <div className="mt-2 text-[10px] text-[#7B8EA3]">Keep it short and clear.</div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-[10px] border border-black/10 bg-white px-4 text-[12px] font-medium text-[#6F8093] shadow-sm hover:text-[#133374]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!canSend || busy}
                onClick={() => onSend({ messageId: message.id, text: text.trim() })}
                className={cx(
                  'h-9 rounded-[10px] bg-[#009970] px-5 text-[12px] font-medium text-white shadow-sm',
                  'hover:brightness-110 active:brightness-95',
                  'disabled:opacity-60 disabled:hover:brightness-100'
                )}
              >
                {busy ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
