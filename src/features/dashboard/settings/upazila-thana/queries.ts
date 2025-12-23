
'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {upazilaRepo} from './repo';

const QK = ['settings', 'upazilas'] as const;

export function useUpazilas() {
  return useQuery({
    queryKey: QK,
    queryFn: () => upazilaRepo.list(),
  });
}

export function useDeleteUpazila() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => upazilaRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: QK});
    },
  });
}
