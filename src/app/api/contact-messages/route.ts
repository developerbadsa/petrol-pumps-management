import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { z } from 'zod';

export const runtime = 'nodejs';

const contactSchema = z.object({
  sender_name: z.string().min(1),
  sender_email: z.string().email(),
  sender_phone: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(messages, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const message = await prisma.contactMessage.create({
    data: parsed.data,
  });

  return NextResponse.json(message, { status: 200 });
}
