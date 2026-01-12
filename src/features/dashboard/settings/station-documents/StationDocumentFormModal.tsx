'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/ui/modal/Modal';
import type { StationDocumentInput, StationDocumentRow } from './types';

type StationOption = {
  id: string;
  label: string;
};

function str(value: any, fallback = '') {
  const s = String(value ?? '').trim();
  return s || fallback;
}

function pick<T>(...values: Array<T | null | undefined>) {
  for (const value of values) {
    if (value != null && value !== ('' as any)) return value;
  }
  return undefined;
}

function toId(value: any) {
  const v = String(value ?? '').trim();
  return v || '';
}

function normalizeList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

async function listStationOptions(): Promise<StationOption[]> {
  const res = await fetch('/api/stations/unverified', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  const raw = await res.json().catch(() => null);
  if (!res.ok) throw new Error(raw?.message ?? 'Failed to load stations');

  const rows = normalizeList(raw);

  return rows
    .map((row: any) => {
      const id = toId(row?.id);
      if (!id) return null;
      const name = str(
        pick(row?.station_name, row?.stationName, row?.name),
        `Station #${id}`,
      );
      return { id, label: `${name} (ID: ${id})` };
    })
    .filter(Boolean) as StationOption[];
}

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: StationDocumentRow | null;
  saving?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: StationDocumentInput) => void | Promise<void>;
};

export default function StationDocumentFormModal({
  open,
  mode,
  initial,
  saving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [stationId, setStationId] = useState(initial?.stationId?.toString() ?? '');
  const [stationSearch, setStationSearch] = useState('');
  const [documentType, setDocumentType] = useState(initial?.documentType ?? '');
  const [file, setFile] = useState<File | null>(null);

  const title = mode === 'create' ? 'Add Station Document' : 'Edit Station Document';

  const stationsQ = useQuery({
    queryKey: ['stations', 'unverified', 'options'],
    queryFn: listStationOptions,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    setStationId(initial?.stationId?.toString() ?? '');
    setStationSearch('');
    setDocumentType(initial?.documentType ?? '');
    setFile(null);
  }, [open, initial]);

  const stationOptions = stationsQ.data ?? [];
  const loadingStations = stationsQ.isLoading;

  return (
    <Modal open={open} title={title} onClose={onClose} maxWidthClassName="max-w-[520px]">
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();

          const idNum = Number(stationId);
          if (!Number.isFinite(idNum)) return;

          onSubmit({
            gasStationId: idNum,
            documentType: documentType.trim(),
            file,
          });
        }}
      >
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Station Name
          </label>
          <input
            list="station-options"
            value={stationSearch}
            onChange={(e) => {
              const value = e.target.value;
              setStationSearch(value);
              const match = stationOptions.find(
                (option) => option.label === value || option.id === value,
              );
              setStationId(match ? match.id : value);
            }}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder={loadingStations ? 'Loading stations...' : 'Select station name'}
            disabled={stationsQ.isError}
          />
          <datalist id="station-options">
            {stationOptions.map((option) => (
              <option key={option.id} value={option.label} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Gas Station ID
          </label>
          <input
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="e.g. 12"
            inputMode="numeric"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            Document Type
          </label>
          <input
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#E5E7EB] px-3 text-[12px]"
            placeholder="e.g. Trade License"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#2B3A4A]">
            File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-[12px]"
            required={mode === 'create'}
          />
          {mode === 'edit' ? (
            <p className="text-[11px] text-[#64748B]">Leave empty to keep existing file.</p>
          ) : null}
        </div>

        {error ? <div className="text-[12px] text-red-600">{error}</div> : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[6px] border border-[#E5E7EB] px-4 text-[12px] font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
