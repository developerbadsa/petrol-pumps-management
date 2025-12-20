import {useQuery} from '@tanstack/react-query';
import {invoicesRepo} from './repo';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesRepo.list(),
  });
}
