import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const noticeSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  publish_date: z.string().min(1),
});

export async function GET() {
  const notices = await prisma.notice.findMany({
    include: { attachments: true },
    orderBy: { publish_date: 'desc' },
  });
  return NextResponse.json(notices, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? '',
    content: getString(formData.get('content')) ?? '',
    publish_date: getString(formData.get('publish_date')) ?? '',
  };

  const parsed = noticeSchema.safeParse(payload);
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

  const notice = await prisma.notice.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      publish_date: new Date(parsed.data.publish_date),
      attachments: {
        create: attachmentUrls.map((file_url) => ({ file_url })),
      },
    },
    include: { attachments: true },
  });

  return NextResponse.json(notice, { status: 200 });
}
