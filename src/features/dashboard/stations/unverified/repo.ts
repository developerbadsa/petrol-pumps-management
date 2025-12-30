import type { StationRow } from './types';

function str(v: any, fallback = '—') {
  const s = String(v ?? '').trim();
  return s || fallback;
}

function pick<T>(...v: Array<T | null | undefined>) {
  for (const x of v) if (x != null && x !== ('' as any)) return x;
  return undefined;
}

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? res.statusText ?? 'Request failed');
  return data;
}

function normalizeList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

function mapUnverifiedStations(apiRows: any[]): StationRow[] {
  return (apiRows ?? []).map((r, idx) => {
    const user = r?.station_owner?.user ?? r?.owner?.user ?? r?.user;

    return {
      id: str(r?.id, ''), // must exist
      sl: idx + 1,

      stationName: str(pick(r?.station_name, r?.stationName, r?.name)),
      ownerName: str(pick(user?.full_name, user?.name, r?.owner_name, r?.contact_person_name)),
      phone: str(pick(user?.phone_number, r?.owner_phone, r?.contact_person_phone)),

      division: str(pick(r?.division?.name, r?.division_name, r?.divisionName)),
      district: str(pick(r?.district?.name, r?.district_name, r?.districtName)),
      upazila: str(pick(r?.upazila?.name, r?.upazila_name, r?.upazilaName)),
    };
  });
}

export async function listUnverifiedStationsRepo(): Promise<StationRow[]> {
  const res = await fetch('/api/stations/unverified', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  const data = await readJsonOrThrow(res);
  const rows = mapUnverifiedStations(normalizeList(data));
  return rows.filter((r) => r.id); // safety
}

export async function verifyStationRepo(id: string) {
  const res = await fetch(`/api/stations/${id}/verify`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  return readJsonOrThrow(res);
}

export async function deleteStationRepo(id: string) {
  const res = await fetch(`/api/stations/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  return readJsonOrThrow(res);
}

export async function getStationDetailsRepo(id: string) {
  const res = await fetch(`/api/stations/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  return readJsonOrThrow(res);
}
