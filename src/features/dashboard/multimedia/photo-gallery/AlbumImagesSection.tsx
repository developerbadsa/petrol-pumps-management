'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Loader from '@/components/shared/Loader';
import {normalizeList} from '@/lib/http/normalize';
import {toAbsoluteUrl} from '@/lib/http/url';

type AlbumImageApiRow = {
   id: number | string;
   album_id?: number | string | null;
   image_url?: string | null;
   url?: string | null;
   file_url?: string | null;
   image?: string | null;
   image_path?: string | null;
};

type AlbumApiResponse = {
   id?: number | string | null;
   title?: string | null;
   images?: AlbumImageApiRow[] | null;
};

type AlbumImageRow = {
   id: number;
   url: string;
};

function normalizeAlbum(raw: any): AlbumApiResponse | null {
   if (!raw) return null;
   if (raw?.data && !Array.isArray(raw.data))
      return raw.data as AlbumApiResponse;
   if (raw?.data?.data && !Array.isArray(raw.data.data))
      return raw.data.data as AlbumApiResponse;
   return raw as AlbumApiResponse;
}

function mapRow(row: AlbumImageApiRow): AlbumImageRow | null {
   const idNum = Number(row.id);
   if (!Number.isFinite(idNum)) return null;

   const origin =
      process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
      'https://admin.petroleumstationbd.com';
   const rel = (
      row.image_url ??
      row.file_url ??
      row.url ??
      row.image ??
      row.image_path ??
      ''
   )
      .toString()
      .trim();

   if (!rel) return null;

   return {
      id: idNum,
      url: toAbsoluteUrl(origin, rel),
   };
}

export default function AlbumImagesSection({albumId}: {albumId: string}) {
   const router = useRouter();
   const [items, setItems] = useState<AlbumImageRow[]>([]);
   const [albumTitle, setAlbumTitle] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [uploading, setUploading] = useState(false);
   const [file, setFile] = useState<File | null>(null);
   const [error, setError] = useState('');
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const gridItems = useMemo(() => items, [items]);

   const load = async () => {
      setLoading(true);
      setError('');
      try {
         const res = await fetch(`/api/albums/${encodeURIComponent(albumId)}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {Accept: 'application/json'},
         });

         const raw = await res.json().catch(() => null);
         if (!res.ok) {
            setError(raw?.message ?? 'Failed to load album images');
            return;
         }

         const album = normalizeAlbum(raw);
         const rows = normalizeList<AlbumImageApiRow>(album?.images ?? []);
         const next = rows.map(mapRow).filter(Boolean) as AlbumImageRow[];
         setItems(next);
         setAlbumTitle((album?.title ?? '').toString().trim() || null);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      void load();
   }, [albumId]);

   const onUpload = async () => {
      setError('');
      if (!file) {
         setError('Please select an image first');
         return;
      }

      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
         setError('Image must be PNG, JPG, or WEBP');
         return;
      }

      if (file.size > 10 * 1024 * 1024) {
         setError('Image must be 10MB or smaller');
         return;
      }

      setUploading(true);
      try {
         const fd = new FormData();
         fd.set('album_id', albumId);
         fd.set('image', file);

         const res = await fetch('/api/album-images', {
            method: 'POST',
            headers: {Accept: 'application/json'},
            body: fd,
         });

         const data = await res.json().catch(() => null);
         if (!res.ok) {
            setError(data?.message ?? 'Failed to upload image');
            return;
         }

         setFile(null);
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
         }
         await load();
      } finally {
         setUploading(false);
      }
   };

   const onDelete = async (id: number) => {
      const ok = window.confirm('Remove this image?');
      if (!ok) return;

      const snapshot = items;
      setItems(prev => prev.filter(item => item.id !== id));

      try {
         const res = await fetch(`/api/album-images/${id}`, {
            method: 'DELETE',
            headers: {Accept: 'application/json'},
         });

         if (!res.ok) {
            const data = await res.json().catch(() => null);
            setItems(snapshot);
            setError(data?.message ?? 'Failed to delete image');
         }
      } catch {
         setItems(snapshot);
         setError('Network error. Please try again.');
      }
   };

   return (
      <section className='min-w-0 space-y-6'>
         <div className='flex items-center justify-between'>
            <button
               type='button'
               onClick={() => router.back()}
               className='inline-flex h-9 items-center rounded-[6px] border border-[#E5E7EB] px-3 text-[12px] font-medium text-[#2B3A4A]'>
               Back
            </button>
            <h2 className='text-center text-[16px] font-semibold text-[#2B3A4A]'>
               Album Images {albumTitle ? `- ${albumTitle}` : `(#${albumId})`}
            </h2>
            <div className='w-[68px]' />
         </div>

         <div className='rounded-[8px] border border-[#E5E7EB] bg-white p-4'>
            <div className='flex flex-wrap items-center gap-3'>
               <div className="border border-[#E5E7EB] rounded-[6px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#F3F4F6]'>">
                  <input
                     type='file'
                     accept='image/*'
                     ref={fileInputRef}
                     onChange={e => setFile(e.target.files?.[0] ?? null)}
                     className='text-[12px] '
                  />
                  <svg
                     xmlns='http://www.w3.org/2000/svg'
                     width='24'
                     height='24'
                     viewBox='0 0 24 24'
                     fill='none'
                     stroke='currentColor'
                     stroke-width='2'
                     stroke-linecap='round'
                     stroke-linejoin='round'
                     className='lucide lucide-cloud-upload-icon lucide-cloud-upload'>
                     <path d='M12 13v8' />
                     <path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242' />
                     <path d='m8 17 4-4 4 4' />
                  </svg>
               </div>
               <button
                  type='button'
                  onClick={onUpload}
                  disabled={uploading}
                  className='inline-flex h-9 items-center rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white disabled:opacity-60'>
                  {uploading ? 'Uploading...' : 'Upload Image'}
               </button>
            </div>
            {error ? (
               <p className='mt-2 text-[12px] font-medium text-red-600'>
                  {error}
               </p>
            ) : null}
         </div>

         {loading ? <Loader label='Loading...' /> : null}

         {!loading && gridItems.length === 0 ? (
            <p className='text-center text-[12px] text-[#7B8EA3]'>
               No images found.
            </p>
         ) : null}

         <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {gridItems.map(item => (
               <div
                  key={item.id}
                  className='rounded-[10px] border border-[#E5E7EB] bg-white p-3'>
                  <div className='aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[#F8FAFC]'>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        src={item.url}
                        alt='Album image'
                        className='h-full w-full object-cover'
                     />
                  </div>
                  <div className='mt-3 flex items-center justify-between'>
                     <span className='text-[11px] text-[#64748B]'>
                        Image #{item.id}
                     </span>
                     <button
                        type='button'
                        onClick={() => onDelete(item.id)}
                        className='h-7 rounded-[4px] bg-[#FC7160] px-3 text-[11px] font-semibold text-white'>
                        Delete
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
