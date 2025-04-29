import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().max(100, "fullName can be 100 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string(),
  address: z.string(),
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.number(),
});

export const createProfileSchema = z.object({
  role: z.string().nonempty("Role is required"),
  firmName: z.string().nonempty("Firm / Organization name is required"),
  firmAddress: z.string().nonempty("Firm / Organization address is required"),
  jobTitle: z.string().nonempty("Job title is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
