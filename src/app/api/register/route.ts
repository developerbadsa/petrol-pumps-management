import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createApiToken, hashPassword } from '@/lib/auth';
import { bdPhoneRegex, getFile, getString, validationErrorResponse } from '@/lib/validation';
import { uploadToS3, validateFile } from '@/lib/upload';
import { z } from 'zod';

export const runtime = 'nodejs';

const registerSchema = z
  .object({
    full_name: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
    phone_number: z.string().regex(bdPhoneRegex, 'Invalid phone number'),
    username: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  });

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function generateUniqueUsername(base: string) {
  let attempt = `${slugify(base)}-${Math.floor(Math.random() * 10000)}`;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.user.findUnique({ where: { username: attempt } });
    if (!exists) {
      return attempt;
    }
    attempt = `${slugify(base)}-${Math.floor(Math.random() * 10000)}`;
  }
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const payload = {
      full_name: getString(formData.get('full_name')) ?? '',
      email: getString(formData.get('email')) ?? '',
      password: getString(formData.get('password')) ?? '',
      password_confirmation: getString(formData.get('password_confirmation')) ?? '',
      phone_number: getString(formData.get('phone_number')) ?? '',
      username: getString(formData.get('username')) ?? undefined,
      bio: getString(formData.get('bio')) ?? undefined,
      address: getString(formData.get('address')) ?? undefined,
    };

    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
    }

    const avatar = getFile(formData.get('avatar'));
    if (avatar) {
      const error = validateFile(avatar, {
        prefix: 'avatar',
        maxBytes: 2 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      });
      if (error) {
        return NextResponse.json({ message: 'Validation error', errors: { avatar: [error] } }, { status: 422 });
      }
    }

    const existingEmail = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Validation error', errors: { email: ['The email has already been taken.'] } },
        { status: 422 }
      );
    }
    const existingPhone = await prisma.user.findUnique({ where: { phone_number: parsed.data.phone_number } });
    if (existingPhone) {
      return NextResponse.json(
        { message: 'Validation error', errors: { phone_number: ['The phone number has already been taken.'] } },
        { status: 422 }
      );
    }

    let username = parsed.data.username;
    if (!username) {
      username = await generateUniqueUsername(parsed.data.full_name);
    } else {
      const existingUsername = await prisma.user.findUnique({ where: { username } });
      if (existingUsername) {
        return NextResponse.json(
          { message: 'Validation error', errors: { username: ['The username has already been taken.'] } },
          { status: 422 }
        );
      }
    }

    const avatarUrl = avatar
      ? await uploadToS3(avatar, { prefix: 'avatars', maxBytes: 2 * 1024 * 1024 })
      : null;

    const user = await prisma.user.create({
      data: {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone_number: parsed.data.phone_number,
        username,
        bio: parsed.data.bio,
        address: parsed.data.address,
        avatar_url: avatarUrl ?? undefined,
        password_hash: await hashPassword(parsed.data.password),
      },
    });

    const accessToken = await createApiToken(user.id);

    return NextResponse.json(
      {
        access_token: accessToken,
        token_type: 'Bearer',
        user,
      },
      { status: 200 }
    );
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 422 });
  }

  const existingEmail = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingEmail) {
    return NextResponse.json(
      { message: 'Validation error', errors: { email: ['The email has already been taken.'] } },
      { status: 422 }
    );
  }

  const existingPhone = await prisma.user.findUnique({ where: { phone_number: parsed.data.phone_number } });
  if (existingPhone) {
    return NextResponse.json(
      { message: 'Validation error', errors: { phone_number: ['The phone number has already been taken.'] } },
      { status: 422 }
    );
  }

  let username = parsed.data.username;
  if (!username) {
    username = await generateUniqueUsername(parsed.data.full_name);
  } else {
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Validation error', errors: { username: ['The username has already been taken.'] } },
        { status: 422 }
      );
    }
  }

  const user = await prisma.user.create({
    data: {
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone_number: parsed.data.phone_number,
      username,
      bio: parsed.data.bio,
      address: parsed.data.address,
      password_hash: await hashPassword(parsed.data.password),
    },
  });

  const accessToken = await createApiToken(user.id);

  return NextResponse.json(
    {
      access_token: accessToken,
      token_type: 'Bearer',
      user,
    },
    { status: 200 }
  );
}
