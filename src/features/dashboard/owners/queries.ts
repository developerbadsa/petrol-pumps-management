'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ownersRepo } from './repo';
import type { UpdateOwnerInput } from './types';

const KEY = ['owners'] as const;

export function useUnverifiedOwners() {
  return useQuery({
    queryKey: [...KEY, 'unverified'],
    queryFn: () => ownersRepo.listUnverified(),
  });
}

export function useVerifiedOwners() {
  return useQuery({
    queryKey: [...KEY, 'verified'],
    queryFn: () => ownersRepo.listVerified(),
  });
}

export function useOwnerDetails(id?: string) {
  return useQuery({
    queryKey: [...KEY, 'detail', id],
    queryFn: () => ownersRepo.getOwnerDetails(id as string),
    enabled: Boolean(id),
  });
}

export function useOwnerStations(id?: string) {
  return useQuery({
    queryKey: [...KEY, 'stations', id],
    queryFn: () => ownersRepo.listOwnerStations(id as string),
    enabled: Boolean(id),
  });
}

export function useApproveOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ownersRepo.approve(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRejectOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ownersRepo.reject(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateOwnerInput }) => ownersRepo.update(vars.id, vars.input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useAddSection() {
  return useMutation({
    mutationFn: (id: string) => ownersRepo.addSection(id),
  });
}
