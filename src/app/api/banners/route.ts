import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const bannerSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
});

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { created_at: 'desc' } });
  return NextResponse.json(banners, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? '',
    type: getString(formData.get('type')) ?? '',
  };

  const parsed = bannerSchema.safeParse(payload);
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

  const imageUrl = await uploadToS3(image as File, { prefix: 'banners', maxBytes: 10 * 1024 * 1024 });
  const banner = await prisma.banner.create({
    data: {
      title: parsed.data.title,
      type: parsed.data.type,
      image_url: imageUrl,
    },
  });

  return NextResponse.json(banner, { status: 200 });
}
