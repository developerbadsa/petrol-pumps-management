import type { VerifiedStationRow } from './types';
import { laravelOrigin, toAbsoluteUrl } from '@/lib/http/url';

function pick<T>(...v: Array<T | null | undefined>): T | undefined {
  for (const x of v) if (x != null && x !== ('' as any)) return x;
  return undefined;
}

function str(v: any, fallback = '') {
  const s = String(v ?? '').trim();
  return s || fallback;
}

function nameFromOwner(r: any) {
  // Try common shapes
  const user = r?.station_owner?.user ?? r?.owner?.user ?? r?.user;
  const fullName = pick(user?.full_name, user?.name, r?.owner_name, r?.contact_person_name);
  const company = pick(r?.station_owner?.company_name, r?.company_name);
  return { fullName, company };
}

function phoneFromOwner(r: any) {
  const user = r?.station_owner?.user ?? r?.owner?.user ?? r?.user;
  return pick(user?.phone_number, r?.owner_phone, r?.contact_person_phone);
}

function locationName(r: any, key: 'division' | 'district' | 'upazila') {
  const obj = r?.[key];
  return pick(obj?.name, r?.[`${key}_name`], r?.[`${key}Name`]);
}

function docUrlFromStation(r: any) {
  const raw =
    pick(
      r?.doc_url,
      r?.document_url,
      r?.station_document_url,
      r?.station_documents?.[0]?.file_url,
      r?.station_documents?.[0]?.url,
      r?.documents?.[0]?.file_url
    ) ?? null;

  if (!raw) return null;

  try {
    return toAbsoluteUrl(laravelOrigin(), String(raw));
  } catch {
    // if NEXT_PUBLIC_LARAVEL_ORIGIN missing, at least return raw
    return String(raw);
  }
}

export function mapVerifiedStations(apiRows: any[]): VerifiedStationRow[] {
  return (apiRows ?? []).map((r, idx) => {
    const stationName = pick(r?.station_name, r?.stationName, r?.name);

    const owner = nameFromOwner(r);
    const phone = phoneFromOwner(r);

    const division = locationName(r, 'division');
    const district = locationName(r, 'district');
    const upazila = locationName(r, 'upazila');

    const ownerLines = [
      str(owner.fullName, '—'),
      owner.company ? str(owner.company) : '',
    ].filter(Boolean);

    return {
      id: str(r?.id),
      sl: idx + 1,

      stationName: str(stationName, '—'),
      ownerNameLines: ownerLines.length ? ownerLines : ['—'],
      ownerPhone: str(phone, '—'),

      division: str(division, '—'),
      district: str(district, '—'),
      upazila: str(upazila, '—'),

      docUrl: docUrlFromStation(r),
    };
  });
}
