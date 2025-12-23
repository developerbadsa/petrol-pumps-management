import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_MEMBERSHIP_FEES} from './mock';
import type {MembershipFeeRow} from './types';

export type MembershipFeesRepo = {
  list: () => Promise<MembershipFeeRow[]>;
  remove: (id: string) => Promise<void>;
  // later: create/update
};

let store: MembershipFeeRow[] = structuredClone(MOCK_MEMBERSHIP_FEES);

const mockRepo: MembershipFeesRepo = {
  async list() {
    await mockDelay(250);
    return store.map((r) => ({...r}));
  },
  async remove(id) {
    await mockDelay(250);
    store = store.filter((r) => r.id !== id);
  },
};

const apiRepo: MembershipFeesRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
  async remove() {
    throw new Error('API repo not implemented yet');
  },
};

export const membershipFeesRepo =
  env.dataMode === 'mock' ? mockRepo : apiRepo;
