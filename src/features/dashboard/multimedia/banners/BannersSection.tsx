'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BannerItem } from './types';
import { MOCK_BANNERS } from './mockBanners';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

const EDIT_GRADIENT =
  'bg-[linear-gradient(90deg,#47D5F2_0%,#1DB8DB_100%)]';
const DELETE_GRADIENT =
  'bg-[linear-gradient(90deg,#FEB675_0%,#FC7160_100%)]';

function uid(prefix = 'b') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function isImageFile(f: File) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
}

export default function BannersSection() {
  const [items, setItems] = useState<BannerItem[]>(MOCK_BANNERS);

  // Track object URLs so we can revoke them (avoid memory leak).
  const objectUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  const onDelete = (id: string) => {
    const ok = window.confirm('Remove this banner?');
    if (!ok) return;

    setItems((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.imageSrc?.startsWith('blob:')) {
        URL.revokeObjectURL(target.imageSrc);
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (u) => u !== target.imageSrc
        );
      }
      return prev.filter((x) => x.id !== id);
    });
  };

  const onEdit = (id: string) => {
    // Hook your modal/drawer here (later backend integration)
    console.log('Edit banner:', id);
  };

  const addFiles = (files: File[]) => {
    const valid = files.filter(isImageFile);
    if (!valid.length) return;

    setItems((prev) => {
      const next = [...prev];

      for (const file of valid) {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);

        next.push({
          id: uid('banner'),
          imageSrc: url,
        });
      }

      return next;
    });
  };

  return (
    <section className="px-6 py-6">
      <h2 className="text-center text-[18px] font-semibold text-[#133374]">
        Banners
      </h2>

      <div className="mx-auto mt-6 max-w-[1280px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {items.map((b) => (
            <BannerCard
              key={b.id}
              item={b}
              onEdit={() => onEdit(b.id)}
              onDelete={() => onDelete(b.id)}
            />
          ))}

          <UploadCard onFiles={addFiles} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cx(
        'rounded-[22px] bg-linear-to-b from-[#FFFFFF] to-[#EEF0FB] p-2',
        'shadow-[0_22px_55px_rgba(0,0,0,0.1)]'
      )}
    >
      {children}
    </div>
  );
}

function BannerCard({
  item,
  onEdit,
  onDelete,
}: {
  item: BannerItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <CardShell>
      <div className="rounded-[18px]  p-2 ">
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[16px] bg-white">
          <Image
            src={item.imageSrc}
            alt="Banner"
            fill
            className="object-contain p-6"
            sizes="(max-width: 1280px) 33vw, 420px"
            priority={false}
          />
        </div>

        <div className="mt-5 flex items-end justify-end gap-4">
          <button
            type="button"
            onClick={onEdit}
            className={cx(
              'h-[38px] w-[110px] rounded-[10px] text-[16px] font-semibold text-white',
              'shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition active:scale-[0.99]',
              EDIT_GRADIENT
            )}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className={cx(
              'h-[38px] w-[110px]  rounded-[10px] text-[16px] font-semibold text-white',
              'shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition active:scale-[0.99]',
              DELETE_GRADIENT
            )}
          >
            Delete
          </button>
        </div>
      </div>
    </CardShell>
  );
}

function UploadCard({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onFiles(files);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    onFiles(files);
  };

  const dashedClass = useMemo(
    () =>
      cx(
        'rounded-[16px] border-2 border-dashed',
        drag ? 'border-[#0B8B4B] bg-[#EAFBF2]' : 'border-[#17B07A]'
      ),
    [drag]
  );

  return (
    <CardShell>
      <div className="rounded-[18px] bg-white/85 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.12)]">
        <div
          className={cx(
            'flex min-h-[360px] flex-col items-center justify-center px-6 text-center',
            dashedClass
          )}
          onDragEnter={() => setDrag(true)}
          onDragLeave={() => setDrag(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openPicker();
          }}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#1B7B3C]/10">
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                fill="none"
                stroke="#1B7B3C"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7 10l5-5 5 5"
                fill="none"
                stroke="#1B7B3C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5v10"
                fill="none"
                stroke="#1B7B3C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="text-[14px] font-medium text-[#1B7B3C]">
            Choose images or drag &amp; drop it here.
          </p>
          <p className="mt-1 text-[11px] text-[#7B8EA3]">
            JPG, JPEG, PNG and WEBP. Max 20 MB.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={handlePick}
        />
      </div>
    </CardShell>
  );
}
