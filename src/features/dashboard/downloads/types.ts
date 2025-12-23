export type FeeStatus = 'ACTIVE' | 'INACTIVE';

export type MembershipFeeRow = {
  id: string;
  sl: number;
  amount: number;
  status: FeeStatus;
};
