import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileRepo } from './repo';
import type { ChangePasswordInput, UpdateProfileInput } from './types';

export function useMeProfile() {
  return useQuery({
    queryKey: ['me', 'profile'],
    queryFn: () => profileRepo.getMe(),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profileRepo.uploadAvatar(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me', 'profile'] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => profileRepo.changePassword(input),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileRepo.updateProfile(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me', 'profile'] }),
  });
}
