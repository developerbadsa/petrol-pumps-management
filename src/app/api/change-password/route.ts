import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await laravelFetch('/change-password', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to change password' }, { status: 500 });
  }
}
