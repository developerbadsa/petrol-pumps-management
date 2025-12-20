import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ownersRepo} from './repo';

export function useUnverifiedOwners() {
  return useQuery({
    queryKey: ['owners', 'unverified'],
    queryFn: () => ownersRepo.listUnverified(),
  });
}

export function useVerifiedOwners() {
  return useQuery({
    queryKey: ['owners', 'verified'],
    queryFn: () => ownersRepo.listVerified(),
  });
}

export function useApproveOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ownersRepo.approve(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: ['owners']});
    },
  });
}

export function useRejectOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ownersRepo.reject(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: ['owners']});
    },
  });
}

export function useAddSection() {
  return useMutation({
    mutationFn: (id: string) => ownersRepo.addSection(id),
  });
}
