import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  division_id: z.coerce.number().int().optional(),
  name: z.string().min(1).optional(),
  is_active: z.coerce.boolean().optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const district = await prisma.district.findUnique({
    where: { id: Number(id) },
    include: { division: true },
  });
  if (!district) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(district, { status: 200 });
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
  const district = await prisma.district.findUnique({ where: { id: Number(id) } });
  if (!district) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  if (parsed.data.division_id) {
    const division = await prisma.division.findUnique({ where: { id: parsed.data.division_id } });
    if (!division) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }

  const updated = await prisma.district.update({
    where: { id: district.id },
    data: {
      division_id: parsed.data.division_id,
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
  const district = await prisma.district.findUnique({ where: { id: Number(id) } });
  if (!district) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.district.delete({ where: { id: district.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
