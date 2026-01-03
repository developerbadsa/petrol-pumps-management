import {NextResponse} from 'next/server';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';

export async function GET() {
   try {
      const data = await laravelFetch('/videos', {method: 'GET', auth: false});
      return NextResponse.json(data, {status: 200});
   } catch (e) {
      if (e instanceof LaravelHttpError) {
         return NextResponse.json(
            {message: e.message, errors: e.errors ?? null},
            {status: e.status}
         );
      }
      return NextResponse.json(
         {message: 'Failed to load videos'},
         {status: 500}
      );
   }
}
