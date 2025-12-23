import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_DIVISIONS} from './mock';
import type {DivisionRow} from './types';

export type DivisionRepo = {
  list: () => Promise<DivisionRow[]>;
  remove: (id: string) => Promise<void>;
};

let store: DivisionRow[] = structuredClone(MOCK_DIVISIONS);

const mockDivisionRepo: DivisionRepo = {
  async list() {
    await mockDelay(250);
    return store.map((x) => ({...x}));
  },
  async remove(id) {
    await mockDelay(250);
    store = store.filter((x) => x.id !== id);
  },
};

const apiDivisionRepo: DivisionRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
  async remove() {
    throw new Error('API repo not implemented yet');
  },
};

export const divisionRepo = env.dataMode === 'mock' ? mockDivisionRepo : apiDivisionRepo;
