import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  try {
    const data = await laravelFetch<any>(`/station-owners/${id}/approve`, {
      method: 'POST',
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
