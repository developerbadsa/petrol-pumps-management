import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';

const TOKEN_BYTES = 32;

export function hashToken(raw: string) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function generateToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString('hex');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function getBearerToken(req: Request) {
  const header = req.headers.get('authorization') ?? '';
  if (!header.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  return header.slice(7).trim();
}

export async function createApiToken(userId: number) {
  const raw = generateToken();
  const tokenHash = hashToken(raw);
  await prisma.apiToken.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
    },
  });
  return raw;
}

export async function revokeToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  await prisma.apiToken.updateMany({
    where: { token_hash: tokenHash, revoked_at: null },
    data: { revoked_at: new Date() },
  });
}

export async function getAuthenticatedUser(req: Request) {
  const rawToken = getBearerToken(req);
  if (!rawToken) {
    return null;
  }
  const tokenHash = hashToken(rawToken);
  const token = await prisma.apiToken.findFirst({
    where: { token_hash: tokenHash, revoked_at: null },
    include: { user: true },
  });
  if (!token) {
    return null;
  }
  return { user: token.user, token };
}
