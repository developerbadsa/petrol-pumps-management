import type {DivisionOption, ZonalCommitteeApiItem, ZonalCommitteeRow} from './types';

const LARAVEL_ORIGIN =
   process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
   'https://admin.petroleumstationbd.com';

function toAbsoluteUrl(pathOrUrl: string | null | undefined) {
   if (!pathOrUrl) return null;
   if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
   const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
   return `${LARAVEL_ORIGIN}${p}`;
}

function fallbackAvatar(name: string) {
   return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
   )}&size=128&background=E2E8F0&color=0F172A`;
}

function normalizeList(raw: unknown): ZonalCommitteeApiItem[] {
   if (Array.isArray(raw)) return raw as ZonalCommitteeApiItem[];
   if (Array.isArray((raw as {data?: ZonalCommitteeApiItem[]})?.data)) {
      return (raw as {data: ZonalCommitteeApiItem[]}).data;
   }
   return [];
}

function normalizeDivisions(raw: unknown): DivisionOption[] {
   if (Array.isArray(raw)) return raw as DivisionOption[];
   if (Array.isArray((raw as {data?: DivisionOption[]})?.data)) {
      return (raw as {data: DivisionOption[]}).data;
   }
   return [];
}

async function readJsonOrThrow(res: Response) {
   const data = await res.json().catch(() => null);
   if (!res.ok) throw new Error(data?.message ?? 'Request failed');
   return data;
}

function normalizeUrl(v?: string | null) {
   const t = (v ?? '').trim();
   if (!t) return '';
   if (/^https?:\/\//i.test(t)) return t;
   return `https://${t}`;
}

export type CreateZonalCommitteeInput = {
   divisionId: number;
   positionName: string;
   positionSlug: string;
   positionOrder: number;
   fullName: string;
   designation: string;
   companyName: string;
   isActive: boolean;
   profileImage: File;

   facebookUrl?: string;
   linkedinUrl?: string;
   whatsappUrl?: string;
};

export type ZonalCommitteeUpdateInput = {
   id: number;
   divisionId: number;

   positionName: string;
   positionSlug: string;
   positionOrder: number;
   fullName: string;
   designation: string;
   companyName: string;
   isActive: boolean;

   profileImage?: File | null;

   facebookUrl?: string;
   linkedinUrl?: string;
   whatsappUrl?: string;
};

export const zonalCommitteeRepo = {
   async list(): Promise<ZonalCommitteeRow[]> {
      const res = await fetch('/api/zonal-committees', {cache: 'no-store'});
      const raw = await readJsonOrThrow(res);
      const list = normalizeList(raw);

      const rows = list.map((m) => {
         const profileImageUrl = toAbsoluteUrl(m.profile_image);
         const divisionName =
            m.division?.name ??
            m.division_name ??
            (m.division_id ? `Division ${m.division_id}` : 'Unknown Division');

         return {
            id: m.id,
            divisionId: Number(m.division_id),
            divisionName,

            fullName: m.full_name,
            designation: m.designation,
            companyName: m.company_name,

            positionName: m.position_name,
            positionSlug: m.position_slug,
            positionOrder: Number(m.position_order),

            isActive: Boolean(m.is_active),

            profileImageUrl,
            avatarUrl: profileImageUrl ?? fallbackAvatar(m.full_name),

            facebookUrl: m.facebook_url ?? null,
            linkedinUrl: m.linkedin_url ?? null,
            whatsappUrl: m.whatsapp_url ?? null,
         };
      });

      return rows.sort(
         (a, b) => (a.positionOrder ?? 0) - (b.positionOrder ?? 0)
      );
   },

   async listDivisions(): Promise<DivisionOption[]> {
      const res = await fetch('/api/settings/divisions', {cache: 'no-store'});
      const raw = await readJsonOrThrow(res);
      return normalizeDivisions(raw).sort((a, b) =>
         a.name.localeCompare(b.name)
      );
   },

   async create(input: CreateZonalCommitteeInput) {
      const fd = new FormData();

      fd.set('division_id', String(input.divisionId));
      fd.set('position_name', input.positionName);
      fd.set('position_slug', input.positionSlug);
      fd.set('position_order', String(input.positionOrder));
      fd.set('full_name', input.fullName);
      fd.set('designation', input.designation);
      fd.set('company_name', input.companyName);
      fd.set('is_active', input.isActive ? '1' : '0');

      fd.set('profile_image', input.profileImage);

      const fb = normalizeUrl(input.facebookUrl);
      const ln = normalizeUrl(input.linkedinUrl);
      const wa = normalizeUrl(input.whatsappUrl);

      if (fb) fd.set('facebook_url', fb);
      if (ln) fd.set('linkedin_url', ln);
      if (wa) fd.set('whatsapp_url', wa);

      const res = await fetch('/api/zonal-committees', {
         method: 'POST',
         body: fd,
      });

      return readJsonOrThrow(res);
   },

   async update(input: ZonalCommitteeUpdateInput) {
      const fd = new FormData();

      fd.set('division_id', String(input.divisionId));
      fd.set('position_name', input.positionName);
      fd.set('position_slug', input.positionSlug);
      fd.set('position_order', String(input.positionOrder));
      fd.set('full_name', input.fullName);
      fd.set('designation', input.designation);
      fd.set('company_name', input.companyName);
      fd.set('is_active', input.isActive ? '1' : '0');

      const fb = normalizeUrl(input.facebookUrl);
      const ln = normalizeUrl(input.linkedinUrl);
      const wa = normalizeUrl(input.whatsappUrl);

      if (fb) fd.set('facebook_url', fb);
      if (ln) fd.set('linkedin_url', ln);
      if (wa) fd.set('whatsapp_url', wa);

      if (input.profileImage) fd.set('profile_image', input.profileImage);

      fd.set('_method', 'PUT');

      const res = await fetch(`/api/zonal-committees/${input.id}`, {
         method: 'POST',
         body: fd,
      });

      return readJsonOrThrow(res);
   },

   async remove(id: number): Promise<void> {
      const res = await fetch(`/api/zonal-committees/${id}`, {
         method: 'DELETE',
      });

      await readJsonOrThrow(res);
   },
};
