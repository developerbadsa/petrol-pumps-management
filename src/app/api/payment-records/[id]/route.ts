import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  bank_name: z.string().min(1).optional(),
  amount_paid: z.coerce.number().positive().optional(),
  note: z.string().optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const record = await prisma.paymentRecord.findUnique({
    where: { id: Number(id) },
    include: { station: true, createdBy: true },
  });
  if (!record) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(record, { status: 200 });
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
  const record = await prisma.paymentRecord.findUnique({ where: { id: Number(id) } });
  if (!record) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    bank_name: getString(formData.get('bank_name')) ?? undefined,
    amount_paid: getString(formData.get('amount_paid')) ?? undefined,
    note: getString(formData.get('note')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const paymentDoc = getFile(formData.get('payment_doc'));
  let paymentDocUrl: string | undefined;
  if (paymentDoc) {
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
    paymentDocUrl = await uploadToS3(paymentDoc, {
      prefix: 'payment-records',
      maxBytes: 2 * 1024 * 1024,
    });
  }

  const updated = await prisma.paymentRecord.update({
    where: { id: record.id },
    data: {
      bank_name: parsed.data.bank_name,
      amount_paid: parsed.data.amount_paid,
      note: parsed.data.note,
      payment_doc_url: paymentDocUrl,
    },
    include: { station: true, createdBy: true },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const record = await prisma.paymentRecord.findUnique({ where: { id: Number(id) } });
  if (!record) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.paymentRecord.delete({ where: { id: record.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
