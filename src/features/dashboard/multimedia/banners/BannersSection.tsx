'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { BannerApiRow, BannerItem } from './types';
import { normalizeList } from '@/lib/http/normalize';
import { toAbsoluteUrl } from '@/lib/http/url';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

const EDIT_GRADIENT =
  'bg-[linear-gradient(90deg,#47D5F2_0%,#1DB8DB_100%)]';
const DELETE_GRADIENT =
  'bg-[linear-gradient(90deg,#FEB675_0%,#FC7160_100%)]';

function isImageFile(f: File) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
}

function mapRow(r: BannerApiRow): BannerItem | null {
  const id = Number(r.id);
  if (!Number.isFinite(id)) return null;

  const origin =
    process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

  const rel =
    r.image ?? (r as any).image_url ?? (r as any).image_path ?? '';

  const imageSrc = toAbsoluteUrl(origin, rel);
  if (!imageSrc) return null;

  return {
    id,
    title: r.title ?? undefined,
    type: r.type ?? undefined,
    imageSrc,
  };
}

export default function BannersSection() {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [addOpen, setAddOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners', {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      const raw = await res.json().catch(() => null);
      if (!res.ok) return;

      const rows = normalizeList<BannerApiRow>(raw);
      const next = rows.map(mapRow).filter(Boolean) as BannerItem[];
      setItems(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: number) => {
    const ok = window.confirm('Remove this banner?');
    if (!ok) return;
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) setItems(prev);
    } catch {
      setItems(prev);
    }
  };


  return (
    <section className="px-6 py-6">
      <h2 className="text-center text-[18px] font-semibold text-[#133374]">
        Banners
      </h2>

      {/* minimal UI change: only add button */}
      <div className="mx-auto mt-4 flex max-w-[1280px] justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className={cx(
            'h-[38px] rounded-[10px] px-5 text-[14px] font-semibold text-white',
            'shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition active:scale-[0.99]',
            EDIT_GRADIENT
          )}
        >
          Add New Banner
        </button>
      </div>

      <div className="mx-auto mt-6 max-w-[1280px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {items.map((b) => (
            <BannerCard
              key={b.id}
              item={b}
              onDelete={() => onDelete(b.id)}
            />
          ))}
        </div>

        {!loading && items.length === 0 && (
          <p className="mt-8 text-center text-sm text-[#7B8EA3]">
            No banners found.
          </p>
        )}
      </div>

      <AddBannerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={async () => {
          setAddOpen(false);
          await load();
        }}
      />
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
  onDelete,
}: {
  item: BannerItem;
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
          />
        </div>

        <div className="mt-5 flex items-end justify-end gap-4">


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

/* ------------------------------------------------------------------ */
/* Add Banner Modal (minimal, no design system dependency)             */
/* ------------------------------------------------------------------ */

function AddBannerModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('home_slider');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setType('home_slider');
    setFile(null);
    setErr('');
    setSaving(false);
  }, [open]);

  const submit = async () => {
    setErr('');

    if (!title.trim()) return setErr('Title is required');
    if (!type.trim()) return setErr('Type is required');
    if (!file) return setErr('Image is required');
    if (!isImageFile(file)) return setErr('Only PNG/JPG/WEBP allowed');

    const fd = new FormData();
    fd.set('title', title.trim());
    fd.set('type', type.trim());
    fd.set('image', file);

    setSaving(true);
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(data?.message ?? 'Failed to create banner');
        return;
      }

      await onCreated();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[520px] rounded-[16px] bg-white p-5 shadow-[0_22px_55px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#133374]">Add New Banner</h3>
          <button type="button" onClick={onClose} className="text-sm text-[#7B8EA3]">
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-[12px] text-[#7B8EA3]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full rounded-md border px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] text-[#7B8EA3]">Type</label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full rounded-md border px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] text-[#7B8EA3]">Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
          </div>

          {err && <p className="text-[12px] text-red-600">{err}</p>}

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-md border px-4 text-sm">
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className={cx('h-10 rounded-md px-4 text-sm font-semibold text-white', EDIT_GRADIENT, saving && 'opacity-70')}
            >
              {saving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
