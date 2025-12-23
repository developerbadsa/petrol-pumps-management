
import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_DISTRICTS} from './mock';
import type {DistrictRow} from './types';

export type DistrictRepo = {
  list: () => Promise<DistrictRow[]>;
  remove: (id: string) => Promise<void>;
  // later:
  // create: (input: {divisionName: string; districtName: string}) => Promise<void>;
  // update: (id: string, patch: Partial<Pick<DistrictRow, 'divisionName' | 'districtName'>>) => Promise<void>;
};

let store: DistrictRow[] = structuredClone(MOCK_DISTRICTS);

const mockDistrictRepo: DistrictRepo = {
  async list() {
    await mockDelay(250);
    return store.map((r) => ({...r}));
  },
  async remove(id) {
    await mockDelay(250);
    store = store.filter((r) => r.id !== id);
    // re-sl
    store = store.map((r, i) => ({...r, sl: i + 1}));
  },
};

const apiDistrictRepo: DistrictRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
  async remove() {
    throw new Error('API repo not implemented yet');
  },
};

export const districtRepo: DistrictRepo =
  env.dataMode === 'mock' ? mockDistrictRepo : apiDistrictRepo;
