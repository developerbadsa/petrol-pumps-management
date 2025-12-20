export type OwnerStatus = 'UNVERIFIED' | 'VERIFIED';

export type OwnerRow = {
  id: string;
  memberId?: string; // optional (some designs show it)
  photoUrl: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  status: OwnerStatus;
};
