import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

  try {
    const data = await laravelFetch<any>(`/station-owners/${id}/reject`, {
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
