import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  console.log(id)

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

  try {
    // JSON update: safest is POST + _method=PUT (works with Laravel patterns consistently)
    const data = await laravelFetch<any>(`/station-owners/${id}?_method=PUT`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify(body),
    });

    return NextResponse.json(data ?? { ok: true });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  try {
    const data = await laravelFetch<any>(`/station-owners/${id}`, {
      method: 'GET',
      auth: true,
    });
    return NextResponse.json(data ?? null);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  try {
    const data = await laravelFetch<any>(`/station-owners/${id}`, {
      method: 'DELETE',
      auth: true,
    });
    return NextResponse.json(data ?? { ok: true });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
