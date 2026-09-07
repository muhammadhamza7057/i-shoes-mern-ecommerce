import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  addresses: z
    .array(
      z.object({
        _id: z.string().optional(),
        label: z.string().trim().optional(),
        street: z.string().trim().min(1),
        city: z.string().trim().min(1),
        state: z.string().trim().min(1),
        postalCode: z.string().trim().min(1),
        country: z.string().trim().min(1),
        phone: z.string().trim().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export default { updateMeSchema, changePasswordSchema };
