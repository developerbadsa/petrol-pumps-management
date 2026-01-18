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
  publish_date: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const doc = await prisma.downloadableDocument.findUnique({ where: { id: Number(id) } });
  if (!doc) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(doc, { status: 200 });
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
  const doc = await prisma.downloadableDocument.findUnique({ where: { id: Number(id) } });
  if (!doc) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? undefined,
    publish_date: getString(formData.get('publish_date')) ?? undefined,
    status: getString(formData.get('status')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const document = getFile(formData.get('document'));
  let documentUrl: string | undefined;
  if (document) {
    const fileError = validateFile(document, {
      prefix: 'document',
      maxBytes: 20 * 1024 * 1024,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    });
    if (fileError) {
      return NextResponse.json(
        { message: 'Validation error', errors: { document: [fileError] } },
        { status: 422 }
      );
    }
    documentUrl = await uploadToS3(document, {
      prefix: 'downloadable-documents',
      maxBytes: 20 * 1024 * 1024,
    });
  }

  const updated = await prisma.downloadableDocument.update({
    where: { id: doc.id },
    data: {
      title: parsed.data.title,
      publish_date: parsed.data.publish_date ? new Date(parsed.data.publish_date) : undefined,
      status: parsed.data.status,
      document_url: documentUrl,
    },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const doc = await prisma.downloadableDocument.findUnique({ where: { id: Number(id) } });
  if (!doc) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.downloadableDocument.delete({ where: { id: doc.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
