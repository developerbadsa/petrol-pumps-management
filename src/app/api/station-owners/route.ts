import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser, hashPassword } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const createSchema = z.object({
  full_name: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().min(1),
});

const listSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = listSchema.safeParse({ status: searchParams.get('status') ?? undefined });
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const owners = await prisma.stationOwner.findMany({
    where: parsed.data.status ? { status: parsed.data.status } : undefined,
    include: { gasStations: true },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(owners, { status: 200 });
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
    }

    const existingEmail = await prisma.stationOwner.findUnique({ where: { email: parsed.data.email } });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Validation error', errors: { email: ['The email has already been taken.'] } },
        { status: 422 }
      );
    }
    const existingPhone = await prisma.stationOwner.findUnique({ where: { phone_number: parsed.data.phone_number } });
    if (existingPhone) {
      return NextResponse.json(
        { message: 'Validation error', errors: { phone_number: ['The phone number has already been taken.'] } },
        { status: 422 }
      );
    }

    const owner = await prisma.stationOwner.create({
      data: {
        full_name: parsed.data.full_name,
        phone_number: parsed.data.phone_number,
        email: parsed.data.email,
        password_hash: await hashPassword(parsed.data.password),
        address: parsed.data.address,
      },
    });

    return NextResponse.json(owner, { status: 200 });
  }

  const formData = await req.formData();
  const payload = {
    full_name: getString(formData.get('full_name')) ?? '',
    phone_number: getString(formData.get('phone_number')) ?? '',
    email: getString(formData.get('email')) ?? '',
    password: getString(formData.get('password')) ?? '',
    address: getString(formData.get('address')) ?? '',
  };

  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const existingEmail = await prisma.stationOwner.findUnique({ where: { email: parsed.data.email } });
  if (existingEmail) {
    return NextResponse.json(
      { message: 'Validation error', errors: { email: ['The email has already been taken.'] } },
      { status: 422 }
    );
  }
  const existingPhone = await prisma.stationOwner.findUnique({ where: { phone_number: parsed.data.phone_number } });
  if (existingPhone) {
    return NextResponse.json(
      { message: 'Validation error', errors: { phone_number: ['The phone number has already been taken.'] } },
      { status: 422 }
    );
  }

  const profileImage = getFile(formData.get('profile_image'));
  if (profileImage) {
    const imageError = validateFile(profileImage, {
      prefix: 'profile_image',
      maxBytes: 10 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (imageError) {
      return NextResponse.json(
        { message: 'Validation error', errors: { profile_image: [imageError] } },
        { status: 422 }
      );
    }
  }

  const profileImageUrl = profileImage
    ? await uploadToS3(profileImage, { prefix: 'station-owners', maxBytes: 10 * 1024 * 1024 })
    : null;

  const owner = await prisma.stationOwner.create({
    data: {
      full_name: parsed.data.full_name,
      phone_number: parsed.data.phone_number,
      email: parsed.data.email,
      password_hash: await hashPassword(parsed.data.password),
      address: parsed.data.address,
      profile_image_url: profileImageUrl ?? undefined,
    },
  });

  return NextResponse.json(owner, { status: 200 });
}
