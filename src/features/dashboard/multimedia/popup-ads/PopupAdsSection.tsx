'use client';

import {useEffect, useMemo, useState} from 'react';
import {CloudUpload} from 'lucide-react';

import PopupAdCard from '@/components/ui/media/PopupAdCard';
import Modal from '@/components/ui/modal/Modal';
import {normalizeList} from '@/lib/http/normalize';
import {toAbsoluteUrl} from '@/lib/http/url';

type PopupApiRow = {
  id: number | string;
  title?: string | null;
  description?: string | null;
  start_date?: string | null; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  image?: string | null;
  image_url?: string | null;
  image_path?: string | null;
};

export type PopupAd = {
  id: number;
  image: string;
  title: string;
  description: string;
};

function mapPopupRow(r: PopupApiRow): PopupAd | null {
  const id = Number(r.id);
  if (!Number.isFinite(id)) return null;

  const origin =
    process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';

  const rel = r.image ?? (r as any).image_url ?? (r as any).image_path ?? '';
  const image = toAbsoluteUrl(origin, rel);
  if (!image) return null;

  const title = (r.title ?? '').trim() || `Popup #${id}`;
  const dateRange =
    r.start_date || r.end_date ? `${r.start_date ?? '—'} to ${r.end_date ?? '—'}` : '';

  const description =
    (r.description ?? '').trim() || dateRange || '';

  return {id, image, title, description};
}

function isImageFile(f: File) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
}

export default function PopupAdsSection() {
  const [ads, setAds] = useState<PopupAd[]>([]);
  const [loading, setLoading] = useState(false);

  const [addOpen, setAddOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/popups', {
        method: 'GET',
        cache: 'no-store',
        headers: {Accept: 'application/json'},
      });

      const raw = await res.json().catch(() => null);
      if (!res.ok) return;

      const rows = normalizeList<PopupApiRow>(raw);
      const next = rows.map(mapPopupRow).filter(Boolean) as PopupAd[];
      setAds(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: number) => {
    if (!Number.isFinite(id)) {
      window.alert('Invalid popup id');
      return;
    }

    const ok = window.confirm('Remove this popup?');
    if (!ok) return;

    const snapshot = ads;
    setAds((p) => p.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/popups/${id}`, {
        method: 'DELETE',
        headers: {Accept: 'application/json'},
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setAds(snapshot);
        window.alert(data?.message ?? 'Failed to delete popup');
      }
    } catch {
      setAds(snapshot);
      window.alert('Network error. Please try again.');
    }
  };

  const gridAds = useMemo(() => ads, [ads]);

  return (
    <section>
      {/* header row: title center + button right (like screenshot) */}
      <div className='relative flex items-center justify-center'>
        <h2 className='text-[14px] font-medium text-[#173A7A]'>Pop-Up Ads</h2>

        <button
          type='button'
          className='absolute right-0 inline-flex h-8 items-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'
          onClick={() => setAddOpen(true)}
        >
          <CloudUpload size={14} />
          Add Pop-up
        </button>
      </div>

      {/* grid */}
      <div className='mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {gridAds.map((a) => (
          <PopupAdCard
            key={a.id}
            image={a.image}
            title={a.title}
            description={a.description}
            onEdit={() => console.log('edit', a.id)}
            onDelete={() => onDelete(a.id)}
          />
        ))}
      </div>

      {!loading && ads.length === 0 && (
        <p className='mt-8 text-center text-[12px] text-[#7B8EA3]'>No popups found.</p>
      )}

      <AddPopupModal
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

function AddPopupModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setStartDate('');
    setEndDate('');
    setFile(null);
    setErr('');
    setSaving(false);
  }, [open]);

  const submit = async () => {
    setErr('');

    if (!title.trim()) return setErr('Title is required');
    if (!file) return setErr('Image is required');
    if (!isImageFile(file)) return setErr('Only PNG/JPG/WEBP allowed');

    const fd = new FormData();
    fd.set('title', title.trim());
    fd.set('image', file);
    if (startDate.trim()) fd.set('start_date', startDate.trim());
    if (endDate.trim()) fd.set('end_date', endDate.trim());

    setSaving(true);
    try {
      const res = await fetch('/api/popups', {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: fd,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(data?.message ?? 'Failed to create popup');
        return;
      }

      await onCreated();
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title='Add Pop-up' onClose={onClose} maxWidthClassName='max-w-[520px]'>
      <div className='p-4'>
        <div className='space-y-3'>
          <div>
            <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20'
              placeholder='Popup title'
            />
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div>
              <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>Start date</label>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20'
              />
            </div>
            <div>
              <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>End date</label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20'
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>Image</label>
            <input
              type='file'
              accept='image/png,image/jpeg,image/webp'
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className='block w-full text-[12px]'
            />
          </div>

          {err && <p className='text-[12px] font-medium text-red-600'>{err}</p>}

          <div className='mt-4 flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={saving}
              className='h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={submit}
              disabled={saving}
              className='h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60'
            >
              {saving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
