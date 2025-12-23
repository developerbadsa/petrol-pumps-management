
'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {districtRepo} from './repo';

const QK = ['settings', 'districts'] as const;

export function useDistricts() {
  return useQuery({
    queryKey: QK,
    queryFn: () => districtRepo.list(),
  });
}

export function useDeleteDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => districtRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: QK});
    },
  });
}
