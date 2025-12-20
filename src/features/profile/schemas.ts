import { z } from 'zod';

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(4, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(6, 'Phone is required'),
  address: z.string().min(3, 'Address is required'),
});
