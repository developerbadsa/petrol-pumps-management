import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone_number: z.string().min(1).optional(),
  email: z.string().email().optional(),
  address: z.string().min(1).optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const owner = await prisma.stationOwner.findUnique({
    where: { id: Number(id) },
    include: { gasStations: true },
  });
  if (!owner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(owner, { status: 200 });
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
  const owner = await prisma.stationOwner.findUnique({ where: { id: Number(id) } });
  if (!owner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    full_name: getString(formData.get('full_name')) ?? undefined,
    phone_number: getString(formData.get('phone_number')) ?? undefined,
    email: getString(formData.get('email')) ?? undefined,
    address: getString(formData.get('address')) ?? undefined,
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  if (parsed.data.email) {
    const existingEmail = await prisma.stationOwner.findUnique({ where: { email: parsed.data.email } });
    if (existingEmail && existingEmail.id !== owner.id) {
      return NextResponse.json(
        { message: 'Validation error', errors: { email: ['The email has already been taken.'] } },
        { status: 422 }
      );
    }
  }

  if (parsed.data.phone_number) {
    const existingPhone = await prisma.stationOwner.findUnique({ where: { phone_number: parsed.data.phone_number } });
    if (existingPhone && existingPhone.id !== owner.id) {
      return NextResponse.json(
        { message: 'Validation error', errors: { phone_number: ['The phone number has already been taken.'] } },
        { status: 422 }
      );
    }
  }

  const profileImage = getFile(formData.get('profile_image'));
  let profileImageUrl: string | undefined;
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
    profileImageUrl = await uploadToS3(profileImage, {
      prefix: 'station-owners',
      maxBytes: 10 * 1024 * 1024,
    });
  }

  const updated = await prisma.stationOwner.update({
    where: { id: owner.id },
    data: {
      full_name: parsed.data.full_name,
      phone_number: parsed.data.phone_number,
      email: parsed.data.email,
      address: parsed.data.address,
      profile_image_url: profileImageUrl,
    },
    include: { gasStations: true },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const owner = await prisma.stationOwner.findUnique({ where: { id: Number(id) } });
  if (!owner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.stationOwner.delete({ where: { id: owner.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
