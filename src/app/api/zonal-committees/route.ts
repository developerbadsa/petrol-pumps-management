import {NextResponse} from 'next/server';
import {LaravelHttpError, laravelFetch} from '@/lib/http/laravelFetch';

export async function GET() {
   try {
      const data = await laravelFetch('/zonal-committees', {
         method: 'GET',
         auth: true,
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

export async function POST(req: Request) {
   try {
      const formData = await req.formData();

      const data = await laravelFetch('/zonal-committees', {
         method: 'POST',
         auth: true,
         body: formData,
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
         {message: 'Failed to create zonal committee member'},
         {status: 500}
      );
   }
}
