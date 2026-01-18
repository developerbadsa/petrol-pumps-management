import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const albumSchema = z.object({
  title: z.string().min(1),
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

async function uniqueSlug(title: string) {
  const base = slugify(title);
  let slug = base;
  let counter = 1;
  while (await prisma.album.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function GET() {
  const albums = await prisma.album.findMany({
    include: { images: true },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(albums, { status: 200 });
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
    event_date: getString(formData.get('event_date')) ?? undefined,
  };

  const parsed = albumSchema.safeParse(payload);
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

  const coverUrl = cover
    ? await uploadToS3(cover, { prefix: 'albums', maxBytes: 10 * 1024 * 1024 })
    : null;

  const album = await prisma.album.create({
    data: {
      title: parsed.data.title,
      slug: await uniqueSlug(parsed.data.title),
      description: parsed.data.description,
      event_date: parsed.data.event_date ? new Date(parsed.data.event_date) : null,
      cover_url: coverUrl ?? undefined,
    },
    include: { images: true },
  });

  return NextResponse.json(album, { status: 200 });
}
