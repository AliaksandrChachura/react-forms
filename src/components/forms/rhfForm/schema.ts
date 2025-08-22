import { z } from 'zod';

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'Name must start with an uppercase letter')
      .min(2, 'Name must be at least 2 characters long'),
    age: z
      .number()
      .min(0, 'Age cannot be negative')
      .min(18, 'Must be at least 18 years old')
      .max(120, 'Age must be reasonable'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z.string().min(1, 'Please select a gender'),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must agree to the terms and conditions'
      ),
    imageBase64: z
      .string()
      .optional()
      .refine((base64) => {
        if (!base64 || base64 === '') return true;
        return base64.startsWith('data:image/');
      }, 'Invalid image format')
      .refine((base64) => {
        if (!base64 || base64 === '') return true;
        const allowedTypes = [
          'data:image/png',
          'data:image/jpeg',
          'data:image/jpg',
          'data:image/svg+xml',
        ];
        return allowedTypes.some((type) => base64.startsWith(type));
      }, 'Only PNG, JPEG, and SVG images are allowed'),
    country: z.string().min(1, 'Please select a country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type FormSchema = z.infer<typeof formSchema>;
