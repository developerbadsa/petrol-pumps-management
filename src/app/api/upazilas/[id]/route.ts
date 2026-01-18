import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  district_id: z.coerce.number().int().optional(),
  name: z.string().min(1).optional(),
  is_active: z.coerce.boolean().optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const upazila = await prisma.upazila.findUnique({
    where: { id: Number(id) },
    include: { district: true },
  });
  if (!upazila) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(upazila, { status: 200 });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (resolveMethod(req) !== 'PUT') {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const { id } = await ctx.params;
  const upazila = await prisma.upazila.findUnique({ where: { id: Number(id) } });
  if (!upazila) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  if (parsed.data.district_id) {
    const district = await prisma.district.findUnique({ where: { id: parsed.data.district_id } });
    if (!district) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }

  const updated = await prisma.upazila.update({
    where: { id: upazila.id },
    data: {
      district_id: parsed.data.district_id,
      name: parsed.data.name,
      is_active: parsed.data.is_active ?? undefined,
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
  const upazila = await prisma.upazila.findUnique({ where: { id: Number(id) } });
  if (!upazila) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.upazila.delete({ where: { id: upazila.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
