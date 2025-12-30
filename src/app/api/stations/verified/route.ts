import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/http/laravelFetch';
import { normalizeList } from '@/lib/http/normalize';

function hasVerificationSignal(r: any) {
  return (
    r?.verification_status != null ||
    r?.verificationStatus != null ||
    r?.is_verified != null ||
    r?.verified != null ||
    r?.status != null
  );
}

function isVerified(r: any) {
  if (typeof r?.is_verified === 'boolean') return r.is_verified;
  if (typeof r?.verified === 'boolean') return r.verified;

  const s = String(r?.verification_status ?? r?.verificationStatus ?? r?.status ?? '')
    .trim()
    .toLowerCase();

  if (!s) return false;

  // allow common “approved” style values
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

  const shouldFilter = list.some(hasVerificationSignal);
  const filtered = shouldFilter ? list.filter(isVerified) : list;

  return NextResponse.json(filtered);
}
