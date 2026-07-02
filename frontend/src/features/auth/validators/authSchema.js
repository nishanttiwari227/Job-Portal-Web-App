import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    role: z.enum(['candidate', 'recruiter'], 'Please select a role'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export { loginSchema, registerSchema, emailVerificationSchema };
