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
  type: z.string().min(1).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const banner = await prisma.banner.findUnique({ where: { id: Number(id) } });
  if (!banner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(banner, { status: 200 });
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
  const bannerId = Number(id);
  const existing = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? undefined,
    type: getString(formData.get('type')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const image = getFile(formData.get('image'));
  if (image) {
    const error = validateFile(image, {
      prefix: 'image',
      maxBytes: 10 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (error) {
      return NextResponse.json({ message: 'Validation error', errors: { image: [error] } }, { status: 422 });
    }
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title) data.title = parsed.data.title;
  if (parsed.data.type) data.type = parsed.data.type;
  if (image) {
    data.image_url = await uploadToS3(image, { prefix: 'banners', maxBytes: 10 * 1024 * 1024 });
  }

  const banner = await prisma.banner.update({
    where: { id: bannerId },
    data,
  });

  return NextResponse.json(banner, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const bannerId = Number(id);
  const existing = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.banner.delete({ where: { id: bannerId } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
