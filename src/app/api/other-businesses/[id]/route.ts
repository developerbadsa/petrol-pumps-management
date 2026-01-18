import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { validationErrorResponse } from '@/lib/validation';
import { resolveMethod } from '@/lib/methodOverride';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const business = await prisma.otherBusiness.findUnique({ where: { id: Number(id) } });
  if (!business) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(business, { status: 200 });
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
  const business = await prisma.otherBusiness.findUnique({ where: { id: Number(id) } });
  if (!business) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  if (parsed.data.name) {
    const exists = await prisma.otherBusiness.findUnique({ where: { name: parsed.data.name } });
    if (exists && exists.id !== business.id) {
      return NextResponse.json(
        { message: 'Validation error', errors: { name: ['The name has already been taken.'] } },
        { status: 422 }
      );
    }
  }

  const updated = await prisma.otherBusiness.update({
    where: { id: business.id },
    data: { name: parsed.data.name },
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const business = await prisma.otherBusiness.findUnique({ where: { id: Number(id) } });
  if (!business) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await prisma.otherBusiness.delete({ where: { id: business.id } });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
