import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createApiToken, verifyPassword } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const loginSchema = z.object({
  phone_number: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const user = await prisma.user.findUnique({ where: { phone_number: parsed.data.phone_number } });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await verifyPassword(parsed.data.password, user.password_hash);
  if (!isValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = await createApiToken(user.id);

  return NextResponse.json(
    {
      access_token: accessToken,
      token_type: 'Bearer',
      user,
    },
    { status: 200 }
  );
}
