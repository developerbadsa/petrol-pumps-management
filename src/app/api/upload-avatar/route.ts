import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getFile } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const avatar = getFile(formData.get('avatar'));
  const error = validateFile(avatar, {
    prefix: 'avatar',
    maxBytes: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });

  if (error) {
    return NextResponse.json({ message: 'Validation error', errors: { avatar: [error] } }, { status: 422 });
  }

  const avatarUrl = await uploadToS3(avatar as File, {
    prefix: 'avatars',
    maxBytes: 10 * 1024 * 1024,
  });

  const user = await prisma.user.update({
    where: { id: auth.user.id },
    data: { avatar_url: avatarUrl },
  });

  return NextResponse.json(user, { status: 200 });
}
