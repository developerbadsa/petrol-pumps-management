export type OwnerStatus = 'UNVERIFIED' | 'VERIFIED' | 'REJECTED';

export type OwnerRow = {
  id: string;
  memberId?: string;
  photoUrl: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  status: OwnerStatus;
};

export type OwnerStationRow = {
  id: string;
  name: string;
  status?: string;
  division?: string;
  district?: string;
  upazila?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  stationType?: string;
  fuelType?: string;
  startDate?: string;
};

export type OwnerDetails = {
  id: string;
  memberId?: string;
  photoUrl: string;
  ownerName: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type UpdateOwnerInput = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
};
