import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  youtube_link: z.string().url().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const video = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!video) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(video, { status: 200 });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (resolveMethod(req) !== 'PUT') {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const videoId = Number(id);
  const existing = await prisma.video.findUnique({ where: { id: videoId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? undefined,
    youtube_link: getString(formData.get('youtube_link')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
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

  const data: Record<string, unknown> = {};
  if (parsed.data.title) data.title = parsed.data.title;
  if (parsed.data.youtube_link) data.youtube_link = parsed.data.youtube_link;
  if (thumbnail) {
    data.thumbnail_url = await uploadToS3(thumbnail, { prefix: 'videos', maxBytes: 10 * 1024 * 1024 });
  }

  const video = await prisma.video.update({
    where: { id: videoId },
    data,
  });

  return NextResponse.json(video, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const videoId = Number(id);
  const existing = await prisma.video.findUnique({ where: { id: videoId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.video.delete({ where: { id: videoId } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
