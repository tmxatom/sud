import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email:z.email('Please enter a valid email address').min(1, 'Email is required'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
});

// Registration validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(5, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters')
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), {
      message: 'Name can only contain letters and spaces'
    }),
  email: z.email('Please enter a valid email address'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => /^[0-9]{10}$/.test(val), {
      message: 'Please enter a valid 10-digit phone number'
    }),

  policyNumber: z
    .string()
    .min(3, 'Policy number must be at least 3 characters long')
    .max(20, 'Policy number must be less than 20 characters'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Complaint validation schema
export const complaintSchema = z.object({
  policyNumber: z
    .string()
    .min(1, 'Policy number is required')
    .min(3, 'Policy number must be at least 3 characters long'),
  category: z
    .enum(['Claims', 'Policy Issues', 'Billing', 'Customer Service', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid category' })
    }),
  priority: z
    .enum(['Low', 'Medium', 'High', 'Critical'], {
      errorMap: () => ({ message: 'Please select a valid priority' })
    })
    .optional()
    .default('Medium'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters long')
    .max(100, 'Subject must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must be less than 1000 characters')
});

// Comment validation schema
export const commentSchema = z.object({
  text: z
    .string()
    .min(1, 'Comment text is required')
    .max(500, 'Comment must be less than 500 characters')
});

// Helper function to format Zod errors
export const formatZodErrors = (error) => {
  console.log(z.flattenError(error).fieldErrors);
  return (z.flattenError(error).fieldErrors);
};