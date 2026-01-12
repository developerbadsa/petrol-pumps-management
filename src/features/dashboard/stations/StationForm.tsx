'use client';

import {useEffect, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import Loader from '@/components/shared/Loader';
import {normalizeList} from '@/lib/http/normalize';
import {divisionRepo} from '@/features/dashboard/settings/division/repo';
import {districtRepo} from '@/features/dashboard/settings/district/repo';
import {upazilaRepo} from '@/features/dashboard/settings/upazila-thana/repo';
import {otherBusinessesRepo} from '@/features/dashboard/settings/other-businesses/repo';
import {getStationDetailsRepo} from './verified/repo';
import type {StationUpsertPayload} from './formData';
import {CloudUpload} from 'lucide-react';

export type Mode = 'create' | 'edit' | 'view';

type StationOwnerOption = {
   id: string;
   label: string;
};

type DatalistOption = {
   id: string;
   label: string;
};

type FormState = {
   station_owner_id: string;
   station_name: string;
   fuel_type: string;
   oil_company_name: string;
   station_type: string;
   station_status: string;
   business_type: string;
   dealership_agreement: string;
   division_id: string;
   district_id: string;
   upazila_id: string;
   station_address: string;
   commencement_date: string;
   contact_person_name: string;
   contact_person_phone: string;
   other_businesses: string[];
   verification_status: string;
   verified_by: string;
   verified_at: string;
   rejection_reason: string;
   nid: File | null;
   tin: File | null;
   explosive_license: File | null;
};

export type StationFormDefaults = Partial<
   Pick<
      FormState,
      | 'station_owner_id'
      | 'station_name'
      | 'station_address'
      | 'contact_person_name'
      | 'contact_person_phone'
   >
>;

const emptyForm: FormState = {
   station_owner_id: '',
   station_name: '',
   fuel_type: '',
   oil_company_name: '',
   station_type: '',
   station_status: 'Running',
   business_type: '',
   dealership_agreement: '',
   division_id: '',
   district_id: '',
   upazila_id: '',
   station_address: '',
   commencement_date: '',
   contact_person_name: '',
   contact_person_phone: '',
   other_businesses: [],
   verification_status: 'PENDING',
   verified_by: '',
   verified_at: '',
   rejection_reason: '',
   nid: null,
   tin: null,
   explosive_license: null,
};

const createDefaults: Pick<
   FormState,
   'station_status' | 'verification_status'
> = {
   station_status: 'Running',
   verification_status: 'PENDING',
};

function pick<T>(...vals: Array<T | null | undefined>) {
   for (const v of vals) if (v != null && v !== ('' as any)) return v;
   return undefined;
}

function str(v: unknown, fallback = '') {
   const s = String(v ?? '').trim();
   return s || fallback;
}

function toId(v: unknown) {
   if (v === null || v === undefined) return '';
   const n = Number(v);
   if (Number.isFinite(n)) return String(n);
   return str(v);
}

function toDateInput(value: unknown) {
   if (!value) return '';
   const s = String(value).trim();
   if (!s) return '';
   if (s.length >= 10) {
      const first = s.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
   }
   return '';
}

async function listStationOwners(): Promise<StationOwnerOption[]> {
   const res = await fetch('/api/station-owners', {
      method: 'GET',
      cache: 'no-store',
      headers: {Accept: 'application/json'},
   });

   const raw = await res.json().catch(() => null);
   if (!res.ok)
      throw new Error(raw?.message ?? 'Failed to load station owners');

   const rows = normalizeList<any>(raw);

   return rows.map(row => {
      const id = toId(row?.id);
      const user = row?.user ?? row?.owner?.user ?? row?.station_owner?.user;
      const name = str(
         pick(row?.full_name, user?.full_name, user?.name, row?.name),
         `Owner #${id}`
      );
      const phone = str(
         pick(row?.phone_number, user?.phone_number, row?.phone),
         ''
      );
      const label = phone ? `${name} (${phone})` : name;
      return {id, label};
   });
}

function mapOtherBusinesses(raw: any[]): string[] {
   if (!Array.isArray(raw)) return [];
   return raw
      .map(item => {
         if (item == null) return null;
         if (typeof item === 'number' || typeof item === 'string')
            return String(item);
         return toId(item?.id ?? item?.other_business_id ?? item?.business_id);
      })
      .filter(Boolean) as string[];
}

function mapStationDetailsToForm(data: any): FormState {
   const ownerId = toId(
      pick(
         data?.station_owner_id,
         data?.stationOwnerId,
         data?.station_owner?.id,
         data?.owner?.id
      )
   );

   const divisionId = toId(
      pick(
         data?.division_id,
         data?.divisionId,
         data?.division?.id,
         data?.location?.division_id
      )
   );
   const districtId = toId(
      pick(
         data?.district_id,
         data?.districtId,
         data?.district?.id,
         data?.location?.district_id
      )
   );
   const upazilaId = toId(
      pick(
         data?.upazila_id,
         data?.upazilaId,
         data?.upazila?.id,
         data?.location?.upazila_id
      )
   );

   return {
      station_owner_id: ownerId,
      station_name: str(
         pick(data?.station_name, data?.stationName, data?.name)
      ),
      fuel_type: str(data?.fuel_type),
      oil_company_name: str(data?.oil_company_name),
      station_type: str(data?.station_type),
      station_status: str(data?.station_status),
      business_type: str(data?.business_type),
      dealership_agreement: str(data?.dealership_agreement),
      division_id: divisionId,
      district_id: districtId,
      upazila_id: upazilaId,
      station_address: str(data?.station_address),
      commencement_date: toDateInput(data?.commencement_date),
      contact_person_name: str(data?.contact_person_name),
      contact_person_phone: str(data?.contact_person_phone),
      other_businesses: mapOtherBusinesses(
         pick(
            data?.other_businesses,
            data?.otherBusinesses,
            data?.other_business_ids
         )
      ),
      verification_status: str(data?.verification_status, 'PENDING'),
      verified_by: str(data?.verified_by),
      verified_at: toDateInput(data?.verified_at),
      rejection_reason: str(data?.rejection_reason),
      nid: null,
      tin: null,
      explosive_license: null,
   };
}

function toNumberOrUndefined(value: string) {
   if (!value) return undefined;
   const n = Number(value);
   return Number.isFinite(n) ? n : undefined;
}

function toDateOrUndefined(value: string) {
   if (!value) return undefined;
   const trimmed = value.trim();
   if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;
   return trimmed;
}

function isValidOptionId(options: Array<{id: string}>, value: string) {
   if (!value) return false;
   return options.some(o => o.id === value);
}

function DatalistInput({
   value,
   options,
   onValueChange,
   disabled,
   placeholder,
   listId,
   onBlur,
}: {
   value?: string;
   options: DatalistOption[];
   onValueChange: (value: string) => void;
   disabled?: boolean;
   placeholder?: string;
   listId: string;
   onBlur?: () => void;
}) {
   const [search, setSearch] = useState('');

   useEffect(() => {
      const match = options.find(option => option.id === value);
      const nextValue = match?.label ?? value ?? '';
      if (nextValue !== search) {
         setSearch(nextValue);
      }
   }, [options, search, value]);

   return (
      <>
         <input
            list={listId}
            value={search}
            onChange={e => {
               const inputValue = e.target.value;
               setSearch(inputValue);
               const match = options.find(
                  option =>
                     option.label === inputValue || option.id === inputValue
               );
               onValueChange(match ? match.id : inputValue);
            }}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
         />
         <datalist id={listId}>
            <option key={placeholder} value={placeholder} />
            {options.map(option => (
               <option key={option.id} value={option.label} />
            ))}
         </datalist>
      </>
   );
}

export default function StationForm({
   mode,
   stationId,
   saving,
   error,
   onCancel,
   onSubmit,
   enabled = true,
   initialValues,
}: {
   mode: Mode;
   stationId?: string | null;
   saving?: boolean;
   error?: string;
   onCancel: () => void;
   onSubmit: (payload: StationUpsertPayload) => void;
   enabled?: boolean;
   initialValues?: StationFormDefaults;
}) {
   const [form, setForm] = useState<FormState>(emptyForm);
   const [validationError, setValidationError] = useState<string | null>(null);
   const [touched, setTouched] = useState({
      division: false,
      district: false,
      upazila: false,
   });

   const isView = mode === 'view';

   const stationDetailsQ = useQuery({
      queryKey: ['stations', 'details', stationId],
      queryFn: () => getStationDetailsRepo(stationId as string),
      enabled: enabled && mode !== 'create' && !!stationId,
   });

   const ownersQ = useQuery({
      queryKey: ['station-owners', 'list'],
      queryFn: listStationOwners,
      enabled,
   });

   const divisionsQ = useQuery({
      queryKey: ['settings', 'divisions'],
      queryFn: () => divisionRepo.list(),
      enabled,
   });

   const districtsQ = useQuery({
      queryKey: ['settings', 'districts'],
      queryFn: () => districtRepo.list(),
      enabled,
   });

   const upazilasQ = useQuery({
      queryKey: ['settings', 'upazilas'],
      queryFn: () => upazilaRepo.list(),
      enabled,
   });

   const otherBusinessesQ = useQuery({
      queryKey: ['settings', 'other-businesses'],
      queryFn: () => otherBusinessesRepo.list(),
      enabled,
   });

   const ownerOptions = ownersQ.data ?? [];
   const [stationOwnerSearch, setStationOwnerSearch] = useState('');

   const divisionOptions = useMemo(
      () =>
         (divisionsQ.data ?? []).map(d => ({
            id: toId(d.id),
            label: d.name,
         })),
      [divisionsQ.data]
   );

   const statusOptions = useMemo(
      () => [
         {id: 'PENDING', label: 'PENDING'},
         {id: 'APPROVED', label: 'APPROVED'},
         {id: 'REJECTED', label: 'REJECTED'},
      ],
      []
   );

   const fuelOptions = useMemo(
      () => [
         {id: 'Petrol', label: 'Petrol'},
         {id: 'Diesel', label: 'Diesel'},
         {id: 'Octane', label: 'Octane'},
         {id: 'Kerosene', label: 'Kerosene'},
         {id: 'Mobil', label: 'Mobil'},
      ],
      []
   );

   const oilCompanyOptions = useMemo(
      () => [
         {
            id: 'Bangladesh Petroleum Corporation (BPC)',
            label: 'Bangladesh Petroleum Corporation (BPC)',
         },
         {id: 'Padma Oil Company Ltd.', label: 'Padma Oil Company Ltd.'},
         {id: 'Jamuna Oil Company Ltd.', label: 'Jamuna Oil Company Ltd.'},
         {id: 'Meghna Petroleum Ltd.', label: 'Meghna Petroleum Ltd.'},
      ],
      []
   );

   const stationTypeOptions = useMemo(
      () => [
         {id: 'Filling Station', label: 'Filling Station'},
         {id: 'Petrol Pump', label: 'Petrol Pump'},
         {id: 'Depot/Storage Station', label: 'Depot/Storage Station'},
         {
            id: 'Kerosene Distribution Center',
            label: 'Kerosene Distribution Center',
         },
         {id: 'Mobil Station', label: 'Mobil Station'},
      ],
      []
   );

   const stationStatusOptions = useMemo(
      () => [
         {id: 'Running', label: 'Running'},
         {id: 'On Going', label: 'On Going'},
         {id: 'Up Coming', label: 'Up Coming'},
      ],
      []
   );

   const businessTypeOptions = useMemo(
      () => [
         {id: 'Dealer', label: 'Dealer'},
         {id: 'Agent', label: 'Agent'},
         {id: 'Distribution', label: 'Distribution'},
      ],
      []
   );

   const otherBusinessFallback = useMemo(
      () => [
         {id: 'Filling Station', name: 'Filling Station'},
         {id: 'Petrol Pump', name: 'Petrol Pump'},
         {id: 'Depot/Storage Station', name: 'Depot/Storage Station'},
         {
            id: 'Kerosene Distribution Center',
            name: 'Kerosene Distribution Center',
         },
         {id: 'Mobil Station', name: 'Mobil Station'},
      ],
      []
   );

   const otherBusinessOptions = useMemo(() => {
      const rows = otherBusinessesQ.data ?? [];
      if (!rows.length) return otherBusinessFallback;
      return rows.map(b => ({id: b.id, name: b.name}));
   }, [otherBusinessesQ.data, otherBusinessFallback]);

   const filteredDistricts = useMemo(() => {
      const rows = districtsQ.data ?? [];
      if (!form.division_id) return rows;
      if (!divisionOptions.length) return [];
      if (!isValidOptionId(divisionOptions, form.division_id)) return [];
      const divisionId = toNumberOrUndefined(form.division_id);
      if (!divisionId) return [];
      return rows.filter(d => d.divisionId === divisionId);
   }, [districtsQ.data, divisionOptions, form.division_id]);

   const districtOptions = useMemo(
      () =>
         filteredDistricts.map(d => ({
            id: toId(d.id),
            label: d.districtName,
         })),
      [filteredDistricts]
   );

   const filteredUpazilas = useMemo(() => {
      const rows = upazilasQ.data ?? [];
      if (!form.district_id) return rows;
      if (!districtOptions.length) return [];
      if (!isValidOptionId(districtOptions, form.district_id)) return [];
      const districtId = toNumberOrUndefined(form.district_id);
      if (!districtId) return [];
      return rows.filter(u => u.districtId === districtId);
   }, [upazilasQ.data, districtOptions, form.district_id]);

   const upazilaOptions = useMemo(
      () =>
         filteredUpazilas.map(u => ({
            id: toId(u.id),
            label: u.upazilaName,
         })),
      [filteredUpazilas]
   );

   const divisionInvalid =
      touched.division &&
      !!form.division_id &&
      !!divisionOptions.length &&
      !isValidOptionId(divisionOptions, form.division_id);

   const districtInvalid =
      touched.district &&
      !!form.district_id &&
      !!districtOptions.length &&
      !isValidOptionId(districtOptions, form.district_id);

   const upazilaInvalid =
      touched.upazila &&
      !!form.upazila_id &&
      !!upazilaOptions.length &&
      !isValidOptionId(upazilaOptions, form.upazila_id);

   useEffect(() => {
      if (!enabled) return;
      if (mode === 'create') {
         setForm({...emptyForm, ...createDefaults, ...initialValues});
         return;
      }
      if (stationDetailsQ.data) {
         setForm(mapStationDetailsToForm(stationDetailsQ.data));
      }
   }, [enabled, initialValues, mode, stationDetailsQ.data]);

   useEffect(() => {
      const match = ownerOptions.find(o => o.id === form.station_owner_id);
      const nextValue = match?.label ?? form.station_owner_id ?? '';
      if (nextValue !== stationOwnerSearch) {
         setStationOwnerSearch(nextValue);
      }
   }, [form.station_owner_id, ownerOptions, stationOwnerSearch]);

   const trimmedPhone = form.contact_person_phone.trim();
   const phoneOk = !trimmedPhone || /^\d{11}$/.test(trimmedPhone);

   const requiredFilled =
      isValidOptionId(ownerOptions, form.station_owner_id) &&
      !!form.station_name.trim() &&
      isValidOptionId(divisionOptions, form.division_id) &&
      isValidOptionId(districtOptions, form.district_id) &&
      isValidOptionId(upazilaOptions, form.upazila_id) &&
      !!form.station_address.trim() &&
      !!toDateOrUndefined(form.commencement_date) &&
      phoneOk;

   const canSubmit = !isView && requiredFilled && !saving;

   const [existingStationId, setExistingStationId] = useState('');
   const [existingStationError, setExistingStationError] = useState<
      string | null
   >(null);
   const [loadingExisting, setLoadingExisting] = useState(false);

   const handleSubmit = () => {
      setValidationError(null);

      const maxFileSizeBytes = 20 * 1024 * 1024;

      if (
         !form.station_owner_id ||
         !isValidOptionId(ownerOptions, form.station_owner_id)
      ) {
         setValidationError(
            'Please select a valid station owner from the list.'
         );
         return;
      }

      if (!form.station_name.trim()) {
         setValidationError('Station name is required.');
         return;
      }

      if (
         !form.division_id ||
         !divisionOptions.length ||
         !isValidOptionId(divisionOptions, form.division_id)
      ) {
         setValidationError('Please select a valid division from the list.');
         return;
      }

      if (
         !form.district_id ||
         !districtOptions.length ||
         !isValidOptionId(districtOptions, form.district_id)
      ) {
         setValidationError('Please select a valid district from the list.');
         return;
      }

      if (
         !form.upazila_id ||
         !upazilaOptions.length ||
         !isValidOptionId(upazilaOptions, form.upazila_id)
      ) {
         setValidationError('Please select a valid upazila from the list.');
         return;
      }

      if (!form.station_address.trim()) {
         setValidationError('Station address is required.');
         return;
      }

      if (!toDateOrUndefined(form.commencement_date)) {
         setValidationError('Commencement date is required.');
         return;
      }

      if (trimmedPhone && !/^\d{11}$/.test(trimmedPhone)) {
         setValidationError('Contact person phone must be exactly 11 digits.');
         return;
      }

      if (
         form.station_status &&
         !isValidOptionId(stationStatusOptions, form.station_status)
      ) {
         setValidationError('Please select a valid station status.');
         return;
      }

      if (
         form.verification_status &&
         !isValidOptionId(statusOptions, form.verification_status)
      ) {
         setValidationError('Please select a valid verification status.');
         return;
      }

      if (
         form.verification_status === 'REJECTED' &&
         !form.rejection_reason.trim()
      ) {
         setValidationError('Please provide a rejection reason.');
         return;
      }

      const otherBusinessIds = otherBusinessOptions.map(b => String(b.id));
      if (
         form.other_businesses.some(
            id => !otherBusinessIds.includes(String(id))
         )
      ) {
         setValidationError(
            'Please select valid other businesses from the list.'
         );
         return;
      }

      if (form.nid && form.nid.size > maxFileSizeBytes) {
         setValidationError('NID file size must be 20MB or smaller.');
         return;
      }

      if (form.tin && form.tin.size > maxFileSizeBytes) {
         setValidationError('TIN file size must be 20MB or smaller.');
         return;
      }

      if (
         form.explosive_license &&
         form.explosive_license.size > maxFileSizeBytes
      ) {
         setValidationError(
            'Explosive license file size must be 20MB or smaller.'
         );
         return;
      }

      const statusDefaults: Partial<typeof createDefaults> =
         mode === 'create' ? createDefaults : {};

      const payload: StationUpsertPayload = {
         station_owner_id:
            toNumberOrUndefined(form.station_owner_id) ?? form.station_owner_id,
         station_name: form.station_name,
         fuel_type: form.fuel_type || null,
         oil_company_name: form.oil_company_name || null,
         station_type: form.station_type || null,
         station_status:
            statusDefaults.station_status ?? (form.station_status || null),
         business_type: form.business_type || null,
         dealership_agreement: form.dealership_agreement || null,
         division_id: toNumberOrUndefined(form.division_id) ?? form.division_id,
         district_id: toNumberOrUndefined(form.district_id) ?? form.district_id,
         upazila_id: toNumberOrUndefined(form.upazila_id) ?? form.upazila_id,
         station_address: form.station_address,
         commencement_date: form.commencement_date || null,
         contact_person_name: form.contact_person_name || null,
         contact_person_phone: form.contact_person_phone || null,
         other_businesses: form.other_businesses
            .map(id => toNumberOrUndefined(id) ?? id)
            .filter(Boolean),
         verification_status:
            statusDefaults.verification_status ??
            (form.verification_status || null),
         verified_by: toNumberOrUndefined(form.verified_by),
         verified_at: toDateOrUndefined(form.verified_at),
         rejection_reason:
            form.verification_status === 'REJECTED' && form.rejection_reason
               ? form.rejection_reason
               : null,
         nid: form.nid,
         tin: form.tin,
         explosive_license: form.explosive_license,
      };

      onSubmit(payload);
   };

   const loadingDetails = mode !== 'create' && stationDetailsQ.isLoading;
   const loadingOptions =
      ownersQ.isLoading ||
      divisionsQ.isLoading ||
      districtsQ.isLoading ||
      upazilasQ.isLoading;

   return (
      <div className='space-y-4'>
         {loadingDetails ? (
            <Loader label='Loading station...' />
         ) : stationDetailsQ.isError ? (
            <div className='text-sm text-red-600'>
               Failed to load station details.
            </div>
         ) : (
            <div className='space-y-4'>
               {mode === 'create' ? (
                  <div className='rounded-[8px] border border-dashed border-black/10 bg-[#F6F9FF] px-4 py-3 text-[12px] text-[#2B3A4A]'>
                     <div className='mb-2 text-[12px] font-semibold text-[#173A7A]'>
                        Add Existing Gas Station
                     </div>
                     <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                        <input
                           value={existingStationId}
                           onChange={e => setExistingStationId(e.target.value)}
                           placeholder='Enter station ID'
                           disabled={loadingExisting || isView}
                           className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                        />
                        <button
                           type='button'
                           disabled={
                              loadingExisting || !existingStationId.trim()
                           }
                           onClick={async () => {
                              if (!existingStationId.trim()) return;
                              setExistingStationError(null);
                              setLoadingExisting(true);
                              try {
                                 const data = await getStationDetailsRepo(
                                    existingStationId.trim()
                                 );
                                 setForm({
                                    ...mapStationDetailsToForm(data),
                                    ...createDefaults,
                                 });
                              } catch (err: any) {
                                 setExistingStationError(
                                    err?.message ??
                                       'Unable to load the existing station.'
                                 );
                              } finally {
                                 setLoadingExisting(false);
                              }
                           }}
                           className='h-9 rounded-[6px] bg-[#133374] px-4 text-[12px] font-semibold text-white shadow-sm disabled:opacity-60'>
                           {loadingExisting ? 'Loading...' : 'Load'}
                        </button>
                     </div>
                     {existingStationError ? (
                        <p className='mt-2 text-[11px] font-medium text-red-600'>
                           {existingStationError}
                        </p>
                     ) : null}
                  </div>
               ) : null}

               <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Station Owner
                     </label>
                     <input
                        list='station-owner-options'
                        value={stationOwnerSearch}
                        onChange={e => {
                           const value = e.target.value;
                           setStationOwnerSearch(value);
                           const match = ownerOptions.find(
                              o => o.label === value || o.id === value
                           );
                           setForm(prev => ({
                              ...prev,
                              station_owner_id: match ? match.id : value,
                           }));
                        }}
                        disabled={isView || ownersQ.isError}
                        placeholder={
                           loadingOptions
                              ? 'Loading owners...'
                              : 'Select Station Owner name'
                        }
                        className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                     />
                     <datalist id='station-owner-options'>
                        {ownerOptions.map(o => (
                           <option key={o.id} value={o.label} />
                        ))}
                     </datalist>
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Station Name
                     </label>
                     <input
                        value={form.station_name}
                        onChange={e =>
                           setForm(prev => ({
                              ...prev,
                              station_name: e.target.value,
                           }))
                        }
                        placeholder={'Enter station name'}
                        disabled={isView}
                        className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Fuel Type
                     </label>
                     <DatalistInput
                        value={form.fuel_type}
                        options={fuelOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              fuel_type: value,
                           }))
                        }
                        disabled={isView}
                        placeholder='Select fuel type'
                        listId='fuel-type-options'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Oil Company Name
                     </label>
                     <DatalistInput
                        value={form.oil_company_name}
                        options={oilCompanyOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              oil_company_name: value,
                           }))
                        }
                        disabled={isView}
                        placeholder='Select oil company'
                        listId='oil-company-options'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Station Type
                     </label>
                     <DatalistInput
                        value={form.station_type}
                        options={stationTypeOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              station_type: value,
                           }))
                        }
                        disabled={isView}
                        placeholder='Select station type'
                        listId='station-type-options'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Station Status
                     </label>
                     <DatalistInput
                        options={stationStatusOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              station_status: value,
                           }))
                        }
                        disabled={isView}
                        placeholder='select Station Status'
                        listId='station-status-options'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Business Type
                     </label>
                     <DatalistInput
                        value={form.business_type}
                        options={businessTypeOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              business_type: value,
                           }))
                        }
                        disabled={isView}
                        placeholder='Select business type'
                        listId='business-type-options'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Dealership Agreement
                     </label>
                     <DatalistInput
                        value={form.dealership_agreement}
                        options={oilCompanyOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              dealership_agreement: value,
                           }))
                        }
                        disabled={isView}
                        placeholder='Select agreement'
                        listId='dealership-agreement-options'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Division
                     </label>
                     <DatalistInput
                        value={form.division_id}
                        options={divisionOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              division_id: value,
                              district_id: '',
                              upazila_id: '',
                           }))
                        }
                        onBlur={() => setTouched(t => ({...t, division: true}))}
                        disabled={isView}
                        placeholder={
                           divisionsQ.isLoading
                              ? 'Loading divisions...'
                              : 'Select division'
                        }
                        listId='division-options'
                     />
                     {divisionInvalid ? (
                        <p className='mt-1 text-[11px] font-medium text-red-600'>
                           Please select a Division from the list.
                        </p>
                     ) : null}
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        District
                     </label>
                     <DatalistInput
                        value={form.district_id}
                        options={districtOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              district_id: value,
                              upazila_id: '',
                           }))
                        }
                        onBlur={() => setTouched(t => ({...t, district: true}))}
                        disabled={isView}
                        placeholder={
                           districtsQ.isLoading
                              ? 'Loading districts...'
                              : 'Select district'
                        }
                        listId='district-options'
                     />
                     {districtInvalid ? (
                        <p className='mt-1 text-[11px] font-medium text-red-600'>
                           Please select a District from the list.
                        </p>
                     ) : null}
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Upazila
                     </label>
                     <DatalistInput
                        value={form.upazila_id}
                        options={upazilaOptions}
                        onValueChange={value =>
                           setForm(prev => ({
                              ...prev,
                              upazila_id: value,
                           }))
                        }
                        onBlur={() => setTouched(t => ({...t, upazila: true}))}
                        disabled={isView}
                        placeholder={
                           upazilasQ.isLoading
                              ? 'Loading upazilas...'
                              : 'Select upazila'
                        }
                        listId='upazila-options'
                     />
                     {upazilaInvalid ? (
                        <p className='mt-1 text-[11px] font-medium text-red-600'>
                           Please select an Upazila from the list.
                        </p>
                     ) : null}
                  </div>

                  <div className='md:col-span-2'>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Station Address
                     </label>
                     <textarea
                        value={form.station_address}
                        onChange={e =>
                           setForm(prev => ({
                              ...prev,
                              station_address: e.target.value,
                           }))
                        }
                        disabled={isView}
                        rows={2}
                        className='w-full rounded-[6px] border border-black/10 px-3 py-2 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Commencement Date
                     </label>
                     <input
                        type='date'
                        value={form.commencement_date}
                        onChange={e =>
                           setForm(prev => ({
                              ...prev,
                              commencement_date: e.target.value,
                           }))
                        }
                        disabled={isView}
                        className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Contact Person Name
                     </label>
                     <input
                        value={form.contact_person_name}
                        onChange={e =>
                           setForm(prev => ({
                              ...prev,
                              contact_person_name: e.target.value,
                           }))
                        }
                        disabled={isView}
                        className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                     />
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Contact Person Phone
                     </label>
                     <input
                        value={form.contact_person_phone}
                        type='number'
                        onChange={e =>
                           setForm(prev => ({
                              ...prev,
                              contact_person_phone: e.target.value,
                           }))
                        }
                        disabled={isView}
                        className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                     />
                  </div>

                  <div className='md:col-span-2'>
                     <label className='mb-2 block text-[11px] font-semibold text-[#173A7A]'>
                        Other Businesses
                     </label>
                     <div className='flex flex-wrap gap-3'>
                        {otherBusinessOptions.map(b => {
                           const checked = form.other_businesses.includes(b.id);
                           return (
                              <label
                                 key={b.id}
                                 className='flex items-center gap-2 text-[12px] text-[#2B3A4A]'>
                                 <input
                                    type='checkbox'
                                    checked={checked}
                                    disabled={isView}
                                    onChange={() =>
                                       setForm(prev => ({
                                          ...prev,
                                          other_businesses: checked
                                             ? prev.other_businesses.filter(
                                                  id => id !== b.id
                                               )
                                             : [...prev.other_businesses, b.id],
                                       }))
                                    }
                                 />
                                 {b.name}
                              </label>
                           );
                        })}
                     </div>
                  </div>

                  {mode !== 'create' ? (
                     <>
                        <div>
                           <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                              Verification Status
                           </label>
                           <DatalistInput
                              value={form.verification_status}
                              options={statusOptions}
                              onValueChange={value =>
                                 setForm(prev => ({
                                    ...prev,
                                    verification_status: value,
                                 }))
                              }
                              disabled={isView}
                              placeholder='Select status'
                              listId='verification-status-options'
                           />
                        </div>

                        <div>
                           <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                              Verified By (ID)
                           </label>
                           <input
                              value={form.verified_by}
                              onChange={e =>
                                 setForm(prev => ({
                                    ...prev,
                                    verified_by: e.target.value,
                                 }))
                              }
                              disabled={isView}
                              className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                           />
                        </div>

                        <div>
                           <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                              Verified At
                           </label>
                           <input
                              type='date'
                              value={form.verified_at}
                              onChange={e =>
                                 setForm(prev => ({
                                    ...prev,
                                    verified_at: e.target.value,
                                 }))
                              }
                              disabled={isView}
                              className='h-9 w-full rounded-[6px] border border-black/10 px-3 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                           />
                        </div>

                        <div className='md:col-span-2'>
                           <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                              Rejection Reason
                           </label>
                           <textarea
                              value={form.rejection_reason}
                              onChange={e =>
                                 setForm(prev => ({
                                    ...prev,
                                    rejection_reason: e.target.value,
                                 }))
                              }
                              disabled={isView}
                              rows={2}
                              className='w-full rounded-[6px] border border-black/10 px-3 py-2 text-[12px] outline-none focus:border-black/20 disabled:bg-black/5'
                           />
                        </div>
                     </>
                  ) : null}

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        NID
                     </label>

                     <div
                        className={[
                           'relative flex w-full items-center gap-2 rounded-[10px] border bg-white px-3 py-2',
                           'border-[#D6DFEE] focus-within:border-[#019769] focus-within:ring-2 focus-within:ring-[#019769]/15',
                           isView ? 'opacity-60' : '',
                        ].join(' ')}>
                        <CloudUpload className='h-4 w-4 text-[#019769]' />

                        <span className='flex-1 truncate text-[12px] text-[#2B3A4A]'>
                           {form.nid?.name ?? 'Choose file to upload'}
                        </span>

                        <span className='rounded-full bg-[#F3F6FB] px-3 py-1 text-[11px] font-semibold text-[#173A7A]'>
                           Browse
                        </span>

                        <input
                           type='file'
                           disabled={isView}
                           accept='.pdf,.jpg,.jpeg,.png'
                           onChange={e =>
                              setForm(prev => ({
                                 ...prev,
                                 nid: e.target.files?.[0] ?? null,
                              }))
                           }
                           className='absolute inset-0 cursor-pointer opacity-0'
                        />
                     </div>
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        TIN
                     </label>

                     <div
                        className={[
                           'relative flex w-full items-center gap-2 rounded-[10px] border bg-white px-3 py-2',
                           'border-[#D6DFEE] focus-within:border-[#019769] focus-within:ring-2 focus-within:ring-[#019769]/15',
                           isView ? 'opacity-60' : '',
                        ].join(' ')}>
                        <CloudUpload className='h-4 w-4 text-[#019769]' />

                        <span className='flex-1 truncate text-[12px] text-[#2B3A4A]'>
                           {form.tin?.name ?? 'Choose file to upload'}
                        </span>

                        <span className='rounded-full bg-[#F3F6FB] px-3 py-1 text-[11px] font-semibold text-[#173A7A]'>
                           Browse
                        </span>

                        <input
                           type='file'
                           disabled={isView}
                           accept='.pdf,.jpg,.jpeg,.png'
                           onChange={e =>
                              setForm(prev => ({
                                 ...prev,
                                 tin: e.target.files?.[0] ?? null,
                              }))
                           }
                           className='absolute inset-0 cursor-pointer opacity-0'
                        />
                     </div>
                  </div>

                  <div>
                     <label className='mb-1 block text-[11px] font-semibold text-[#173A7A]'>
                        Explosive License
                     </label>

                     <div
                        className={[
                           'relative flex w-full items-center gap-2 rounded-[10px] border bg-white px-3 py-2',
                           'border-[#D6DFEE] focus-within:border-[#019769] focus-within:ring-2 focus-within:ring-[#019769]/15',
                           isView ? 'opacity-60' : '',
                        ].join(' ')}>
                        <CloudUpload className='h-4 w-4 text-[#019769]' />

                        <span className='flex-1 truncate text-[12px] text-[#2B3A4A]'>
                           {form.explosive_license?.name ??
                              'Choose file to upload'}
                        </span>

                        <span className='rounded-full bg-[#F3F6FB] px-3 py-1 text-[11px] font-semibold text-[#173A7A]'>
                           Browse
                        </span>

                        <input
                           type='file'
                           disabled={isView}
                           accept='.pdf,.jpg,.jpeg,.png'
                           onChange={e =>
                              setForm(prev => ({
                                 ...prev,
                                 explosive_license: e.target.files?.[0] ?? null,
                              }))
                           }
                           className='absolute inset-0 cursor-pointer opacity-0'
                        />
                     </div>
                  </div>
               </div>

               {validationError ? (
                  <p className='text-[12px] font-medium text-red-600'>
                     {validationError}
                  </p>
               ) : null}

               {error ? (
                  <p className='text-[12px] font-medium text-red-600'>
                     {error}
                  </p>
               ) : null}

               <div className='mt-4 flex justify-end gap-2'>
                  <button
                     type='button'
                     onClick={onCancel}
                     disabled={!!saving}
                     className='h-9 rounded-[6px] border border-black/10 px-4 text-[12px] font-semibold text-[#173A7A] hover:bg-black/5 disabled:opacity-60'>
                     Close
                  </button>

                  {!isView && (
                     <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className='h-9 rounded-[6px] bg-[#009970] px-4 text-[12px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:opacity-60'>
                        {saving
                           ? 'Saving...'
                           : mode === 'create'
                           ? 'Create'
                           : 'Update'}
                     </button>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
