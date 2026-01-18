import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const documentSchema = z.object({
  gas_station_id: z.coerce.number().int(),
  document_type: z.string().min(1),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const documents = await prisma.stationDocument.findMany({
    include: { gasStation: true },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(documents, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    gas_station_id: getString(formData.get('gas_station_id')) ?? '',
    document_type: getString(formData.get('document_type')) ?? '',
  };

  const parsed = documentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const station = await prisma.gasStation.findUnique({ where: { id: parsed.data.gas_station_id } });
  if (!station) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const file = getFile(formData.get('file'));
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

  const fileUrl = await uploadToS3(file as File, {
    prefix: 'station-documents',
    maxBytes: 20 * 1024 * 1024,
  });

  const document = await prisma.stationDocument.create({
    data: {
      gas_station_id: station.id,
      document_type: parsed.data.document_type,
      file_url: fileUrl,
    },
    include: { gasStation: true },
  });

  return NextResponse.json(document, { status: 200 });
}
