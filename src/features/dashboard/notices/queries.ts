import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {noticesRepo} from './repo';

const KEY = ['dashboard', 'notices'];

export function useNoticesList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => noticesRepo.list(),
  });
}

export function useDeleteNotice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noticesRepo.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({queryKey: KEY});
    },
  });
}
