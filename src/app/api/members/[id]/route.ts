import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  member_name: z.string().min(1).optional(),
  member_nid_number: z.string().min(1).optional(),
  station_name_address: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
  member_mobile_number: z.string().min(1).optional(),
  oil_company_name: z.string().min(1).optional(),
  type_of_business: z.enum(['Dealer', 'Agent']).optional(),
  representative_name: z.string().min(1).optional(),
  representative_nid_number: z.string().min(1).optional(),
  filling_station_phone_number: z.string().optional(),
  trade_license_number: z.string().min(1).optional(),
  tin_number: z.string().min(1).optional(),
  explosives_department_license_number: z.string().optional(),
  application_date: z.string().optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const member = await prisma.member.findUnique({ where: { id: Number(id) } });
  if (!member) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(member, { status: 200 });
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
  const member = await prisma.member.findUnique({ where: { id: Number(id) } });
  if (!member) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    member_name: getString(formData.get('member_name')) ?? undefined,
    member_nid_number: getString(formData.get('member_nid_number')) ?? undefined,
    station_name_address: getString(formData.get('station_name_address')) ?? undefined,
    district: getString(formData.get('district')) ?? undefined,
    member_mobile_number: getString(formData.get('member_mobile_number')) ?? undefined,
    oil_company_name: getString(formData.get('oil_company_name')) ?? undefined,
    type_of_business: getString(formData.get('type_of_business')) ?? undefined,
    representative_name: getString(formData.get('representative_name')) ?? undefined,
    representative_nid_number: getString(formData.get('representative_nid_number')) ?? undefined,
    filling_station_phone_number: getString(formData.get('filling_station_phone_number')) ?? undefined,
    trade_license_number: getString(formData.get('trade_license_number')) ?? undefined,
    tin_number: getString(formData.get('tin_number')) ?? undefined,
    explosives_department_license_number:
      getString(formData.get('explosives_department_license_number')) ?? undefined,
    application_date: getString(formData.get('application_date')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const requiredDocuments = getFile(formData.get('required_documents'));
  let requiredDocumentsUrl: string | undefined;
  if (requiredDocuments) {
    const requiredDocError = validateFile(requiredDocuments, {
      prefix: 'required_documents',
      maxBytes: 10 * 1024 * 1024,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    });
    if (requiredDocError) {
      return NextResponse.json(
        { message: 'Validation error', errors: { required_documents: [requiredDocError] } },
        { status: 422 }
      );
    }
    requiredDocumentsUrl = await uploadToS3(requiredDocuments, {
      prefix: 'members',
      maxBytes: 10 * 1024 * 1024,
    });
  }

  const applicantSignature = getFile(formData.get('applicant_signature'));
  let applicantSignatureUrl: string | undefined;
  if (applicantSignature) {
    const signatureError = validateFile(applicantSignature, {
      prefix: 'applicant_signature',
      maxBytes: 10 * 1024 * 1024,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    });
    if (signatureError) {
      return NextResponse.json(
        { message: 'Validation error', errors: { applicant_signature: [signatureError] } },
        { status: 422 }
      );
    }
    applicantSignatureUrl = await uploadToS3(applicantSignature, {
      prefix: 'members',
      maxBytes: 10 * 1024 * 1024,
    });
  }

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: {
      member_name: parsed.data.member_name,
      member_nid_number: parsed.data.member_nid_number,
      station_name_address: parsed.data.station_name_address,
      district: parsed.data.district,
      member_mobile_number: parsed.data.member_mobile_number,
      oil_company_name: parsed.data.oil_company_name,
      type_of_business: parsed.data.type_of_business,
      representative_name: parsed.data.representative_name,
      representative_nid_number: parsed.data.representative_nid_number,
      filling_station_phone_number: parsed.data.filling_station_phone_number,
      required_documents_url: requiredDocumentsUrl,
      trade_license_number: parsed.data.trade_license_number,
      tin_number: parsed.data.tin_number,
      explosives_department_license_number: parsed.data.explosives_department_license_number,
      application_date: parsed.data.application_date ? new Date(parsed.data.application_date) : undefined,
      applicant_signature_url: applicantSignatureUrl,
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
  const member = await prisma.member.findUnique({ where: { id: Number(id) } });
  if (!member) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.member.delete({ where: { id: member.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
