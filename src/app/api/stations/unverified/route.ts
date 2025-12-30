import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/http/laravelFetch';
import { normalizeList } from '@/lib/http/normalize';

function getVerifySignal(r: any) {
  // station-level
  const s1 =
    r?.verification_status ??
    r?.verificationStatus ??
    r?.status ??
    (typeof r?.is_verified === 'boolean' ? (r.is_verified ? 'verified' : 'unverified') : undefined) ??
    (typeof r?.verified === 'boolean' ? (r.verified ? 'verified' : 'unverified') : undefined);

  // owner-level (common)
  const so = r?.station_owner ?? r?.owner;
  const s2 =
    so?.verification_status ??
    so?.verificationStatus ??
    so?.status ??
    (typeof so?.is_verified === 'boolean' ? (so.is_verified ? 'verified' : 'unverified') : undefined);

  return s1 ?? s2 ?? '';
}

function isVerified(r: any) {
  const s = String(getVerifySignal(r)).trim().toLowerCase();
  if (!s) return false;

  if (['verified', 'approved', 'active'].includes(s)) return true;
  if (['unverified', 'pending', 'rejected', 'inactive'].includes(s)) return false;

  return false;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.searchParams.toString();
  const path = qs ? `/gas-stations?${qs}` : '/gas-stations';

  const raw = await laravelFetch<any>(path, { method: 'GET', auth: true });
  const list = normalizeList<any>(raw);

  // If backend doesn't return any verification fields, we do not filter (avoid empty UI)
  const hasSignal = list.some((r) => String(getVerifySignal(r)).trim().length > 0);
  const filtered = hasSignal ? list.filter((r) => !isVerified(r)) : list;

  return NextResponse.json(filtered);
}
