// src/features/dashboard/settings/upazila-thana/repo.ts
import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_UPAZILAS} from './mock';
import type {UpazilaRow} from './types';

export type UpazilaRepo = {
  list: () => Promise<UpazilaRow[]>;
  remove: (id: string) => Promise<void>;
};

let store: UpazilaRow[] = structuredClone(MOCK_UPAZILAS);

const mockUpazilaRepo: UpazilaRepo = {
  async list() {
    await mockDelay(250);
    return store.map((r) => ({...r}));
  },
  async remove(id) {
    await mockDelay(250);
    store = store.filter((r) => r.id !== id);
    store = store.map((r, i) => ({...r, sl: i + 1}));
  },
};

const apiUpazilaRepo: UpazilaRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
  async remove() {
    throw new Error('API repo not implemented yet');
  },
};

export const upazilaRepo = env.dataMode === 'mock' ? mockUpazilaRepo : apiUpazilaRepo;
