import { NextResponse } from 'next/server';
import { getToken } from '@/lib/auth/cookies';


function getFilename(url: URL) {
  const name = url.pathname.split('/').pop();
  return name ? decodeURIComponent(name) : 'document';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get('url');

  if (!urlParam) {
    return NextResponse.json({ message: 'Missing url' }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ?? new URL(req.url).origin;
  let targetUrl: URL;

  try {
    const parsed = new URL(urlParam, origin);
    if (parsed.origin !== origin) {
      return NextResponse.json({ message: 'Invalid url origin' }, { status: 400 });
    }
    targetUrl = parsed;
  } catch {
    return NextResponse.json({ message: 'Invalid url' }, { status: 400 });
  }

  const token = await getToken();
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(targetUrl.toString(), {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: 'Failed to download document' },
      { status: res.status }
    );
  }

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
  const filename = getFilename(targetUrl);
  const responseHeaders = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
  });

  return new NextResponse(buffer, { status: 200, headers: responseHeaders });
}
