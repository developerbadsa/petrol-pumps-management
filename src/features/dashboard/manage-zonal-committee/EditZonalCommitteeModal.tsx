'use client';

import {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/ui/modal/Modal';
import {useDivisionOptions, useUpdateZonalCommitteeMember} from './queries';
import type {ZonalCommitteeRow} from './types';

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

type Props = {
   open: boolean;
   onClose: () => void;
   value: ZonalCommitteeRow | null;
};

export default function EditZonalCommitteeModal({open, onClose, value}: Props) {
   const updateM = useUpdateZonalCommitteeMember();
   const divisionsQ = useDivisionOptions();

   const [divisionId, setDivisionId] = useState<number | null>(null);

   const [positionName, setPositionName] = useState('');
   const [positionSlug, setPositionSlug] = useState('');
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
      if (!open || !value) return;

      setDivisionId(value.divisionId ?? null);
      setPositionName(value.positionName ?? '');
      setPositionSlug(value.positionSlug ?? '');
      setPositionOrder(value.positionOrder ?? 1);

      setFullName(value.fullName ?? '');
      setDesignation(value.designation ?? '');
      setCompanyName(value.companyName ?? '');

      setFacebookUrl(value.facebookUrl ?? '');
      setLinkedinUrl(value.linkedinUrl ?? '');
      setWhatsappUrl(value.whatsappUrl ?? '');

      setIsActive(Boolean(value.isActive));
      setProfileImage(null);
   }, [open, value]);

   useEffect(() => {
      if (!open || !value) return;
      if (divisionId) return;
      if (divisionsQ.data?.length) {
         setDivisionId(value.divisionId ?? divisionsQ.data[0].id);
      }
   }, [divisionId, divisionsQ.data, open, value]);

   const canSave = useMemo(() => {
      if (!value) return false;
      if (!divisionId) return false;
      if (!positionName.trim()) return false;
      if (!positionSlug.trim()) return false;
      if (!Number.isFinite(positionOrder) || positionOrder <= 0) return false;
      if (!fullName.trim()) return false;
      if (!designation.trim()) return false;
      if (!companyName.trim()) return false;

      if (profileImage && profileImage.size > 10 * 1024 * 1024) return false;
      return true;
   }, [
      value,
      divisionId,
      positionName,
      positionSlug,
      positionOrder,
      fullName,
      designation,
      companyName,
      profileImage,
   ]);

   return (
      <Modal
         open={open}
         title='Edit Zonal Committee'
         onClose={onClose}
         maxWidthClassName='max-w-[920px]'>
         <div className='p-5'>
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
                        if (!positionSlug.trim()) setPositionSlug(slugify(v));
                     }}
                     placeholder='President'
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Position Slug*
                  </label>
                  <input
                     className={fieldBase}
                     value={positionSlug}
                     onChange={(e) => setPositionSlug(slugify(e.target.value))}
                     placeholder='president'
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
                  />
               </div>

               <div>
                  <label className='text-[11px] font-semibold text-[#334155]'>
                     Profile Image (optional, max 10MB)
                  </label>
                  <input
                     className={fieldBase}
                     type='file'
                     accept='image/*'
                     onChange={(e) =>
                        setProfileImage(e.target.files?.[0] ?? null)
                     }
                  />
                  {profileImage && profileImage.size > 10 * 1024 * 1024 ? (
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
                  />
               </div>
            </div>

            {divisionsQ.isError ? (
               <div className='mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-700'>
                  {(divisionsQ.error as Error)?.message ??
                     'Failed to load divisions.'}
               </div>
            ) : null}

            {updateM.isError ? (
               <div className='mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-700'>
                  {(updateM.error as Error)?.message ??
                     'Failed to update zonal committee member.'}
               </div>
            ) : null}

            <div className='mt-6 flex items-center justify-end gap-3'>
               <button
                  type='button'
                  onClick={onClose}
                  className='h-9 rounded-[8px] border border-black/10 bg-white px-4 text-[12px] font-medium text-[#475569]'>
                  Cancel
               </button>

               <button
                  type='button'
                  disabled={!canSave || updateM.isPending}
                  onClick={() => {
                     if (!value || !divisionId) return;

                     updateM.mutate(
                        {
                           id: value.id,
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
                  }}
                  className='h-9 rounded-[8px] bg-[#009970] px-5 text-[12px] font-semibold text-white disabled:opacity-60'>
                  {updateM.isPending ? 'Saving...' : 'Save'}
               </button>
            </div>
         </div>
      </Modal>
   );
}
