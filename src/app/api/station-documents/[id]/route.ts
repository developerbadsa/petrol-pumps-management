import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  gas_station_id: z.coerce.number().int().optional(),
  document_type: z.string().min(1).optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const document = await prisma.stationDocument.findUnique({
    where: { id: Number(id) },
    include: { gasStation: true },
  });
  if (!document) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(document, { status: 200 });
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
  const document = await prisma.stationDocument.findUnique({ where: { id: Number(id) } });
  if (!document) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    gas_station_id: getString(formData.get('gas_station_id')) ?? undefined,
    document_type: getString(formData.get('document_type')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  if (parsed.data.gas_station_id) {
    const station = await prisma.gasStation.findUnique({ where: { id: parsed.data.gas_station_id } });
    if (!station) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }

  const file = getFile(formData.get('file'));
  let fileUrl: string | undefined;
  if (file) {
    const fileError = validateFile(file, {
      prefix: 'file',
      maxBytes: 20 * 1024 * 1024,
    });
    if (fileError) {
      return NextResponse.json(
        { message: 'Validation error', errors: { file: [fileError] } },
        { status: 422 }
      );
    }
    fileUrl = await uploadToS3(file, {
      prefix: 'station-documents',
      maxBytes: 20 * 1024 * 1024,
    });
  }

  const updated = await prisma.stationDocument.update({
    where: { id: document.id },
    data: {
      gas_station_id: parsed.data.gas_station_id,
      document_type: parsed.data.document_type,
      file_url: fileUrl,
    },
    include: { gasStation: true },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const document = await prisma.stationDocument.findUnique({ where: { id: Number(id) } });
  if (!document) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.stationDocument.delete({ where: { id: document.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
