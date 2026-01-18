import { NextResponse } from 'next/server';
import { getAuthenticatedUser, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1),
    new_password: z.string().min(8),
    new_password_confirmation: z.string().min(8),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    path: ['new_password_confirmation'],
    message: 'Passwords do not match',
  });

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const isValid = await verifyPassword(parsed.data.current_password, auth.user.password_hash);
  if (!isValid) {
    return NextResponse.json(
      { message: 'Validation error', errors: { current_password: ['Current password is incorrect.'] } },
      { status: 422 }
    );
  }

  await prisma.user.update({
    where: { id: auth.user.id },
    data: { password_hash: await hashPassword(parsed.data.new_password) },
  });

  return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
}
