import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const createSchema = z.object({
  member_name: z.string().min(1),
  member_nid_number: z.string().min(1),
  station_name_address: z.string().min(1),
  district: z.string().min(1),
  member_mobile_number: z.string().min(1),
  oil_company_name: z.string().min(1),
  type_of_business: z.enum(['Dealer', 'Agent']),
  representative_name: z.string().min(1),
  representative_nid_number: z.string().min(1),
  filling_station_phone_number: z.string().optional(),
  trade_license_number: z.string().min(1),
  tin_number: z.string().min(1),
  explosives_department_license_number: z.string().optional(),
  application_date: z.string().min(1),
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const payload = {
    member_name: getString(formData.get('member_name')) ?? '',
    member_nid_number: getString(formData.get('member_nid_number')) ?? '',
    station_name_address: getString(formData.get('station_name_address')) ?? '',
    district: getString(formData.get('district')) ?? '',
    member_mobile_number: getString(formData.get('member_mobile_number')) ?? '',
    oil_company_name: getString(formData.get('oil_company_name')) ?? '',
    type_of_business: getString(formData.get('type_of_business')) ?? '',
    representative_name: getString(formData.get('representative_name')) ?? '',
    representative_nid_number: getString(formData.get('representative_nid_number')) ?? '',
    filling_station_phone_number: getString(formData.get('filling_station_phone_number')) ?? undefined,
    trade_license_number: getString(formData.get('trade_license_number')) ?? '',
    tin_number: getString(formData.get('tin_number')) ?? '',
    explosives_department_license_number:
      getString(formData.get('explosives_department_license_number')) ?? undefined,
    application_date: getString(formData.get('application_date')) ?? '',
  };

  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const requiredDocuments = getFile(formData.get('required_documents'));
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

  const applicantSignature = getFile(formData.get('applicant_signature'));
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

  const requiredDocumentsUrl = await uploadToS3(requiredDocuments as File, {
    prefix: 'members',
    maxBytes: 10 * 1024 * 1024,
  });
  const applicantSignatureUrl = await uploadToS3(applicantSignature as File, {
    prefix: 'members',
    maxBytes: 10 * 1024 * 1024,
  });

  const member = await prisma.member.create({
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
      application_date: new Date(parsed.data.application_date),
      applicant_signature_url: applicantSignatureUrl,
    },
  });

  return NextResponse.json(member, { status: 200 });
}

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const normalizedStatus = status ? status.toUpperCase() : undefined;

  const members = await prisma.member.findMany({
    where: normalizedStatus === 'PENDING' || normalizedStatus === 'APPROVED' ? { status: normalizedStatus } : undefined,
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(members, { status: 200 });
}
