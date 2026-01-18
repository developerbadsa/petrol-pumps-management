import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { bdPhoneRegex, validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone_number: z.string().regex(bdPhoneRegex, 'Invalid phone number').optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  if (parsed.data.email) {
    const existingEmail = await prisma.user.findFirst({
      where: { email: parsed.data.email, id: { not: auth.user.id } },
    });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Validation error', errors: { email: ['The email has already been taken.'] } },
        { status: 422 }
      );
    }
  }

  if (parsed.data.phone_number) {
    const existingPhone = await prisma.user.findFirst({
      where: { phone_number: parsed.data.phone_number, id: { not: auth.user.id } },
    });
    if (existingPhone) {
      return NextResponse.json(
        { message: 'Validation error', errors: { phone_number: ['The phone number has already been taken.'] } },
        { status: 422 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: auth.user.id },
    data: parsed.data,
  });

  return NextResponse.json(user, { status: 200 });
}
