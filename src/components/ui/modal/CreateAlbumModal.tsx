'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import { require } from './../../../../node_modules/next/dist/compiled/webpack/bundle5';

export default function CreateAlbumModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { title: string; eventDate?: string; cover?: File | null }) => void | Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [cover, setCover] = useState<File | null>(null);

  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setEventDate('');
    setCover(null);
    setErr('');
    setSaving(false);
  }, [open]);

  const submit = async () => {
    setErr('');

    if (!title.trim()) {
      setErr('Title is required');
      return;
    }

    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        eventDate: eventDate || undefined, // yyyy-mm-dd
        cover,
      });
    } catch {
      setErr('Failed to create album');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title="Upload Album" onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
              placeholder="Album title"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">Event date (optional)</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#173A7A]">
              Select Image
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              className="block w-full text-[12px]"
              required
            />
          </div>

          {err && <p className="text-[12px] font-medium text-red-600">{err}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
