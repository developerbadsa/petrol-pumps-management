import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await laravelFetch<any>('/station-owners/unverified', { method: 'GET', auth: true });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
