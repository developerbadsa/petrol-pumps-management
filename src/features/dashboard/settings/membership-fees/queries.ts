'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {membershipFeesRepo} from './repo';

const keys = {
  all: ['settings', 'membership-fees'] as const,
};

export function useMembershipFees() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => membershipFeesRepo.list(),
  });
}

export function useDeleteMembershipFee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membershipFeesRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}
