import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const paymentSchema = z.object({
  station_id: z.coerce.number().int(),
  bank_name: z.string().min(1),
  amount_paid: z.coerce.number().positive(),
  note: z.string().optional(),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const records = await prisma.paymentRecord.findMany({
    include: { station: true, createdBy: true },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(records, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    station_id: getString(formData.get('station_id')) ?? '',
    bank_name: getString(formData.get('bank_name')) ?? '',
    amount_paid: getString(formData.get('amount_paid')) ?? '',
    note: getString(formData.get('note')) ?? undefined,
  };

  const parsed = paymentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const station = await prisma.gasStation.findUnique({ where: { id: parsed.data.station_id } });
  if (!station) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const paymentDoc = getFile(formData.get('payment_doc'));
  const fileError = validateFile(paymentDoc, {
    prefix: 'payment_doc',
    maxBytes: 2 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  });
  if (fileError) {
    return NextResponse.json(
      { message: 'Validation error', errors: { payment_doc: [fileError] } },
      { status: 422 }
    );
  }

  const paymentDocUrl = await uploadToS3(paymentDoc as File, {
    prefix: 'payment-records',
    maxBytes: 2 * 1024 * 1024,
  });

  const [record] = await prisma.$transaction([
    prisma.paymentRecord.create({
      data: {
        station_id: station.id,
        bank_name: parsed.data.bank_name,
        amount_paid: parsed.data.amount_paid,
        note: parsed.data.note,
        payment_doc_url: paymentDocUrl,
        created_by_id: auth.user.id,
      },
      include: { station: true, createdBy: true },
    }),
    prisma.gasStation.update({
      where: { id: station.id },
      data: { verification_status: 'APPROVED' },
    }),
  ]);

  return NextResponse.json(record, { status: 200 });
}
