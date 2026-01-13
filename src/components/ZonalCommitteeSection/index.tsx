'use client';

import {useEffect, useMemo, useState} from 'react';
import type {StaticImageData} from 'next/image';
import CommitteeMemberCard from '../shared/CentralCommitteeSection/CommitteeMemberCard';
import leaderImg1 from '@assets/leader-img/md-serajul-mawla.png';

type SocialKind = 'facebook' | 'twitter' | 'linkedin' | 'phone';

export type CommitteeMember = {
   id: string;
   role: string;
   name: string;
   descriptionLines: string[];
   photo: StaticImageData | string;
   socials: {kind: SocialKind; href: string}[];
};

type DivisionOption = {
   id: number;
   name: string;
};

type ZonalCommitteeApiItem = {
   id: number;
   division_id: number;
   position_name: string;
   position_order: number;
   full_name: string;
   designation: string;
   company_name: string;
   profile_image: string | null;
   facebook_url: string | null;
   linkedin_url: string | null;
   whatsapp_url: string | null;
   is_active: boolean;
};

type ZonalCommitteeResponse = {
   districts?: string[];
   members?: ZonalCommitteeApiItem[];
};

const LARAVEL_ORIGIN =
   process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
   'https://admin.petroleumstationbd.com';

function toAbsoluteUrl(pathOrUrl: string | null | undefined) {
   if (!pathOrUrl) return null;
   if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
   const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
   return `${LARAVEL_ORIGIN}${p}`;
}

function normalizeDivisions(raw: unknown): DivisionOption[] {
   if (Array.isArray(raw)) return raw as DivisionOption[];
   if (Array.isArray((raw as {data?: DivisionOption[]})?.data)) {
      return (raw as {data: DivisionOption[]}).data;
   }
   return [];
}

function normalizeMembers(raw: unknown): ZonalCommitteeApiItem[] {
   if (Array.isArray(raw)) return raw as ZonalCommitteeApiItem[];
   if (Array.isArray((raw as {members?: ZonalCommitteeApiItem[]})?.members)) {
      return (raw as {members: ZonalCommitteeApiItem[]}).members;
   }
   return [];
}

function buildDescriptionLines(designation?: string, company?: string) {
   return [designation, company].filter(Boolean) as string[];
}

function buildSocials(item: ZonalCommitteeApiItem) {
   const socials: {kind: SocialKind; href: string}[] = [];
   if (item.facebook_url)
      socials.push({kind: 'facebook', href: item.facebook_url});
   if (item.linkedin_url)
      socials.push({kind: 'linkedin', href: item.linkedin_url});
   if (item.whatsapp_url) socials.push({kind: 'phone', href: item.whatsapp_url});
   return socials;
}

function DivisionTabs({
   divisions,
   value,
   onChange,
}: {
   divisions: DivisionOption[];
   value: number | null;
   onChange: (id: number) => void;
}) {
   return (
      <div className='mt-7'>
         <div
            className='
          flex items-center gap-3
          overflow-x-auto pb-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        '>
            {divisions.map((division) => {
               const active = division.id === value;

               return (
                  <button
                     key={division.id}
                     type='button'
                     onClick={() => onChange(division.id)}
                     className={[
                        'shrink-0 rounded-full px-6 py-2 text-[12px] font-semibold tracking-[0.18em] transition-all',
                        'shadow-[0_10px_25px_rgba(0,0,0,0.10)]',
                        active
                           ? 'bg-[#2D8A2D] text-white'
                           : 'bg-[#CFE5C9] text-[#0C2F22] hover:bg-[#BFE0B8]',
                     ].join(' ')}
                     aria-pressed={active}>
                     {division.name.toUpperCase()}
                  </button>
               );
            })}
         </div>
      </div>
   );
}

