import { z } from 'zod';

/**
 * Base validation schemas used across the app
 * Import these and extend as needed
 */

// ─────────────────────────────────────────────────────────────────
// String validators
// ─────────────────────────────────────────────────────────────────

export const stringSchema = z.string().trim().min(1, 'This field is required');

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const urlSchema = z.string().url('Please enter a valid URL');

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// ─────────────────────────────────────────────────────────────────
// Common form schemas
// ─────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: stringSchema.min(2, 'Name must be at least 2 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: stringSchema.min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// ─────────────────────────────────────────────────────────────────
// Study-related schemas
// ─────────────────────────────────────────────────────────────────

export const createBucketSchema = z.object({
  name: stringSchema.min(2, 'Bucket name must be at least 2 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .optional(),
  isPublic: z.boolean().optional().default(false),
});

export type CreateBucketFormData = z.infer<typeof createBucketSchema>;

export const createCardSchema = z.object({
  question: stringSchema.min(5, 'Question must be at least 5 characters'),
  answer: stringSchema.min(5, 'Answer must be at least 5 characters'),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  bucketId: z.string().uuid('Invalid bucket ID'),
});

export type CreateCardFormData = z.infer<typeof createCardSchema>;

// ─────────────────────────────────────────────────────────────────
// Generic form utilities
// ─────────────────────────────────────────────────────────────────

/**
 * Extract error message from Zod validation error
 */
export function getFormError(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    result[path] = err.message;
  });
  
  return result;
}

/**
 * Safe parse wrapper for forms
 */
export async function validateFormData<T>(
  schema: z.ZodSchema,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: getFormError(error) };
    }
    return {
      success: false,
      errors: { _general: 'An unexpected error occurred' },
    };
  }
}
