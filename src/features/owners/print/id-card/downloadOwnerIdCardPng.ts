'use client';

import QRCode from 'qrcode';
import type { OwnerRow } from '@/features/dashboard/owners/types';
import { FRONT_LAYOUT } from './layout';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadOwnerIdCardPng(row: OwnerRow) {
  const frontTpl = await loadImage('/id-card/front.jpg');

  const canvas = document.createElement('canvas');
  canvas.width = frontTpl.naturalWidth || frontTpl.width;
  canvas.height = frontTpl.naturalHeight || frontTpl.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  ctx.drawImage(frontTpl, 0, 0, W, H);

  if (row.photoUrl) {
    try {
      const photo = await loadImage(row.photoUrl);

      const px = FRONT_LAYOUT.photo.x * W;
      const py = FRONT_LAYOUT.photo.y * H;
      const pw = FRONT_LAYOUT.photo.w * W;
      const ph = FRONT_LAYOUT.photo.h * H;

      ctx.save();
      roundRectPath(ctx, px, py, pw, ph, FRONT_LAYOUT.photo.r);
      ctx.clip();
      ctx.drawImage(photo, px, py, pw, ph);
      ctx.restore();
    } catch {
      // ignore photo errors
    }
  }

  const memberId = row.memberId ?? row.id ?? '';
  ctx.fillStyle = '#2B2B2B';
  ctx.font = `700 ${Math.round(FRONT_LAYOUT.memberIdText.size)}px Arial`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(String(memberId), FRONT_LAYOUT.memberIdText.x * W, FRONT_LAYOUT.memberIdText.y * H);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrText = `${origin}/members/${row.memberId ?? row.id}`;
  const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 0, width: 600 });

  const qrImg = await loadImage(qrDataUrl);

  const qx = FRONT_LAYOUT.qr.x * W;
  const qy = FRONT_LAYOUT.qr.y * H;
  const qw = FRONT_LAYOUT.qr.w * W;
  const qh = FRONT_LAYOUT.qr.h * H;

  const pad = FRONT_LAYOUT.qr.pad;
  ctx.drawImage(qrImg, qx + pad, qy + pad, qw - pad * 2, qh - pad * 2);

  const filename = `member-id-card-${memberId || row.id}.png`;
  downloadDataUrl(canvas.toDataURL('image/png'), filename);
}
