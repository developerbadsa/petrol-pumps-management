import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const popupSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export async function GET() {
  const popups = await prisma.popup.findMany({ orderBy: { created_at: 'desc' } });
  return NextResponse.json(popups, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? '',
    description: getString(formData.get('description')) ?? undefined,
    start_date: getString(formData.get('start_date')) ?? undefined,
    end_date: getString(formData.get('end_date')) ?? undefined,
  };

  const parsed = popupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const image = getFile(formData.get('image'));
  const error = validateFile(image, {
    prefix: 'image',
    maxBytes: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });
  if (error) {
    return NextResponse.json({ message: 'Validation error', errors: { image: [error] } }, { status: 422 });
  }

  const imageUrl = await uploadToS3(image as File, { prefix: 'popups', maxBytes: 10 * 1024 * 1024 });
  const popup = await prisma.popup.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      start_date: parsed.data.start_date ? new Date(parsed.data.start_date) : null,
      end_date: parsed.data.end_date ? new Date(parsed.data.end_date) : null,
      image_url: imageUrl,
    },
  });

  return NextResponse.json(popup, { status: 200 });
}
