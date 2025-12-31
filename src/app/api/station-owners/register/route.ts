import { NextResponse } from 'next/server';
import { laravelFetch, LaravelHttpError } from '@/lib/http/laravelFetch';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | {
          stationOwnerName: string;
          email: string;
          phone: string;
          password: string;
          confirmPassword: string;
          residentialAddress: string;
        }
      | null;

    if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });

    // 1) create user (public)
    const reg = await laravelFetch<any>('/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({
        full_name: body.stationOwnerName?.trim(),
        email: body.email?.trim(),
        phone_number: body.phone?.trim(),
        password: body.password,
        password_confirmation: body.confirmPassword,
      }),
    });

    const userId = reg?.user?.id ?? reg?.data?.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Register succeeded but user id missing' }, { status: 500 });
    }

    // 2) create station owner record (admin auth)
    const owner = await laravelFetch<any>('/station-owners', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({
        user_id: userId,
        address: body.residentialAddress?.trim(),
      }),
    });

    const ownerId = owner?.id ?? owner?.station_owner?.id ?? owner?.data?.id ?? userId;

    return NextResponse.json({ id: ownerId, owner }, { status: 201 });
  } catch (e) {
    if (e instanceof LaravelHttpError) {
      return NextResponse.json({ message: e.message, errors: e.errors ?? null }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
