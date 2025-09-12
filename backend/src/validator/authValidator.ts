import { z } from 'zod';

export const authSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).max(100),
  email: z.string().email(),
});

export type AuthInput = z.infer<typeof authSchema>; 