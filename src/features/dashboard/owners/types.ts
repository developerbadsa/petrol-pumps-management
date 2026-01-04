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

export type UpdateOwnerInput = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
};
