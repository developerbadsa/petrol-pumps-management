import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_NOTICES} from './mock';
import type {NoticeRow} from './types';

export type NoticesRepo = {
  list: () => Promise<NoticeRow[]>;
  remove: (id: string) => Promise<void>;
};

let store: NoticeRow[] = structuredClone(MOCK_NOTICES);

const mockNoticesRepo: NoticesRepo = {
  async list() {
    await mockDelay(250);
    return store.map(n => ({...n}));
  },
  async remove(id) {
    await mockDelay(300);
    store = store.filter(n => n.id !== id);
  },
};

const apiNoticesRepo: NoticesRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
  async remove() {
    throw new Error('API repo not implemented yet');
  },
};

export const noticesRepo = env.dataMode === 'mock' ? mockNoticesRepo : apiNoticesRepo;
