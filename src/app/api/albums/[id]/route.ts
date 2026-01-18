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
  description: z.string().optional(),
  event_date: z.string().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function uniqueSlug(title: string, albumId: number) {
  const base = slugify(title);
  let slug = base;
  let counter = 1;
  while (await prisma.album.findFirst({ where: { slug, id: { not: albumId } } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const album = await prisma.album.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });
  if (!album) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(album, { status: 200 });
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
  const albumId = Number(id);
  const existing = await prisma.album.findUnique({ where: { id: albumId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? undefined,
    description: getString(formData.get('description')) ?? undefined,
    event_date: getString(formData.get('event_date')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const cover = getFile(formData.get('cover'));
  if (cover) {
    const error = validateFile(cover, {
      prefix: 'cover',
      maxBytes: 10 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (error) {
      return NextResponse.json({ message: 'Validation error', errors: { cover: [error] } }, { status: 422 });
    }
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title) {
    data.title = parsed.data.title;
    data.slug = await uniqueSlug(parsed.data.title, albumId);
  }
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.event_date) data.event_date = new Date(parsed.data.event_date);
  if (cover) {
    data.cover_url = await uploadToS3(cover, { prefix: 'albums', maxBytes: 10 * 1024 * 1024 });
  }

  const album = await prisma.album.update({
    where: { id: albumId },
    data,
    include: { images: true },
  });

  return NextResponse.json(album, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const albumId = Number(id);
  const existing = await prisma.album.findUnique({ where: { id: albumId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.album.delete({ where: { id: albumId } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
