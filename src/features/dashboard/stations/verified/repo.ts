import type { VerifiedStationRow } from './types';
import { mapVerifiedStations } from './map';
import { buildStationFormData, type StationUpsertPayload } from '../formData';

export type GasStationUpsertInput = StationUpsertPayload & {
  station_owner_id: number | string;
  station_name: string;
  division_id: number | string;
  district_id: number | string;
  upazila_id: number | string;
  station_address: string;
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
  const formData = buildStationFormData(payload);
  const res = await fetch('/api/stations', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  return readJsonOrThrow(res);
}

export async function updateStationRepo(id: string, payload: Partial<GasStationUpsertInput>) {
  const formData = buildStationFormData(payload);
  const res = await fetch(`/api/stations/${id}`, {
    method: 'PUT',
    headers: { Accept: 'application/json' },
    body: formData,
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
