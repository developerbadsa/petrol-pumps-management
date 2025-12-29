import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await laravelFetch(`/contact-messages/${params.id}`, {
      method: 'DELETE',
      auth: true,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json(
        { message: e.message, errors: e.errors ?? null },
        { status: e.status }
      );
    }
    return NextResponse.json({ message: 'Failed to delete message' }, { status: 500 });
  }
}
