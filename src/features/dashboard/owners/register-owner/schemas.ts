import {z} from 'zod';

export const registerOwnerSchema = z
  .object({
    stationOwnerName: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(6, 'Phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
    residentialAddress: z.string().min(3, 'Address is required'),
    profileImage: z
      .custom<FileList | null>()
      .refine((files) => {
        if (!files || files.length === 0) return true;
        const file = files.item(0);
        return !!file && file.size <= 10 * 1024 * 1024;
      }, 'Profile image must be 10MB or less')
      .optional(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
