import { NextResponse } from 'next/server';
import { laravelFetch } from '@/lib/http/laravelFetch';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const data = await laravelFetch<any>(`/gas-stations/${params.id}`, {
    method: 'DELETE',
    auth: true,
  });

  return NextResponse.json(data ?? { ok: true });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

  // Safe Laravel-compatible update (works even if backend expects POST + _method=PUT)
  const data = await laravelFetch<any>(`/gas-stations/${params.id}?_method=PUT`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(body),
  });

  return NextResponse.json(data);
}
