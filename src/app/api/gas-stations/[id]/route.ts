import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  station_owner_id: z.coerce.number().int().optional(),
  station_name: z.string().min(1).optional(),
  oil_company_name: z.string().optional(),
  fuel_type: z.string().optional(),
  station_type: z.string().optional(),
  station_status: z.string().optional(),
  business_type: z.string().optional(),
  dealership_agreement: z.string().optional(),
  division_id: z.coerce.number().int().optional(),
  district_id: z.coerce.number().int().optional(),
  upazila_id: z.coerce.number().int().optional(),
  station_address: z.string().min(1).optional(),
  commencement_date: z.string().optional(),
  verification_status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  verified_by: z.coerce.number().int().optional(),
  verified_at: z.string().optional(),
  rejection_reason: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_phone: z.string().optional(),
});

function parseStringArray(formData: FormData, key: string) {
  const values = formData.getAll(`${key}[]`).filter((item) => typeof item === 'string') as string[];
  if (values.length) {
    return values.filter((value) => value.trim().length > 0);
  }
  const single = getString(formData.get(key));
  if (!single) {
    return [];
  }
  try {
    const parsed = JSON.parse(single);
    if (Array.isArray(parsed)) {
      return parsed.map((value) => String(value));
    }
  } catch {
    return single.split(',').map((value) => value.trim()).filter(Boolean);
  }
  return [];
}

async function uploadStationDoc(file: File, type: string, stationId: number) {
  const fileUrl = await uploadToS3(file, { prefix: 'station-documents', maxBytes: 20 * 1024 * 1024 });
  await prisma.stationDocument.create({
    data: {
      gas_station_id: stationId,
      document_type: type,
      file_url: fileUrl,
    },
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const station = await prisma.gasStation.findUnique({
    where: { id: Number(id) },
    include: {
      stationOwner: true,
      division: true,
      district: true,
      upazila: true,
      otherBusinesses: { include: { otherBusiness: true } },
      documents: true,
    },
  });
  if (!station) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(station, { status: 200 });
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
  const station = await prisma.gasStation.findUnique({ where: { id: Number(id) } });
  if (!station) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    station_owner_id: getString(formData.get('station_owner_id')) ?? undefined,
    station_name: getString(formData.get('station_name')) ?? undefined,
    oil_company_name: getString(formData.get('oil_company_name')) ?? undefined,
    fuel_type: getString(formData.get('fuel_type')) ?? undefined,
    station_type: getString(formData.get('station_type')) ?? undefined,
    station_status: getString(formData.get('station_status')) ?? undefined,
    business_type: getString(formData.get('business_type')) ?? undefined,
    dealership_agreement: getString(formData.get('dealership_agreement')) ?? undefined,
    division_id: getString(formData.get('division_id')) ?? undefined,
    district_id: getString(formData.get('district_id')) ?? undefined,
    upazila_id: getString(formData.get('upazila_id')) ?? undefined,
    station_address: getString(formData.get('station_address')) ?? undefined,
    commencement_date: getString(formData.get('commencement_date')) ?? undefined,
    verification_status: getString(formData.get('verification_status')) ?? undefined,
    verified_by: getString(formData.get('verified_by')) ?? undefined,
    verified_at: getString(formData.get('verified_at')) ?? undefined,
    rejection_reason: getString(formData.get('rejection_reason')) ?? undefined,
    contact_person_name: getString(formData.get('contact_person_name')) ?? undefined,
    contact_person_phone: getString(formData.get('contact_person_phone')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  if (parsed.data.station_owner_id) {
    const owner = await prisma.stationOwner.findUnique({ where: { id: parsed.data.station_owner_id } });
    if (!owner) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }
  if (parsed.data.division_id) {
    const division = await prisma.division.findUnique({ where: { id: parsed.data.division_id } });
    if (!division) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }
  if (parsed.data.district_id) {
    const district = await prisma.district.findUnique({ where: { id: parsed.data.district_id } });
    if (!district) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }
  if (parsed.data.upazila_id) {
    const upazila = await prisma.upazila.findUnique({ where: { id: parsed.data.upazila_id } });
    if (!upazila) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }

  const files: Array<{ key: string; type: string }> = [
    { key: 'nid', type: 'nid' },
    { key: 'tin', type: 'tin' },
    { key: 'explosive_license', type: 'explosive_license' },
    { key: 'trade_license', type: 'trade_license' },
  ];

  const fileUploads: Array<{ type: string; file: File }> = [];
  for (const entry of files) {
    const file = getFile(formData.get(entry.key));
    if (file) {
      const error = validateFile(file, {
        prefix: entry.key,
        maxBytes: 20 * 1024 * 1024,
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      });
      if (error) {
        return NextResponse.json(
          { message: 'Validation error', errors: { [entry.key]: [error] } },
          { status: 422 }
        );
      }
      fileUploads.push({ type: entry.type, file });
    }
  }

  const otherBusinessIds = parseStringArray(formData, 'other_businesses')
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value));

  const updatedStation = await prisma.gasStation.update({
    where: { id: station.id },
    data: {
      station_owner_id: parsed.data.station_owner_id,
      station_name: parsed.data.station_name,
      oil_company_name: parsed.data.oil_company_name,
      fuel_type: parsed.data.fuel_type,
      station_type: parsed.data.station_type,
      station_status: parsed.data.station_status,
      business_type: parsed.data.business_type,
      dealership_agreement: parsed.data.dealership_agreement,
      division_id: parsed.data.division_id,
      district_id: parsed.data.district_id,
      upazila_id: parsed.data.upazila_id,
      station_address: parsed.data.station_address,
      commencement_date: parsed.data.commencement_date ? new Date(parsed.data.commencement_date) : undefined,
      verification_status: parsed.data.verification_status,
      verified_by: parsed.data.verified_by,
      verified_at: parsed.data.verified_at ? new Date(parsed.data.verified_at) : undefined,
      rejection_reason: parsed.data.rejection_reason,
      contact_person_name: parsed.data.contact_person_name,
      contact_person_phone: parsed.data.contact_person_phone,
      otherBusinesses: otherBusinessIds.length
        ? {
            deleteMany: {},
            create: otherBusinessIds.map((idValue) => ({
              otherBusiness: { connect: { id: idValue } },
            })),
          }
        : undefined,
    },
  });

  for (const upload of fileUploads) {
    await uploadStationDoc(upload.file, upload.type, updatedStation.id);
  }

  const refreshed = await prisma.gasStation.findUnique({
    where: { id: updatedStation.id },
    include: {
      stationOwner: true,
      division: true,
      district: true,
      upazila: true,
      otherBusinesses: { include: { otherBusiness: true } },
      documents: true,
    },
  });

  return NextResponse.json(refreshed, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const station = await prisma.gasStation.findUnique({ where: { id: Number(id) } });
  if (!station) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.gasStation.delete({ where: { id: station.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
