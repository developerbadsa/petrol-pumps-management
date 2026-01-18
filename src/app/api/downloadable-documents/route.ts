import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { buildPagination } from '@/lib/pagination';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const documentSchema = z.object({
  title: z.string().min(1),
  publish_date: z.string().min(1),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const perPage = Number(url.searchParams.get('per_page') ?? '20');
  const search = url.searchParams.get('search') ?? '';
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePerPage = Number.isNaN(perPage) || perPage < 1 ? 20 : perPage;

  const where = search
    ? {
        title: { contains: search, mode: 'insensitive' as const },
      }
    : undefined;

  const total = await prisma.downloadableDocument.count({ where });
  const docs = await prisma.downloadableDocument.findMany({
    where,
    orderBy: { publish_date: 'desc' },
    skip: (safePage - 1) * safePerPage,
    take: safePerPage,
  });

  const pagination = buildPagination(
    docs,
    total,
    safePage,
    safePerPage,
    `${url.origin}/api/downloadable-documents`
  );
  return NextResponse.json(pagination, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    title: getString(formData.get('title')) ?? '',
    publish_date: getString(formData.get('publish_date')) ?? '',
    status: getString(formData.get('status')) ?? undefined,
  };

  const parsed = documentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const document = getFile(formData.get('document'));
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

  const documentUrl = await uploadToS3(document as File, {
    prefix: 'downloadable-documents',
    maxBytes: 20 * 1024 * 1024,
  });

  const created = await prisma.downloadableDocument.create({
    data: {
      title: parsed.data.title,
      publish_date: new Date(parsed.data.publish_date),
      document_url: documentUrl,
      status: parsed.data.status ?? 'active',
    },
  });

  return NextResponse.json(created, { status: 200 });
}
