'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
   type CreateZonalCommitteeInput,
   type ZonalCommitteeUpdateInput,
   zonalCommitteeRepo,
} from './repo';
import type {DivisionOption, ZonalCommitteeRow} from './types';

export function useZonalCommitteeMembers() {
   return useQuery({
      queryKey: ['zonal-committee', 'members'],
      queryFn: () => zonalCommitteeRepo.list(),
      staleTime: 20_000,
      refetchOnWindowFocus: false,
   });
}

export function useDivisionOptions() {
   return useQuery<DivisionOption[]>({
      queryKey: ['zonal-committee', 'divisions'],
      queryFn: () => zonalCommitteeRepo.listDivisions(),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
   });
}

export function useCreateZonalCommitteeMember() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: (input: CreateZonalCommitteeInput) =>
         zonalCommitteeRepo.create(input),
      onSuccess: () => {
         qc.invalidateQueries({queryKey: ['zonal-committee', 'members']});
      },
   });
}

export function useDeleteZonalCommitteeMember() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: (id: number) => zonalCommitteeRepo.remove(id),

      onMutate: async (id) => {
         await qc.cancelQueries({queryKey: ['zonal-committee', 'members']});

         const prev =
            qc.getQueryData<ZonalCommitteeRow[]>([
               'zonal-committee',
               'members',
            ]) ?? [];
         qc.setQueryData<ZonalCommitteeRow[]>(
            ['zonal-committee', 'members'],
            prev.filter((m) => m.id !== Number(id))
         );

         return {prev};
      },

      onError: (_err, _id, ctx) => {
         if (ctx?.prev)
            qc.setQueryData(['zonal-committee', 'members'], ctx.prev);
      },

      onSettled: () => {
         qc.invalidateQueries({queryKey: ['zonal-committee', 'members']});
      },
   });
}

export function useUpdateZonalCommitteeMember() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: (input: ZonalCommitteeUpdateInput) =>
         zonalCommitteeRepo.update(input),
      onSuccess: () => {
         qc.invalidateQueries({queryKey: ['zonal-committee', 'members']});
      },
   });
}
