import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/http/laravelFetch';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  // 1) Read gas-station details to discover owner id
  const station = await laravelFetch<any>(`/gas-stations/${params.id}`, {
    method: 'GET',
    auth: true,
  });

  const ownerId =
    station?.station_owner_id ??
    station?.stationOwnerId ??
    station?.station_owner?.id ??
    station?.owner?.id ??
    null;

  // 2) Prefer verifying station-owner (doc-defined)
  if (ownerId) {
    const data = await laravelFetch<any>(`/station-owners/${ownerId}?_method=PUT`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ verification_status: 'verified' }),
    });
    return NextResponse.json(data);
  }

  // 3) Fallback: mark station verified if backend uses station-level flag
  const data = await laravelFetch<any>(`/gas-stations/${params.id}?_method=PUT`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ verification_status: 'verified', is_verified: true }),
  });

  return NextResponse.json(data);
}
