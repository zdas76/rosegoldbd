import { z } from "zod";

const createUserSchema = z.object({
  email: z.string({ required_error: "Email is required" }),
  password: z.string({ required_error: "Password is required" }),
  name: z.string({ required_error: "Name is required" }),
  phone: z.string({ required_error: "Mobile number is required" }),
});
export type TUser = z.infer<typeof createUserSchema>

const updateUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }).optional(),
  email: z.string({ required_error: "Email is required" }).email().optional(),
  phone: z.string({ required_error: "Mobile number is required" }).optional(),
});

export const userValidaton = {
  createUserSchema,
  updateUserSchema,
};
