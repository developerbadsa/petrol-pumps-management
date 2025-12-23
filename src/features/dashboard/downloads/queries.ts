import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {feesRepo} from './repo';
import type {CreateFeeInput, UpdateFeeInput} from './repo';

const keys = {
  all: ['fees'] as const,
};

export function useFees() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => feesRepo.list(),
  });
}

export function useCreateFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFeeInput) => feesRepo.create(input),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}

export function useUpdateFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {id: string; patch: UpdateFeeInput}) => feesRepo.update(args.id, args.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}

export function useDeleteFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feesRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: keys.all});
    },
  });
}
