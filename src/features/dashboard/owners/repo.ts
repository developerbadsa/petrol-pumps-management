import type { OwnerRow, OwnerStatus, UpdateOwnerInput } from './types';
import type { RegisterOwnerInput } from './register-owner/types';

export type RegisterOwnerResult = { id: string };

export type OwnersRepo = {
  registerOwner(input: RegisterOwnerInput): Promise<RegisterOwnerResult>;
  listUnverified(): Promise<OwnerRow[]>;
  listVerified(): Promise<OwnerRow[]>;
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
