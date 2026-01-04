import {NextResponse} from 'next/server';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';

function extractId(req: Request, params?: Record<string, any>) {
  const fromParams = params?.id ?? Object.values(params ?? {})[0];
  const raw =
    typeof fromParams === 'string'
      ? fromParams
      : Array.isArray(fromParams)
        ? fromParams[0]
        : null;

  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }

  const pathname = new URL(req.url).pathname;
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  const id = Number(last);

  if (!Number.isFinite(id)) throw new LaravelHttpError(400, 'Invalid album id');
  return id;
}

export async function GET(req: Request, ctx: {params?: Record<string, any>}) {
  try {
    const id = extractId(req, ctx.params);
    const data = await laravelFetch(`/albums/${id}`, {method: 'GET', auth: false});
    return NextResponse.json(data, {status: 200});
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({message: e.message, errors: e.errors ?? null}, {status: e.status});
    }
    return NextResponse.json({message: 'Failed to load album'}, {status: 500});
  }
}

export async function DELETE(req: Request, ctx: {params?: Record<string, any>}) {
  try {
    const id = extractId(req, ctx.params);
    const data = await laravelFetch(`/albums/${id}`, {method: 'DELETE', auth: true});
    return NextResponse.json(data, {status: 200});
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({message: e.message, errors: e.errors ?? null}, {status: e.status});
    }
    return NextResponse.json({message: 'Failed to delete album'}, {status: 500});
  }
}

async function updateAlbum(req: Request, ctx: {params?: Record<string, any>}) {
  const id = extractId(req, ctx.params);
  const formData = await req.formData();
  if (!formData.has('_method')) formData.set('_method', 'PUT');

  const data = await laravelFetch(`/albums/${id}`, {
    method: 'POST',
    auth: true,
    body: formData,
  });

  return NextResponse.json(data, {status: 200});
}

export async function PUT(req: Request, ctx: {params?: Record<string, any>}) {
  try {
    return await updateAlbum(req, ctx);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({message: e.message, errors: e.errors ?? null}, {status: e.status});
    }
    return NextResponse.json({message: 'Failed to update album'}, {status: 500});
  }
}

export async function POST(req: Request, ctx: {params?: Record<string, any>}) {
  try {
    return await updateAlbum(req, ctx);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({message: e.message, errors: e.errors ?? null}, {status: e.status});
    }
    return NextResponse.json({message: 'Failed to update album'}, {status: 500});
  }
}
