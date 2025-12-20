import { env } from '@/lib/env';
import { mockDelay } from '@/lib/mockDelay';
import { MOCK_PROFILE } from './mock';
import type { ChangePasswordInput, Profile, UpdateProfileInput } from './types';

export type ProfileRepo = {
  getMe: () => Promise<Profile>;
  uploadAvatar: (file: File) => Promise<{ avatarUrl: string }>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<Profile>;
};

let profileState: Profile = structuredClone(MOCK_PROFILE);

const mockProfileRepo: ProfileRepo = {
  async getMe() {
    await mockDelay(300);
    return structuredClone(profileState);
  },

  async uploadAvatar(file) {
    await mockDelay(500);
    const fakeUrl = URL.createObjectURL(file);
    profileState = { ...profileState, avatarUrl: fakeUrl };
    return { avatarUrl: fakeUrl };
  },

  async changePassword() {
    await mockDelay(450);
  },

  async updateProfile(input) {
    await mockDelay(450);
    profileState = { ...profileState, ...input };
    return structuredClone(profileState);
  },
};

const apiProfileRepo: ProfileRepo = {
  async getMe() {
    throw new Error('API repo not implemented yet');
  },
  async uploadAvatar() {
    throw new Error('API repo not implemented yet');
  },
  async changePassword() {
    throw new Error('API repo not implemented yet');
  },
  async updateProfile() {
    throw new Error('API repo not implemented yet');
  },
};

export const profileRepo: ProfileRepo = env.dataMode === 'mock' ? mockProfileRepo : apiProfileRepo;
