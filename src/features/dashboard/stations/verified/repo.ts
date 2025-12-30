import type { VerifiedStationRow } from './types';
import { mapVerifiedStations } from './map';

export type GasStationUpsertInput = {
  station_owner_id: number;
  station_name: string;
  fuel_type?: string | null;
  station_type?: string | null;
  station_status?: string | null;
  division_id: number;
  district_id: number;
  upazila_id: number;
  station_address: string;
  commencement_date?: string | null;
  contact_person_name?: string | null;
  contact_person_phone?: string | null;
  other_businesses?: number[] | null;
};

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? res.statusText ?? 'Request failed');
  }
  return data;
}

export async function getStationDetailsRepo(id: string) {
  const res = await fetch(`/api/stations/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  return readJsonOrThrow(res);
}

export async function listVerifiedStationsRepo(): Promise<VerifiedStationRow[]> {
  const res = await fetch('/api/stations/verified', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  const data = await readJsonOrThrow(res);
  // data can be array or {data: []} depending on backend/proxy
  const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : data?.data?.data ?? [];
  return mapVerifiedStations(rows);
}

export async function createStationRepo(payload: GasStationUpsertInput) {
  const res = await fetch('/api/stations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return readJsonOrThrow(res);
}

export async function updateStationRepo(id: string, payload: Partial<GasStationUpsertInput>) {
  const res = await fetch(`/api/stations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
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
