import { NextResponse, type NextRequest } from 'next/server';
import { laravelFetch } from '@/lib/http/laravelFetch';

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) return await req.formData();
  return await req.json().catch(() => null);
}

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const data = await laravelFetch<any>(`/gas-stations/${id}`, {
    method: 'DELETE',
    auth: true,
  });

  return NextResponse.json(data ?? { ok: true });
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const data = await laravelFetch<any>(`/gas-stations/${id}`, {
    method: 'GET',
    auth: true,
  });

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const body = await readBody(req);
  if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

  // Laravel-compatible update (POST + _method=PUT)
  const data = await laravelFetch<any>(`/gas-stations/${id}?_method=PUT`, {
    method: 'POST',
    auth: true,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  return NextResponse.json(data);
}
