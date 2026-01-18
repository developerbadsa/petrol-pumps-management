import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const createSchema = z.object({
  album_id: z.string().min(1),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const albumId = url.searchParams.get('album_id');
  const images = await prisma.albumImage.findMany({
    where: albumId ? { album_id: Number(albumId) } : undefined,
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(images, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    album_id: getString(formData.get('album_id')) ?? '',
  };

  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const album = await prisma.album.findUnique({ where: { id: Number(parsed.data.album_id) } });
  if (!album) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
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

  const imageUrl = await uploadToS3(image as File, { prefix: 'album-images', maxBytes: 10 * 1024 * 1024 });
  const albumImage = await prisma.albumImage.create({
    data: {
      album_id: album.id,
      image_url: imageUrl,
    },
  });

  return NextResponse.json(albumImage, { status: 200 });
}
