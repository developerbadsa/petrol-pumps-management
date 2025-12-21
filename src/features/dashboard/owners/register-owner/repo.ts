import {env} from '@/lib/env';
import type {RegisterOwnerInput, RegisterOwnerResult} from './types';

export type OwnersRepo = {
  registerOwner: (input: RegisterOwnerInput) => Promise<RegisterOwnerResult>;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const mockOwnersRepo: OwnersRepo = {
  async registerOwner(input) {
    // Mock latency to simulate server
    await sleep(650);

    // In real API, you’ll return server id.
    // For now, generate a stable mock id
    const id = `own_${Math.random().toString(16).slice(2)}_${Date.now()}`;

    // You can later push into in-memory mock list if you want
    // so it appears instantly in Unverified list.
    void input;

    return {id};
  },
};

const apiOwnersRepo: OwnersRepo = {
  async registerOwner(_input) {
    // Later: call your real endpoint
    // return api.post('/owners', input)
    throw new Error('API mode not implemented yet');
  },
};

export const ownersRepo: OwnersRepo = env.dataMode === 'api' ? apiOwnersRepo : mockOwnersRepo;
