import {env} from '@/lib/env';
import {mockDelay} from '@/lib/mockDelay';
import {MOCK_INVOICES} from './mock';
import type {InvoiceRow} from './types';

export type InvoicesRepo = {
  list: () => Promise<InvoiceRow[]>;
};

const mockInvoicesRepo: InvoicesRepo = {
  async list() {
    await mockDelay(350);
    return structuredClone(MOCK_INVOICES);
  },
};

const apiInvoicesRepo: InvoicesRepo = {
  async list() {
    throw new Error('API repo not implemented yet');
  },
};

export const invoicesRepo = env.dataMode === 'mock' ? mockInvoicesRepo : apiInvoicesRepo;
