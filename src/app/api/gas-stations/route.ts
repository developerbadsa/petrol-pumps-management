import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const createSchema = z.object({
  station_owner_id: z.coerce.number().int(),
  station_name: z.string().min(1),
  fuel_type: z.string().optional(),
  station_type: z.string().optional(),
  station_status: z.string().optional(),
  business_type: z.string().optional(),
  dealership_agreement: z.string().optional(),
  division_id: z.coerce.number().int(),
  district_id: z.coerce.number().int(),
  upazila_id: z.coerce.number().int(),
  station_address: z.string().min(1),
  commencement_date: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_phone: z.string().optional(),
  oil_company_name: z.string().optional(),
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

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const stations = await prisma.gasStation.findMany({
    include: {
      stationOwner: true,
      division: true,
      district: true,
      upazila: true,
      otherBusinesses: { include: { otherBusiness: true } },
      documents: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(stations, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    station_owner_id: getString(formData.get('station_owner_id')) ?? '',
    station_name: getString(formData.get('station_name')) ?? '',
    fuel_type: getString(formData.get('fuel_type')) ?? undefined,
    station_type: getString(formData.get('station_type')) ?? undefined,
    station_status: getString(formData.get('station_status')) ?? undefined,
    business_type: getString(formData.get('business_type')) ?? undefined,
    dealership_agreement: getString(formData.get('dealership_agreement')) ?? undefined,
    division_id: getString(formData.get('division_id')) ?? '',
    district_id: getString(formData.get('district_id')) ?? '',
    upazila_id: getString(formData.get('upazila_id')) ?? '',
    station_address: getString(formData.get('station_address')) ?? '',
    commencement_date: getString(formData.get('commencement_date')) ?? undefined,
    contact_person_name: getString(formData.get('contact_person_name')) ?? undefined,
    contact_person_phone: getString(formData.get('contact_person_phone')) ?? undefined,
    oil_company_name: getString(formData.get('oil_company_name')) ?? undefined,
  };

  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const [owner, division, district, upazila] = await Promise.all([
    prisma.stationOwner.findUnique({ where: { id: parsed.data.station_owner_id } }),
    prisma.division.findUnique({ where: { id: parsed.data.division_id } }),
    prisma.district.findUnique({ where: { id: parsed.data.district_id } }),
    prisma.upazila.findUnique({ where: { id: parsed.data.upazila_id } }),
  ]);

  if (!owner || !division || !district || !upazila) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
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

  const otherBusinessNames = parseStringArray(formData, 'other_businesses');
  const otherBusinesses = await Promise.all(
    otherBusinessNames.map((name) =>
      prisma.otherBusiness.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const station = await prisma.gasStation.create({
    data: {
      station_owner_id: owner.id,
      station_name: parsed.data.station_name,
      oil_company_name: parsed.data.oil_company_name,
      fuel_type: parsed.data.fuel_type,
      station_type: parsed.data.station_type,
      station_status: parsed.data.station_status,
      business_type: parsed.data.business_type,
      dealership_agreement: parsed.data.dealership_agreement,
      division_id: division.id,
      district_id: district.id,
      upazila_id: upazila.id,
      station_address: parsed.data.station_address,
      commencement_date: parsed.data.commencement_date ? new Date(parsed.data.commencement_date) : null,
      contact_person_name: parsed.data.contact_person_name,
      contact_person_phone: parsed.data.contact_person_phone,
      otherBusinesses: otherBusinesses.length
        ? {
            create: otherBusinesses.map((business) => ({
              otherBusiness: { connect: { id: business.id } },
            })),
          }
        : undefined,
    },
  });

  for (const upload of fileUploads) {
    await uploadStationDoc(upload.file, upload.type, station.id);
  }

  const createdStation = await prisma.gasStation.findUnique({
    where: { id: station.id },
    include: {
      stationOwner: true,
      division: true,
      district: true,
      upazila: true,
      otherBusinesses: { include: { otherBusiness: true } },
      documents: true,
    },
  });

  return NextResponse.json(createdStation, { status: 200 });
}
