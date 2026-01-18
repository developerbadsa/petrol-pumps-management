import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const videoSchema = z.object({
  title: z.string().min(1),
  youtube_link: z.string().url(),
});

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { created_at: 'desc' } });
  return NextResponse.json(videos, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? '',
    youtube_link: getString(formData.get('youtube_link')) ?? '',
  };

  const parsed = videoSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const thumbnail = getFile(formData.get('thumbnail'));
  if (thumbnail) {
    const error = validateFile(thumbnail, {
      prefix: 'thumbnail',
      maxBytes: 10 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (error) {
      return NextResponse.json(
        { message: 'Validation error', errors: { thumbnail: [error] } },
        { status: 422 }
      );
    }
  }

  const thumbnailUrl = thumbnail
    ? await uploadToS3(thumbnail, { prefix: 'videos', maxBytes: 10 * 1024 * 1024 })
    : null;

  const video = await prisma.video.create({
    data: {
      title: parsed.data.title,
      youtube_link: parsed.data.youtube_link,
      thumbnail_url: thumbnailUrl ?? undefined,
    },
  });

  return NextResponse.json(video, { status: 200 });
}
