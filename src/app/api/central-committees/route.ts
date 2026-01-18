import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const committeeSchema = z.object({
  position_name: z.string().min(1),
  position_slug: z.string().min(1),
  position_order: z.coerce.number().int(),
  full_name: z.string().min(1),
  designation: z.string().min(1),
  company_name: z.string().min(1),
  facebook_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  whatsapp_url: z.string().url().optional().nullable(),
  is_active: z.coerce.boolean().optional(),
});

function parseBoolean(value: string | null) {
  if (value === null) return undefined;
  return ['1', 'true', 'on', 'yes'].includes(value.toLowerCase());
}

export async function GET() {
  const committees = await prisma.centralCommittee.findMany({
    orderBy: [{ position_order: 'asc' }, { created_at: 'desc' }],
  });
  return NextResponse.json(committees, { status: 200 });
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const payload = {
    position_name: getString(formData.get('position_name')) ?? '',
    position_slug: getString(formData.get('position_slug')) ?? '',
    position_order: getString(formData.get('position_order')) ?? '',
    full_name: getString(formData.get('full_name')) ?? '',
    designation: getString(formData.get('designation')) ?? '',
    company_name: getString(formData.get('company_name')) ?? '',
    facebook_url: getString(formData.get('facebook_url')) ?? undefined,
    linkedin_url: getString(formData.get('linkedin_url')) ?? undefined,
    whatsapp_url: getString(formData.get('whatsapp_url')) ?? undefined,
    is_active: parseBoolean(getString(formData.get('is_active'))),
  };

  const parsed = committeeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const profileImage = getFile(formData.get('profile_image'));
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

  const profileImageUrl = await uploadToS3(profileImage as File, {
    prefix: 'central-committees',
    maxBytes: 10 * 1024 * 1024,
  });

  const committee = await prisma.centralCommittee.create({
    data: {
      position_name: parsed.data.position_name,
      position_slug: parsed.data.position_slug,
      position_order: parsed.data.position_order,
      full_name: parsed.data.full_name,
      designation: parsed.data.designation,
      company_name: parsed.data.company_name,
      profile_image_url: profileImageUrl,
      facebook_url: parsed.data.facebook_url ?? null,
      linkedin_url: parsed.data.linkedin_url ?? null,
      whatsapp_url: parsed.data.whatsapp_url ?? null,
      is_active: parsed.data.is_active ?? true,
    },
  });

  return NextResponse.json(committee, { status: 200 });
}
