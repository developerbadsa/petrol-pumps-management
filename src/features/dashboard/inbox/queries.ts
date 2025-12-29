'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inboxRepo } from './repo';
import type { InboxMessage } from './types';

export function useInboxMessages() {
  return useQuery({
    queryKey: ['inbox', 'messages'],
    queryFn: () => inboxRepo.list(),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
}

export function useTrashMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inboxRepo.remove(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['inbox', 'messages'] });

      const prev = qc.getQueryData<InboxMessage[]>(['inbox', 'messages']) ?? [];
      qc.setQueryData<InboxMessage[]>(
        ['inbox', 'messages'],
        prev.filter((m) => m.id !== id)
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['inbox', 'messages'], ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['inbox', 'messages'] });
    },
  });
}

export function useSendReply() {
  // There is no reply endpoint in your Laravel docs.
  // So for now: open the user's email client via mailto.
  return useMutation({
    mutationFn: async (payload: { to: string; subject: string; body: string }) => {
      const url =
        `mailto:${encodeURIComponent(payload.to)}` +
        `?subject=${encodeURIComponent(payload.subject)}` +
        `&body=${encodeURIComponent(payload.body)}`;

      window.location.href = url;
      return { ok: true };
    },
  });
}
