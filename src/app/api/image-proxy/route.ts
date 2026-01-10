import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
   const url = request.nextUrl.searchParams.get('url');
   if (!url || !/^https?:\/\//i.test(url)) {
      return new NextResponse('Invalid url', {status: 400});
   }

   const response = await fetch(url, {cache: 'no-store'});
   if (!response.ok) {
      return new NextResponse('Failed to fetch image', {
         status: response.status,
      });
   }

   const contentType =
      response.headers.get('content-type') ?? 'application/octet-stream';
   const buffer = await response.arrayBuffer();

   return new NextResponse(buffer, {
      status: 200,
      headers: {
         'Content-Type': contentType,
         'Cache-Control': 'public, max-age=3600',
      },
   });
}
