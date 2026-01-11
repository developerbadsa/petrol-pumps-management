export type StationUpsertPayload = {
  station_owner_id?: number | string | null;
  station_name?: string | null;
  fuel_type?: string | null;
  oil_company_name?: string | null;
  station_type?: string | null;
  station_status?: string | null;
  business_type?: string | null;
  dealership_agreement?: string | null;
  division_id?: number | string | null;
  district_id?: number | string | null;
  upazila_id?: number | string | null;
  station_address?: string | null;
  commencement_date?: string | null;
  contact_person_name?: string | null;
  contact_person_phone?: string | null;
  other_businesses?: Array<number | string> | null;
  verification_status?: string | null;
  verified_by?: number | string | null;
  verified_at?: string | null;
  rejection_reason?: string | null;
  nid?: File | null;
  tin?: File | null;
  explosive_license?: File | null;
};

function appendIfPresent(form: FormData, key: string, value: unknown) {
  if (value === null || value === undefined) return;
  if (typeof value === 'string' && value.trim().length === 0) return;
  form.append(key, String(value));
}

export function buildStationFormData(payload: StationUpsertPayload) {
  const form = new FormData();

  appendIfPresent(form, 'station_owner_id', payload.station_owner_id);
  appendIfPresent(form, 'station_name', payload.station_name);
  appendIfPresent(form, 'fuel_type', payload.fuel_type);
  appendIfPresent(form, 'oil_company_name', payload.oil_company_name);
  appendIfPresent(form, 'station_type', payload.station_type);
  appendIfPresent(form, 'station_status', payload.station_status);
  appendIfPresent(form, 'business_type', payload.business_type);
  appendIfPresent(form, 'dealership_agreement', payload.dealership_agreement);
  appendIfPresent(form, 'division_id', payload.division_id);
  appendIfPresent(form, 'district_id', payload.district_id);
  appendIfPresent(form, 'upazila_id', payload.upazila_id);
  appendIfPresent(form, 'station_address', payload.station_address);
  appendIfPresent(form, 'commencement_date', payload.commencement_date);
  appendIfPresent(form, 'contact_person_name', payload.contact_person_name);
  appendIfPresent(form, 'contact_person_phone', payload.contact_person_phone);
  appendIfPresent(form, 'verification_status', payload.verification_status);
  appendIfPresent(form, 'verified_by', payload.verified_by);
  appendIfPresent(form, 'verified_at', payload.verified_at);
  appendIfPresent(form, 'rejection_reason', payload.rejection_reason);

  if (Array.isArray(payload.other_businesses)) {
    payload.other_businesses.forEach((id) => {
      if (id === null || id === undefined || id === '') return;
      form.append('other_businesses[]', String(id));
    });
  }

  if (payload.nid) form.append('nid', payload.nid);
  if (payload.tin) form.append('tin', payload.tin);
  if (payload.explosive_license) form.append('explosive_license', payload.explosive_license);

  return form;
}
