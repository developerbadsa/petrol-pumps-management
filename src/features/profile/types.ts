export type Profile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string | null;
};

export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateProfileInput = Pick<Profile, 'fullName' | 'email' | 'phone' | 'address'>;
