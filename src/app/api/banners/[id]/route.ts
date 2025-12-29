import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

function extractId(req: Request, params?: Record<string, any>) {
  const fromParams = params?.id ?? Object.values(params ?? {})[0];

  const raw =
    typeof fromParams === 'string'
      ? fromParams
      : Array.isArray(fromParams)
        ? fromParams[0]
        : null;

  // 1) try params
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }

  // 2) fallback: parse from URL path (/api/banners/<id>)
  const pathname = new URL(req.url).pathname;
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  const id = Number(last);

  if (!Number.isFinite(id)) throw new LaravelHttpError(400, 'Invalid banner id');
  return id;
}

export async function DELETE(req: Request, ctx: { params?: Record<string, any> }) {
  try {
    const id = extractId(req, ctx.params);

    const data = await laravelFetch(`/banners/${id}`, {
      method: 'DELETE',
      auth: true,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to delete banner' }, { status: 500 });
  }
}
