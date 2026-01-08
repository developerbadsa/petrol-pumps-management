import type { OwnerDetails, OwnerRow, OwnerStationRow, OwnerStatus, UpdateOwnerInput } from './types';
import type { RegisterOwnerInput } from './register-owner/types';

export type RegisterOwnerResult = { id: string };

export type OwnersRepo = {
  registerOwner(input: RegisterOwnerInput): Promise<RegisterOwnerResult>;
  listUnverified(): Promise<OwnerRow[]>;
  listVerified(): Promise<OwnerRow[]>;
  getOwnerDetails(id: string): Promise<OwnerDetails>;
  listOwnerStations(ownerId: string): Promise<OwnerStationRow[]>;
  approve(id: string): Promise<void>;
  reject(id: string): Promise<void>;
  update(id: string, input: UpdateOwnerInput): Promise<void>;
  addSection(id: string): Promise<void>;
};

type ApiOwnerRow = {
  id: number | string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  profile_image: string | null;

  // IMPORTANT: backend enum appears NOT to accept "VERIFIED"
  // observed: "PENDING" exists; approve should use "APPROVED"
  verification_status: string; // PENDING | APPROVED | REJECTED (likely)
  rejection_reason: string | null;
};

type ApiOwnerDetails = ApiOwnerRow & {
  member_id?: string | number | null;
  membership_id?: string | number | null;
};

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err: any = new Error(data?.message ?? res.statusText ?? 'Request failed');
    err.status = res.status;
    err.errors = data?.errors;
    throw err;
  }

  return data as T;
}

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" rx="18" fill="#F1F3F6"/>
    <circle cx="48" cy="40" r="16" fill="#CBD5E1"/>
    <path d="M20 84c6-16 20-24 28-24s22 8 28 24" fill="#CBD5E1"/>
  </svg>
`);

function origin() {
  return process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? 'https://admin.petroleumstationbd.com';
}

function toAbs(pathOrUrl?: string | null) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin().replace(/\/+$/, '')}${p}`;
}

// Accept common backend variants
function mapStatus(apiStatus: string): OwnerStatus {
  const s = (apiStatus ?? '').toUpperCase();

  // treat APPROVED/VERIFIED as "VERIFIED" in UI
  if (s === 'APPROVED' || s === 'VERIFIED') return 'VERIFIED';

  if (s === 'REJECTED') return 'REJECTED';

  // treat PENDING as UNVERIFIED
  return 'UNVERIFIED';
}

function mapOwner(r: ApiOwnerRow): OwnerRow {
  return {
    id: String(r.id),
    memberId: String(r.id),
    photoUrl: r.profile_image ? toAbs(r.profile_image) : DEFAULT_AVATAR,
    ownerName: r.full_name,
    phone: r.phone_number,
    email: r.email,
    address: r.address ?? '',
    status: mapStatus(r.verification_status),
  };
}

function normalizeOwnerDetails(payload: any): ApiOwnerDetails {
  if (!payload) return {} as ApiOwnerDetails;
  if (payload.station_owner) return payload.station_owner as ApiOwnerDetails;
  if (payload.owner) return payload.owner as ApiOwnerDetails;
  if (payload.data) return payload.data as ApiOwnerDetails;
  return payload as ApiOwnerDetails;
}

function mapOwnerStation(row: any, index: number): OwnerStationRow {
  const id = String(row?.id ?? row?.station_id ?? index);
  const name = row?.station_name ?? row?.name ?? row?.title ?? '—';
  const status = row?.station_status ?? row?.status ?? row?.verification_status ?? row?.approval_status ?? '';
  const division = row?.division?.name ?? row?.division_name ?? row?.division ?? '';
  const district = row?.district?.name ?? row?.district_name ?? row?.district ?? '';
  const upazila = row?.upazila?.name ?? row?.upazila_name ?? row?.upazila ?? '';
  const address = row?.station_address ?? row?.address ?? row?.location ?? '';
  const contactPerson =
    row?.contact_person_name ?? row?.contact_person ?? row?.contact_name ?? row?.owner_name ?? '';
  const phone = row?.contact_person_phone ?? row?.phone_number ?? row?.phone ?? '';
  const stationType =
    row?.station_type?.name ?? row?.station_type ?? row?.station_type_name ?? row?.type ?? '';
  const fuelType = row?.fuel_type?.name ?? row?.fuel_type ?? row?.fuel_type_name ?? '';
  const startDate = row?.commencement_date ?? row?.start_date ?? row?.started_at ?? row?.created_at ?? '';

  return {
    id,
    name,
    status: status ? String(status) : '',
    division: division ? String(division) : '',
    district: district ? String(district) : '',
    upazila: upazila ? String(upazila) : '',
    address: address ? String(address) : '',
    contactPerson: contactPerson ? String(contactPerson) : '',
    phone: phone ? String(phone) : '',
    stationType: stationType ? String(stationType) : '',
    fuelType: fuelType ? String(fuelType) : '',
    startDate: startDate ? String(startDate) : '',
  };
}

function mapOwnerDetails(payload: any): OwnerDetails {
  const data = normalizeOwnerDetails(payload);
  const memberId =
    (data?.member_id ?? data?.membership_id ?? data?.id ?? '')?.toString() || '';

  return {
    id: String(data?.id ?? ''),
    memberId,
    photoUrl: data?.profile_image ? toAbs(data.profile_image) : DEFAULT_AVATAR,
    ownerName: data?.full_name ?? '',
    phone: data?.phone_number ?? '',
    email: data?.email ?? '',
    address: data?.address ?? '',
  };
}

export const ownersRepo: OwnersRepo = {
  async registerOwner(input) {
    const data = await apiJson<any>('/api/station-owners/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    const id = String(data?.id ?? data?.owner?.id ?? data?.station_owner?.id ?? '');
    if (!id) throw new Error('Registration succeeded but id missing');

    return { id };
  },

  async listUnverified() {
    const rows = await apiJson<ApiOwnerRow[]>('/api/station-owners/unverified');
    return rows.map(mapOwner);
  },

  async listVerified() {
    const rows = await apiJson<ApiOwnerRow[]>('/api/station-owners/verified');
    return rows.map(mapOwner);
  },

  async getOwnerDetails(id) {
    const data = await apiJson<any>(`/api/station-owners/${id}`);
    return mapOwnerDetails(data);
  },

  async listOwnerStations(ownerId) {
    const rows = await apiJson<any[]>(`/api/gas-stations`);
    return rows
      .filter(row => String(row?.station_owner_id ?? '') === String(ownerId))
      .map((row, index) => mapOwnerStation(row, index));
  },

  async approve(id) {
    await apiJson(`/api/station-owners/${id}/approve`, {
      method: 'POST',
    });
  },

  async reject(id) {
    await apiJson(`/api/station-owners/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: 'Rejected by admin' }),
    });
  },

  async update(id, input) {
    const payload: any = {};

    if (input.fullName !== undefined) payload.full_name = input.fullName;
    if (input.phoneNumber !== undefined) payload.phone_number = input.phoneNumber;
    if (input.email !== undefined) payload.email = input.email;
    if (input.address !== undefined) payload.address = input.address;

    await apiJson(`/api/station-owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async addSection(_id) {
  },
};
