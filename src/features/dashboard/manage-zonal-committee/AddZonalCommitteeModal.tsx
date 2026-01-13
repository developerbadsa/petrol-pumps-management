'use client';

import {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import {useCreateZonalCommitteeMember, useDivisionOptions} from './queries';

function slugify(v: string) {
   return v
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
}

const fieldBase =
   'h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[12px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#16B55B33]';

export default function AddZonalCommitteeModal({
   open,
   onClose,
}: {
   open: boolean;
   onClose: () => void;
}) {
   const createM = useCreateZonalCommitteeMember();
   const divisionsQ = useDivisionOptions();

   const [divisionId, setDivisionId] = useState<number | null>(null);

   const [positionName, setPositionName] = useState('');
   const [positionSlug, setPositionSlug] = useState('');
   const [slugTouched, setSlugTouched] = useState(false);
   const [positionOrder, setPositionOrder] = useState<number>(1);

   const [fullName, setFullName] = useState('');
   const [designation, setDesignation] = useState('');
   const [companyName, setCompanyName] = useState('');

   const [facebookUrl, setFacebookUrl] = useState('');
   const [linkedinUrl, setLinkedinUrl] = useState('');
   const [whatsappUrl, setWhatsappUrl] = useState('');

   const [isActive, setIsActive] = useState(true);
   const [profileImage, setProfileImage] = useState<File | null>(null);

   useEffect(() => {
      if (!open) return;

      setDivisionId(null);
      setPositionName('');
      setPositionSlug('');
      setSlugTouched(false);
      setPositionOrder(1);

      setFullName('');
      setDesignation('');
      setCompanyName('');

      setFacebookUrl('');
      setLinkedinUrl('');
      setWhatsappUrl('');

      setIsActive(true);
      setProfileImage(null);
   }, [open]);

   useEffect(() => {
      if (!open) return;
      if (divisionId) return;
      if (divisionsQ.data?.length) {
         setDivisionId(divisionsQ.data[0].id);
      }
   }, [divisionsQ.data, divisionId, open]);

   const fileTooLarge = Boolean(
      profileImage && profileImage.size > 10 * 1024 * 1024
   );

   const canSave = useMemo(() => {
      if (!divisionId) return false;
      if (!positionName.trim()) return false;
      if (!positionSlug.trim()) return false;
      if (!Number.isFinite(positionOrder) || positionOrder <= 0) return false;

      if (!fullName.trim()) return false;
      if (!designation.trim()) return false;
      if (!companyName.trim()) return false;

      if (!profileImage) return false;
      if (fileTooLarge) return false;

      return true;
   }, [
      divisionId,
      positionName,
      positionSlug,
      positionOrder,
      fullName,
      designation,
      companyName,
      profileImage,
      fileTooLarge,
   ]);

   return (
      <Modal
         open={open}
         title='Add Zonal Committee'
         onClose={() => {
            if (createM.isPending) return;
            onClose();
         }}
         maxWidthClassName='max-w-[920px]'>
         <form
            className='p-5'
            onSubmit={(e) => {
               e.preventDefault();
               if (!profileImage || !canSave || createM.isPending) return;
               if (!divisionId) return;

               createM.mutate(
                  {
                     divisionId,
                     positionName: positionName.trim(),
                     positionSlug: positionSlug.trim(),
                     positionOrder,
                     fullName: fullName.trim(),
                     designation: designation.trim(),
                     companyName: companyName.trim(),
                     isActive,
                     profileImage,
                     facebookUrl,
                     linkedinUrl,
                     whatsappUrl,
                  },
                  {onSuccess: onClose}
               );
            }}>
            <div className='grid gap-4 md:grid-cols-2'>
               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Division*
                  </label>
                  <select
                     className={fieldBase}
                     value={divisionId ?? ''}
                     onChange={(e) => setDivisionId(Number(e.target.value))}
                     disabled={divisionsQ.isLoading || !divisionsQ.data?.length}>
                     {!divisionsQ.data?.length ? (
                        <option value=''>No divisions available</option>
                     ) : null}
                     {divisionsQ.data?.map((division) => (
                        <option key={division.id} value={division.id}>
                           {division.name}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Position Name*
                  </label>
                  <input
                     className={fieldBase}
                     value={positionName}
                     onChange={(e) => {
                        const v = e.target.value;
                        setPositionName(v);
                        if (!slugTouched) setPositionSlug(slugify(v));
                     }}
                     placeholder='President'
                     autoComplete='off'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Position Slug*
                  </label>
                  <input
                     className={fieldBase}
                     value={positionSlug}
                     onChange={(e) => {
                        setSlugTouched(true);
                        setPositionSlug(slugify(e.target.value));
                     }}
                     placeholder='president'
                     autoComplete='off'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Position Order*
                  </label>
                  <input
                     className={fieldBase}
                     type='number'
                     min={1}
                     value={positionOrder}
                     onChange={(e) => setPositionOrder(Number(e.target.value))}
                     inputMode='numeric'
                  />
               </div>

               <div className='flex items-end gap-3'>
                  <label className='flex items-center gap-2 text-[12px] text-[#334155]'>
                     <input
                        type='checkbox'
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                     />
                     Is Active
                  </label>
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Full Name*
                  </label>
                  <input
                     className={fieldBase}
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     autoComplete='name'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Designation*
                  </label>
                  <input
                     className={fieldBase}
                     value={designation}
                     onChange={(e) => setDesignation(e.target.value)}
                     autoComplete='organization-title'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Company Name*
                  </label>
                  <input
                     className={fieldBase}
                     value={companyName}
                     onChange={(e) => setCompanyName(e.target.value)}
                     autoComplete='organization'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Profile Image* (max 10MB)
                  </label>

                  <input
                     className={fieldBase}
                     type='file'
                     accept='image/*'
                     onChange={(e) =>
                        setProfileImage(e.target.files?.[0] ?? null)
                     }
                  />

                  {!profileImage ? (
                     <div className='mt-1 text-[10px] text-[#64748B]'>
                        Profile image is required on create.
                     </div>
                  ) : null}

                  {fileTooLarge ? (
                     <div className='mt-1 text-[10px] text-red-600'>
                        File size must be under 10MB.
                     </div>
                  ) : null}
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Facebook URL (optional)
                  </label>
                  <input
                     className={fieldBase}
                     value={facebookUrl}
                     onChange={(e) => setFacebookUrl(e.target.value)}
                     placeholder='https://facebook.com/...'
                     autoComplete='off'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     LinkedIn URL (optional)
                  </label>
                  <input
                     className={fieldBase}
                     value={linkedinUrl}
                     onChange={(e) => setLinkedinUrl(e.target.value)}
                     placeholder='https://linkedin.com/in/...'
                     autoComplete='off'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     WhatsApp URL (optional)
                  </label>
                  <input
                     className={fieldBase}
                     value={whatsappUrl}
                     onChange={(e) => setWhatsappUrl(e.target.value)}
                     placeholder='https://wa.me/...'
                     autoComplete='off'
                  />
               </div>
            </div>

            {divisionsQ.isError ? (
               <div className='mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-700'>
                  {(divisionsQ.error as Error)?.message ??
                     'Failed to load divisions.'}
               </div>
            ) : null}

            {createM.isError ? (
               <div className='mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-700'>
                  {(createM.error as Error)?.message ??
                     'Failed to create zonal committee member.'}
               </div>
            ) : null}

            <div className='mt-6 flex items-center justify-end gap-3'>
               <button
                  type='button'
                  disabled={createM.isPending}
                  onClick={onClose}
                  className='h-9 rounded-[8px] border border-black/10 bg-white px-4 text-[12px] font-medium text-[#475569] disabled:opacity-60'>
                  Cancel
               </button>

               <button
                  type='submit'
                  disabled={!canSave || createM.isPending}
                  className='h-9 rounded-[8px] bg-[#009970] px-5 text-[12px] font-semibold text-white disabled:opacity-60'>
                  {createM.isPending ? 'Saving...' : 'Save'}
               </button>
            </div>
         </form>
      </Modal>
   );
}