export default function ZonalCommitteeSection() {
   const [divisions, setDivisions] = useState<DivisionOption[]>([]);
   const [activeDivisionId, setActiveDivisionId] = useState<number | null>(null);
   const [members, setMembers] = useState<CommitteeMember[]>([]);
   const [districts, setDistricts] = useState<string[]>([]);
   const [loadingDivisions, setLoadingDivisions] = useState(true);
   const [loadingMembers, setLoadingMembers] = useState(false);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   useEffect(() => {
      let active = true;
      const controller = new AbortController();

      const loadDivisions = async () => {
         try {
            setLoadingDivisions(true);
            setErrorMsg(null);

            const res = await fetch('/api/public/divisions', {
               cache: 'no-store',
               signal: controller.signal,
            });

            if (!res.ok) {
               throw new Error(`Request failed (${res.status})`);
            }

            const raw = await res.json();
            const list = normalizeDivisions(raw);

            if (!active) return;
            setDivisions(list);
            setActiveDivisionId((prev) =>
               prev ?? (list.length ? list[0].id : null)
            );
         } catch (error) {
            if ((error as DOMException).name === 'AbortError') return;
            if (!active) return;
            setErrorMsg(
               (error as Error).message || 'Failed to load divisions'
            );
            setDivisions([]);
            setActiveDivisionId(null);
         } finally {
            if (active) setLoadingDivisions(false);
         }
      };

      loadDivisions();

      return () => {
         active = false;
         controller.abort();
      };
   }, []);

   useEffect(() => {
      if (!activeDivisionId) {
         setMembers([]);
         setDistricts([]);
         return;
      }

      let active = true;
      const controller = new AbortController();

      const loadMembers = async () => {
         try {
            setLoadingMembers(true);
            setErrorMsg(null);

            const res = await fetch(
               `/api/public/zonal-committees?division_id=${activeDivisionId}`,
               {
                  cache: 'no-store',
                  signal: controller.signal,
               }
            );

            if (!res.ok) {
               throw new Error(`Request failed (${res.status})`);
            }

            const raw = (await res.json()) as ZonalCommitteeResponse;
            const list = normalizeMembers(raw)
               .filter((item) => item.is_active)
               .sort((a, b) => {
                  const orderA = Number.isFinite(Number(a.position_order))
                     ? Number(a.position_order)
                     : Number.POSITIVE_INFINITY;
                  const orderB = Number.isFinite(Number(b.position_order))
                     ? Number(b.position_order)
                     : Number.POSITIVE_INFINITY;
                  if (orderA !== orderB) return orderA - orderB;
                  return Number(b.id) - Number(a.id);
               })
               .map((item) => {
                  const photoUrl = toAbsoluteUrl(item.profile_image);
                  return {
                     id: String(item.id),
                     role:
                        item.position_name?.toUpperCase?.() ??
                        'COMMITTEE MEMBER',
                     name: item.full_name,
                     descriptionLines: buildDescriptionLines(
                        item.designation,
                        item.company_name
                     ),
                     photo: photoUrl ?? leaderImg1,
                     socials: buildSocials(item),
                  } satisfies CommitteeMember;
               });

            if (!active) return;
            setMembers(list);
            setDistricts(
               Array.isArray(raw?.districts) ? raw.districts : []
            );
         } catch (error) {
            if ((error as DOMException).name === 'AbortError') return;
            if (!active) return;
            setErrorMsg(
               (error as Error).message || 'Failed to load zonal members'
            );
            setMembers([]);
            setDistricts([]);
         } finally {
            if (active) setLoadingMembers(false);
         }
      };

      loadMembers();

      return () => {
         active = false;
         controller.abort();
      };
   }, [activeDivisionId]);

   const renderedMembers = useMemo(() => members, [members]);

   return (
      <section className='relative overflow-hidden bg-white py-16'>
         <div className='pointer-events-none absolute inset-0 opacity-[0.12]'>
            <div
               className='
            absolute inset-0
            bg-[radial-gradient(circle_at_20%_10%,#2D8A2D40,transparent_55%)]
          '
            />
            <div
               className='
            absolute inset-0
            bg-[radial-gradient(circle_at_85%_25%,#1B5FAE40,transparent_55%)]
          '
            />
         </div>

         <div className='lpg-container relative'>
            <div className='mx-auto text-center'>
               <h2 className='text-[28px] font-semibold tracking-tight text-[#133374] md:text-[34px]'>
                  Zonal Committee ( 2023 - 2025 )
               </h2>
               <p className='mt-2 text-[12px] leading-relaxed text-[#8A9CB0] md:text-[13px]'>
                  There are 11 zonal committees of our association to accelerate
                  our activities all over the country.
               </p>

               {loadingDivisions ? (
                  <div className='mt-6 text-[12px] text-[#7B8C9C]'>
                     Loading divisions...
                  </div>
               ) : divisions.length ? (
                  <DivisionTabs
                     divisions={divisions}
                     value={activeDivisionId}
                     onChange={setActiveDivisionId}
                  />
               ) : null}

               {districts.length ? (
                  <p className='mt-4 text-[12px] text-[#6B7C91]'>
                     Districts: {districts.join(', ')}
                  </p>
               ) : null}
            </div>

            <div className='mt-10'>
               {errorMsg ? (
                  <div className='mt-10 rounded-[18px] border border-red-200 bg-red-50 p-6 text-center text-[13px] text-red-700'>
                     {errorMsg}
                  </div>
               ) : loadingMembers ? (
                  <div className='mt-10 rounded-[18px] border border-[#E3EDF5] bg-white p-8 text-center'>
                     <p className='text-[13px] text-[#7B8C9C]'>
                        Loading members...
                     </p>
                  </div>
               ) : renderedMembers.length ? (
                  <div className='grid gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                     {renderedMembers.map((m) => (
                        <CommitteeMemberCard key={m.id} member={m} />
                     ))}
                  </div>
               ) : (
                  <div className='mt-10 rounded-[18px] border border-[#E3EDF5] bg-white p-8 text-center'>
                     <p className='text-[13px] text-[#7B8C9C]'>
                        No members added for this zone yet.
                     </p>
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
