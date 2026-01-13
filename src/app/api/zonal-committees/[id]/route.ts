import {NextResponse} from 'next/server';
import {LaravelHttpError, laravelFetch} from '@/lib/http/laravelFetch';

type Ctx = {params: {id: string} | Promise<{id: string}>};

export async function DELETE(_req: Request, {params}: Ctx) {
   try {
      const {id} = await Promise.resolve(params);

      await laravelFetch(`/zonal-committees/${id}`, {
         method: 'DELETE',
         auth: true,
      });

      return NextResponse.json({ok: true}, {status: 200});
   } catch (e) {
      if (e instanceof LaravelHttpError) {
         return NextResponse.json(
            {message: e.message, errors: e.errors ?? null},
            {status: e.status}
         );
      }
      return NextResponse.json(
         {message: 'Failed to delete zonal committee'},
         {status: 500}
      );
   }
}

export async function POST(req: Request, {params}: Ctx) {
   try {
      const {id} = await Promise.resolve(params);
      const fd = await req.formData();

      fd.set('_method', 'PUT');

      const data = await laravelFetch(`/zonal-committees/${id}`, {
         method: 'POST',
         auth: true,
         body: fd,
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
         {message: 'Failed to update zonal committee member'},
         {status: 500}
      );
   }
}
