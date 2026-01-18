import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const MAX_FILE_NAME = 80;

function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  return new S3Client({
    region: process.env.S3_REGION ?? 'auto',
    endpoint: endpoint || undefined,
    forcePathStyle: Boolean(endpoint),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    },
  });
}

export type UploadOptions = {
  prefix: string;
  maxBytes: number;
  allowedTypes?: string[];
};

export function validateFile(file: File | null, options: UploadOptions) {
  if (!file) {
    return `The ${options.prefix} field is required.`;
  }
  if (file.size > options.maxBytes) {
    return `The ${options.prefix} field exceeds the maximum size.`;
  }
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return `The ${options.prefix} field must be a valid file type.`;
  }
  return null;
}

export async function uploadToS3(file: File, options: UploadOptions) {
  const bucket = process.env.S3_BUCKET ?? '';
  const publicBaseUrl = process.env.S3_PUBLIC_URL ?? '';
  const extension = file.name.split('.').pop() ?? 'bin';
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, MAX_FILE_NAME);
  const key = `${options.prefix}/${Date.now()}-${crypto.randomUUID()}-${safeName || 'upload'}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }
  return `https://${bucket}.s3.amazonaws.com/${key}`;
}
