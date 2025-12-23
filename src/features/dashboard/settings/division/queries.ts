'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {divisionRepo} from './repo';

const QK = ['settings', 'division'] as const;

export function useDivisions() {
  return useQuery({
    queryKey: QK,
    queryFn: () => divisionRepo.list(),
  });
}

export function useDeleteDivision() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => divisionRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: QK});
    },
  });
}
