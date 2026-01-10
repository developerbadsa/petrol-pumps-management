import type {OwnerRow} from '../types';

const CARD_IMAGE_PATH = '/id-card/ID.jpg';

const loadImage = (src?: string) =>
   new Promise<HTMLImageElement | null>(resolve => {
      if (!src) {
         resolve(null);
         return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
   });

const resolvePhotoUrl = (url?: string) => {
   if (!url) return undefined;
   if (url.startsWith('data:image/svg')) return undefined;
   if (/^https?:\/\//i.test(url)) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
   }
   return url;
};

const drawRoundedRect = (
   ctx: CanvasRenderingContext2D,
   x: number,
   y: number,
   w: number,
   h: number,
   r: number
) => {
   ctx.beginPath();
   ctx.moveTo(x + r, y);
   ctx.lineTo(x + w - r, y);
   ctx.quadraticCurveTo(x + w, y, x + w, y + r);
   ctx.lineTo(x + w, y + h - r);
   ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
   ctx.lineTo(x + r, y + h);
   ctx.quadraticCurveTo(x, y + h, x, y + h - r);
   ctx.lineTo(x, y + r);
   ctx.quadraticCurveTo(x, y, x + r, y);
   ctx.closePath();
};

const drawCoverImage = (
   ctx: CanvasRenderingContext2D,
   image: HTMLImageElement,
   x: number,
   y: number,
   w: number,
   h: number
) => {
   const scale = Math.max(w / image.width, h / image.height);
   const sw = w / scale;
   const sh = h / scale;
   const sx = (image.width - sw) / 2;
   const sy = (image.height - sh) / 2;
   ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
};

const drawFittedText = (
   ctx: CanvasRenderingContext2D,
   text: string,
   x: number,
   y: number,
   maxWidth: number,
   fontWeight: number,
   fontSize: number
) => {
   let size = fontSize;
   ctx.font = `${fontWeight} ${size}px "Segoe UI", sans-serif`;
   while (ctx.measureText(text).width > maxWidth && size > 12) {
      size -= 1;
      ctx.font = `${fontWeight} ${size}px "Segoe UI", sans-serif`;
   }
   ctx.fillText(text, x, y);
};

const drawPhoto = (
   ctx: CanvasRenderingContext2D,
   photo: HTMLImageElement | null,
   frame: Rect
) => {
   ctx.save();
   ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
   ctx.shadowBlur = 18;
   ctx.shadowOffsetY = 6;
   ctx.fillStyle = '#FFFFFF';
   drawRoundedRect(ctx, frame.x, frame.y, frame.w, frame.h, 16);
   ctx.fill();
   ctx.restore();

   ctx.save();
   drawRoundedRect(
      ctx,
      frame.x + 6,
      frame.y + 6,
      frame.w - 12,
      frame.h - 12,
      12
   );
   ctx.clip();
   if (photo) {
      drawCoverImage(
         ctx,
         photo,
         frame.x + 6,
         frame.y + 6,
         frame.w - 12,
         frame.h - 12
      );
   } else {
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(frame.x + 6, frame.y + 6, frame.w - 12, frame.h - 12);
      ctx.fillStyle = '#111827';
      ctx.font = '600 16px "Segoe UI", sans-serif';
      ctx.fillText('Photo', frame.x + frame.w * 0.32, frame.y + frame.h * 0.55);
   }
   ctx.restore();
};

const drawQr = (ctx: CanvasRenderingContext2D, qr: HTMLImageElement | null, frame: Rect) => {
   ctx.save();
   ctx.fillStyle = 'rgba(255,255,255,0.92)';
   drawRoundedRect(ctx, frame.x, frame.y, frame.w, frame.h, 12);
   ctx.fill();
   ctx.restore();

   if (qr) {
      ctx.save();
      drawRoundedRect(ctx, frame.x + 4, frame.y + 4, frame.w - 8, frame.h - 8, 10);
      ctx.clip();
      ctx.drawImage(qr, frame.x + 4, frame.y + 4, frame.w - 8, frame.h - 8);
      ctx.restore();
   }
};

type Rect = {x: number; y: number; w: number; h: number};

const drawOwnerOverlay = (ctx: CanvasRenderingContext2D, owner: OwnerRow) => {
   const width = ctx.canvas.width;
   const height = ctx.canvas.height;
   const frontHeight = height / 2;

   const nameText = owner.ownerName ?? '—';
   const memberIdText = owner.memberId ?? owner.id ?? '—';

   const photoFrame: Rect = {
      x: width * 0.065,
      y: frontHeight * 0.42,
      w: width * 0.15,
      h: frontHeight * 0.34,
   };

   const qrFrame: Rect = {
      x: width * 0.79,
      y: frontHeight * 0.46,
      w: width * 0.135,
      h: frontHeight * 0.26,
   };

   ctx.fillStyle = '#1F2937';
   drawFittedText(
      ctx,
      nameText,
      width * 0.34,
      frontHeight * 0.55,
      width * 0.52,
      700,
      Math.round(width * 0.03)
   );

   ctx.fillStyle = '#111827';
   drawFittedText(
      ctx,
      memberIdText,
      width * 0.415,
      frontHeight * 0.64,
      width * 0.28,
      600,
      Math.round(width * 0.026)
   );

   return {photoFrame, qrFrame};
};

export async function downloadOwnerCard(row: OwnerRow) {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   if (!ctx) return;

   const ownerId = row.id ?? '';
   const ownerUrl = ownerId
      ? `https://admin.petroleumstationbd.com/api/station-owners/${ownerId}`
      : '';
   const qrUrl = ownerUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
           ownerUrl
        )}`
      : '';

   const [card, photo, qr] = await Promise.all([
      loadImage(CARD_IMAGE_PATH),
      loadImage(resolvePhotoUrl(row.photoUrl)),
      loadImage(qrUrl),
   ]);

   const width = card?.width ?? 900;
   const height = card?.height ?? 560;
   canvas.width = width;
   canvas.height = height;

   if (card) {
      ctx.drawImage(card, 0, 0, width, height);
   } else {
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, width, height);
   }

   const {photoFrame, qrFrame} = drawOwnerOverlay(ctx, row);
   drawPhoto(ctx, photo, photoFrame);
   drawQr(ctx, qr, qrFrame);

   const link = document.createElement('a');
   link.download = `owner-card-${row.memberId ?? row.id}.png`;
   link.href = canvas.toDataURL('image/png');
   link.click();
}
