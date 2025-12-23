import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_FEES} from './mock';
import type {FeeStatus, MembershipFeeRow} from './types';

export type CreateFeeInput = {amount: number; status?: FeeStatus};
export type UpdateFeeInput = {amount?: number; status?: FeeStatus};

export type FeesRepo = {
  list: () => Promise<MembershipFeeRow[]>;
  create: (input: CreateFeeInput) => Promise<{id: string}>;
  update: (id: string, patch: UpdateFeeInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

let store: MembershipFeeRow[] = structuredClone(MOCK_FEES);

const mockFeesRepo: FeesRepo = {
  async list() {
    await mockDelay(250);
    return store
      .slice()
      .sort((a, b) => a.sl - b.sl)
      .map((r) => ({...r}));
  },

  async create(input) {
    await mockDelay(350);

    const id = `fee_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    const nextSl = store.length ? Math.max(...store.map((s) => s.sl)) + 1 : 1;

    store = [
      ...store,
      {
        id,
        sl: nextSl,
        amount: input.amount,
        status: input.status ?? 'INACTIVE',
      },
    ];

    return {id};
  },

  async update(id, patch) {
    await mockDelay(300);
    store = store.map((r) => (r.id === id ? {...r, ...patch} : r));
  },

  async remove(id) {
    await mockDelay(300);
    store = store.filter((r) => r.id !== id).map((r, idx) => ({...r, sl: idx + 1}));
  },
};

const apiFeesRepo: FeesRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
  async create() {
    throw new Error('API repo not implemented yet');
  },
  async update() {
    throw new Error('API repo not implemented yet');
  },
  async remove() {
    throw new Error('API repo not implemented yet');
  },
};

export const feesRepo: FeesRepo = env.dataMode === 'mock' ? mockFeesRepo : apiFeesRepo;
