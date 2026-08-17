import { z } from "zod";
const createUserSchema = z.object({
    email: z.string({ message: "Email is required" }),
    password: z.string({ message: "Password is required" }),
    name: z.string({ message: "Name is required" }),
    phone: z.string({ message: "Mobile number is required" }),
});
const updateUserSchema = z.object({
    name: z.string({ message: "Name is required" }).optional(),
    email: z.string({ message: "Email is required" }).email().optional(),
    phone: z.string({ message: "Mobile number is required" }).optional(),
});
export const userValidaton = {
    createUserSchema,
    updateUserSchema,
};
