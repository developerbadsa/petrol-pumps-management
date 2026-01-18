import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  publish_date: z.string().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const notice = await prisma.notice.findUnique({
    where: { id: Number(id) },
    include: { attachments: true },
  });
  if (!notice) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(notice, { status: 200 });
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
  const noticeId = Number(id);
  const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? undefined,
    content: getString(formData.get('content')) ?? undefined,
    publish_date: getString(formData.get('publish_date')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const attachments = formData.getAll('attachments[]').filter((item) => typeof item !== 'string') as File[];
  const attachmentUrls: string[] = [];
  for (const attachment of attachments) {
    const error = validateFile(attachment, {
      prefix: 'attachments',
      maxBytes: 10 * 1024 * 1024,
    });
    if (error) {
      return NextResponse.json(
        { message: 'Validation error', errors: { attachments: [error] } },
        { status: 422 }
      );
    }
    const url = await uploadToS3(attachment, { prefix: 'notices', maxBytes: 10 * 1024 * 1024 });
    attachmentUrls.push(url);
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title) data.title = parsed.data.title;
  if (parsed.data.content) data.content = parsed.data.content;
  if (parsed.data.publish_date) data.publish_date = new Date(parsed.data.publish_date);

  const notice = await prisma.notice.update({
    where: { id: noticeId },
    data: {
      ...data,
      attachments: attachmentUrls.length
        ? {
            create: attachmentUrls.map((file_url) => ({ file_url })),
          }
        : undefined,
    },
    include: { attachments: true },
  });

  return NextResponse.json(notice, { status: 200 });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(_req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const noticeId = Number(id);
  const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.notice.delete({ where: { id: noticeId } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
