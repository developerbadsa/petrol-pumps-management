import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/http/laravelFetch';

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => null);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.searchParams.toString();
  const path = qs ? `/gas-stations?${qs}` : '/gas-stations';

  const data = await laravelFetch<any>(path, { method: 'GET', auth: true });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await readBody(req);
  if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

  const data = await laravelFetch<any>('/gas-stations', {
    method: 'POST',
    auth: true,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  return NextResponse.json(data);
}
