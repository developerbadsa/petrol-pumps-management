import {NextResponse} from 'next/server';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';

export async function GET() {
  try {
    const stats = await laravelFetch('/dashboard-stats', {method: 'GET', auth: true});
    return NextResponse.json(stats);
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({message: e.message, errors: e.errors}, {status: e.status});
    }
    return NextResponse.json({message: 'Server error'}, {status: 500});
  }
}
