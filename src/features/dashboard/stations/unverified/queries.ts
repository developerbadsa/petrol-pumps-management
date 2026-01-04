'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteStationRepo,
  getStationDetailsRepo,
  listUnverifiedStationsRepo,
  verifyStationRepo,
} from './repo';
import {
  createStationRepo,
  updateStationRepo,
  type GasStationUpsertInput,
} from '../verified/repo';

const KEY_UNVERIFIED = ['stations', 'unverified'] as const;
const KEY_VERIFIED = ['stations', 'verified'] as const;

export function useUnverifiedStations() {
  return useQuery({
    queryKey: KEY_UNVERIFIED,
    queryFn: listUnverifiedStationsRepo,
  });
}

export function useStationDetails(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ['stations', 'details', id],
    queryFn: () => getStationDetailsRepo(id as string),
    enabled: enabled && !!id,
  });
}

export function useVerifyStation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => verifyStationRepo(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY_UNVERIFIED });

      const prev = qc.getQueryData<any[]>(KEY_UNVERIFIED) ?? [];
      qc.setQueryData<any[]>(KEY_UNVERIFIED, (old = []) => old.filter((r: any) => r.id !== id));

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY_UNVERIFIED, ctx.prev);
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: KEY_UNVERIFIED });
      await qc.invalidateQueries({ queryKey: KEY_VERIFIED }); // so verified table updates too
    },
  });
}

export function useDeleteStation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStationRepo(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY_UNVERIFIED });

      const prev = qc.getQueryData<any[]>(KEY_UNVERIFIED) ?? [];
      qc.setQueryData<any[]>(KEY_UNVERIFIED, (old = []) => old.filter((r: any) => r.id !== id));

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY_UNVERIFIED, ctx.prev);
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: KEY_UNVERIFIED });
    },
  });
}

export function useCreateStation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: GasStationUpsertInput) => createStationRepo(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY_UNVERIFIED });
      await qc.invalidateQueries({ queryKey: KEY_VERIFIED });
    },
  });
}

export function useUpdateStation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: string; payload: Partial<GasStationUpsertInput> }) =>
      updateStationRepo(args.id, args.payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY_UNVERIFIED });
      await qc.invalidateQueries({ queryKey: KEY_VERIFIED });
    },
  });
}
