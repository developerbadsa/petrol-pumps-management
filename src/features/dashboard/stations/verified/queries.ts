'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listVerifiedStationsRepo,
  createStationRepo,
  updateStationRepo,
  deleteStationRepo,
  type GasStationUpsertInput,
} from './repo';

const KEY = ['stations', 'verified'] as const;

export function useVerifiedStations() {
  return useQuery({
    queryKey: KEY,
    queryFn: listVerifiedStationsRepo,
  });
}

export function useCreateStation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GasStationUpsertInput) => createStationRepo(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateStation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: Partial<GasStationUpsertInput> }) =>
      updateStationRepo(args.id, args.payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteStation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStationRepo(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
