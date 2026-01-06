'use client';

import {useEffect, useId} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string; // e.g. "max-w-[560px]"
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  maxWidthClassName = 'max-w-[560px]',
}: Props) {
  const titleId = useId();

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

  const node = typeof document !== 'undefined' ? document.body : null;
  if (!node) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={cx(
            'w-full  rounded-[6px] bg-white',
            'shadow-[0_25px_80px_rgba(0,0,0,0.45)] overflow-y-scroll min-h-0 max-h-[calc(100dvh-2rem)]',
            maxWidthClassName
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex h-10 items-center justify-between bg-[#009970] px-4">
            <div
              id={title ? titleId : undefined}
              className="text-[12px] font-semibold text-white"
            >
              {title ?? ''}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-7 w-7 place-items-center rounded-[4px] text-white/95 hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>,
    node
  );
}
