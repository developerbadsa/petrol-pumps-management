import {NextResponse} from 'next/server';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const query = searchParams.toString();
    const url = query ? `/public/station-owners/list?${query}` : '/public/station-owners/list';
    const data = await laravelFetch<any>(url, {method: 'GET', auth: false});
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({message: e.message, errors: e.errors ?? null}, {status: e.status});
    }
    console.error(e);
    return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
  }
}
