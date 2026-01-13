import { normalizeList } from '@/lib/http/normalize';
import { toAbsoluteUrl } from '@/lib/http/url';
import type { StationDocumentInput, StationDocumentRow } from './types';

type StationDocumentApiRow = {
  id: number | string;
  gas_station_id?: number | string | null;
  document_type?: string | null;
  file_url?: string | null;
  file_path?: string | null;
  url?: string | null;
  file?: string | null;
};

const BASE = '/api/station-documents';

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function mapRow(row: StationDocumentApiRow, idx: number): StationDocumentRow | null {
  const idNum = Number(row.id);
  if (!Number.isFinite(idNum)) return null;

  const stationIdNum = row.gas_station_id != null ? Number(row.gas_station_id) : undefined;
  const documentType =
    (row.document_type ?? '').toString().trim() || `Document #${idNum}`;

  const origin = process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';
  const rel = (row.file_url ?? row.file_path ?? row.url ?? row.file ?? '').toString().trim();
  const fileUrl = rel ? toAbsoluteUrl(origin, rel) : null;

  return {
    id: String(idNum),
    sl: idx + 1,
    stationId: Number.isFinite(stationIdNum) ? stationIdNum : undefined,
    documentType,
    fileUrl,
  };
}

function buildFormData(input: StationDocumentInput) {
  const fd = new FormData();
  fd.set('gas_station_id', String(input.gasStationId));
  fd.set('document_type', input.documentType.trim());
  if (input.file) {
    fd.set('file', input.file);
  }
  return fd;
}

export const stationDocumentsRepo = {
  async list() {
    const res = await fetch(BASE, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    const raw = await safeJson(res);
    if (!res.ok) throw new Error(raw?.message ?? 'Failed to load station documents');

    const rows = normalizeList<StationDocumentApiRow>(raw);
    return rows.map(mapRow).filter(Boolean) as StationDocumentRow[];
  },

  async create(input: StationDocumentInput) {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: buildFormData(input),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to create station document');
  },

  async update(id: string, patch: StationDocumentInput) {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) throw new Error('Invalid station document id');

    const res = await fetch(`${BASE}/${idNum}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: buildFormData(patch),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to update station document');
  },

  async remove(id: string) {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) throw new Error('Invalid station document id');

    const res = await fetch(`${BASE}/${idNum}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message ?? 'Failed to delete station document');
  },
};
