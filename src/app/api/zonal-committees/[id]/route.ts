import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  division_id: z.coerce.number().int().optional(),
  position_name: z.string().min(1).optional(),
  position_slug: z.string().min(1).optional(),
  position_order: z.coerce.number().int().optional(),
  full_name: z.string().min(1).optional(),
  designation: z.string().optional().nullable(),
  company_name: z.string().min(1).optional(),
  facebook_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  whatsapp_url: z.string().url().optional().nullable(),
  is_active: z.coerce.boolean().optional(),
});

function parseBoolean(value: string | null) {
  if (value === null) return undefined;
  return ['1', 'true', 'on', 'yes'].includes(value.toLowerCase());
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const committee = await prisma.zonalCommittee.findUnique({
    where: { id: Number(id) },
    include: { division: true },
  });
  if (!committee) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(committee, { status: 200 });
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
  const existing = await prisma.zonalCommittee.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const payload = {
    division_id: getString(formData.get('division_id')) ?? undefined,
    position_name: getString(formData.get('position_name')) ?? undefined,
    position_slug: getString(formData.get('position_slug')) ?? undefined,
    position_order: getString(formData.get('position_order')) ?? undefined,
    full_name: getString(formData.get('full_name')) ?? undefined,
    designation: getString(formData.get('designation')) ?? undefined,
    company_name: getString(formData.get('company_name')) ?? undefined,
    facebook_url: getString(formData.get('facebook_url')) ?? undefined,
    linkedin_url: getString(formData.get('linkedin_url')) ?? undefined,
    whatsapp_url: getString(formData.get('whatsapp_url')) ?? undefined,
    is_active: parseBoolean(getString(formData.get('is_active'))),
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  if (parsed.data.division_id) {
    const division = await prisma.division.findUnique({ where: { id: parsed.data.division_id } });
    if (!division) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
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
      prefix: 'zonal-committees',
      maxBytes: 10 * 1024 * 1024,
    });
  }

  const committee = await prisma.zonalCommittee.update({
    where: { id: existing.id },
    data: {
      division_id: parsed.data.division_id,
      position_name: parsed.data.position_name,
      position_slug: parsed.data.position_slug,
      position_order: parsed.data.position_order,
      full_name: parsed.data.full_name,
      designation: parsed.data.designation ?? undefined,
      company_name: parsed.data.company_name,
      facebook_url: parsed.data.facebook_url ?? undefined,
      linkedin_url: parsed.data.linkedin_url ?? undefined,
      whatsapp_url: parsed.data.whatsapp_url ?? undefined,
      is_active: parsed.data.is_active ?? undefined,
      profile_image_url: profileImageUrl,
    },
    include: { division: true },
  });

  return NextResponse.json(committee, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.zonalCommittee.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.zonalCommittee.delete({ where: { id: existing.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
