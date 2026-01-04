import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await laravelFetch('/albums', { method: 'GET', auth: false });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to load albums' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // TEMP DEBUG (1 run): ensure file is actually present
    // const f = formData.get('cover');
    // console.log('cover:', f instanceof File ? { name: f.name, size: f.size, type: f.type } : f);

    const data = await laravelFetch('/albums', {
      method: 'POST',
      auth: true,
      body: formData,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to create album' }, { status: 500 });
  }
}
