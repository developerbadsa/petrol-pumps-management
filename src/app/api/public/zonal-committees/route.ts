import {NextResponse} from 'next/server';
import {LaravelHttpError, laravelFetch} from '@/lib/http/laravelFetch';

export async function GET(req: Request) {
   try {
      const {searchParams} = new URL(req.url);
      const divisionId = searchParams.get('division_id');
      const qs = divisionId ? `?division_id=${divisionId}` : '';

      const data = await laravelFetch(`/public/zonal-committees${qs}`, {
         method: 'GET',
         auth: false,
      });

      return NextResponse.json(data, {status: 200});
   } catch (e) {
      if (e instanceof LaravelHttpError) {
         return NextResponse.json(
            {message: e.message, errors: e.errors ?? null},
            {status: e.status}
         );
      }
      return NextResponse.json(
         {message: 'Failed to load zonal committees'},
         {status: 500}
      );
   }
}
