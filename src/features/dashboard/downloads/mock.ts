import type {MembershipFeeRow} from './types';

export const MOCK_FEES: MembershipFeeRow[] = [
  {id: 'fee_01', sl: 1, amount: 8000, status: 'INACTIVE'},
  {id: 'fee_02', sl: 2, amount: 6000, status: 'INACTIVE'},
  {id: 'fee_03', sl: 3, amount: 1000, status: 'INACTIVE'},
  {id: 'fee_04', sl: 4, amount: 7000, status: 'INACTIVE'},
  {id: 'fee_05', sl: 5, amount: 5000, status: 'INACTIVE'},
  {id: 'fee_06', sl: 6, amount: 1000, status: 'INACTIVE'},
  {id: 'fee_07', sl: 7, amount: 6000, status: 'ACTIVE'},
  {id: 'fee_08', sl: 8, amount: 6000, status: 'ACTIVE'},
  {id: 'fee_09', sl: 9, amount: 8000, status: 'ACTIVE'},
  {id: 'fee_10', sl: 10, amount: 7000, status: 'ACTIVE'},
];
