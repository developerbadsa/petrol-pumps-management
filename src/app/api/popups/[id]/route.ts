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
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const popup = await prisma.popup.findUnique({ where: { id: Number(id) } });
  if (!popup) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(popup, { status: 200 });
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
  const popupId = Number(id);
  const existing = await prisma.popup.findUnique({ where: { id: popupId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? undefined,
    description: getString(formData.get('description')) ?? undefined,
    start_date: getString(formData.get('start_date')) ?? undefined,
    end_date: getString(formData.get('end_date')) ?? undefined,
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
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.start_date) data.start_date = new Date(parsed.data.start_date);
  if (parsed.data.end_date) data.end_date = new Date(parsed.data.end_date);
  if (image) {
    data.image_url = await uploadToS3(image, { prefix: 'popups', maxBytes: 10 * 1024 * 1024 });
  }

  const popup = await prisma.popup.update({
    where: { id: popupId },
    data,
  });

  return NextResponse.json(popup, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const popupId = Number(id);
  const existing = await prisma.popup.findUnique({ where: { id: popupId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.popup.delete({ where: { id: popupId } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
