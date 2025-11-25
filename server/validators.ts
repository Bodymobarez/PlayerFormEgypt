import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ValidationError } from "./errors";

// Auth validators
export const loginSchema = z.object({
  username: z.string().min(2, "Username too short").max(50),
  password: z.string().min(6, "Password too short"),
});

// Assessment validators
export const assessmentSchema = z.object({
  clubId: z.string().min(1),
  fullName: z.string().min(10, "Full name required"),
  birthDate: z.string().refine((val) => val !== "", "Birth date required"),
  birthPlace: z.string().min(2),
  nationalId: z.string().length(14).regex(/^\d+$/),
  address: z.string().min(5),
  phone: z.string().regex(/^01[0125][0-9]{8}$/),
  guardianPhone: z.string().regex(/^01[0125][0-9]{8}$/),
  guardianName: z.string().min(3),
  school: z.string().optional(),
  position: z.string().min(1),
  height: z.string().optional(),
  weight: z.string().optional(),
  previousClub: z.string().optional(),
  medicalHistory: z.string().optional(),
  assessmentPrice: z.number().min(1),
});

// Checkout validators
export const checkoutSchema = z.object({
  session_id: z.string().min(1),
});

// Validation function with better error handling
export function validateData<T>(schema: z.ZodSchema, data: any): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = fromZodError(result.error);
    throw new ValidationError(errors.message);
  }
  return result.data as T;
}

// Type inference
export type LoginRequest = z.infer<typeof loginSchema>;
export type AssessmentRequest = z.infer<typeof assessmentSchema>;
export type CheckoutRequest = z.infer<typeof checkoutSchema>;
