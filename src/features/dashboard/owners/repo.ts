import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_OWNERS} from './mock';
import type {OwnerRow} from './types';
import { RegisterOwnerInput } from './register-owner/types';

export type OwnersRepo = {
  registerOwner(input: RegisterOwnerInput): Promise<unknown>;
  listUnverified: () => Promise<OwnerRow[]>;
  listVerified: () => Promise<OwnerRow[]>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  addSection: (id: string) => Promise<void>;
};

// In-memory store for mock mode
let store: OwnerRow[] = structuredClone(MOCK_OWNERS);

const mockOwnersRepo: OwnersRepo = {
  async listUnverified() {
    await mockDelay(250);
    return store.filter((o) => o.status === 'UNVERIFIED').map((o) => ({ ...o }));
  },
  async listVerified() {
    await mockDelay(250);
    return store.filter((o) => o.status === 'VERIFIED').map((o) => ({ ...o }));
  },
  async approve(id) {
    await mockDelay(300);
    store = store.map((o) => (o.id === id ? { ...o, status: 'VERIFIED' } : o));
  },
  async reject(id) {
    await mockDelay(300);
    // For mock: just remove it from the list
    store = store.filter((o) => o.id !== id);
  },
  async addSection() {
    await mockDelay(250);
    // Placeholder: later this can open a modal or navigate to a document/section page.
  },
  registerOwner: function (input: RegisterOwnerInput): Promise<unknown> {
    throw new Error('Function not implemented.');
  }
};

const apiOwnersRepo: OwnersRepo = {
  async listUnverified() {
    throw new Error('API repo not implemented yet');
  },
  async listVerified() {
    throw new Error('API repo not implemented yet');
  },
  async approve() {
    throw new Error('API repo not implemented yet');
  },
  async reject() {
    throw new Error('API repo not implemented yet');
  },
  async addSection() {
    throw new Error('API repo not implemented yet');
  },
  registerOwner: function (input: RegisterOwnerInput): Promise<unknown> {
    throw new Error('Function not implemented.');
  }
};

export const ownersRepo = env.dataMode === 'mock' ? mockOwnersRepo : apiOwnersRepo;
