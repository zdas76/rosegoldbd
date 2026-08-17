import { z } from "zod";

const createEmployee = z.object({
  email: z.string({ message: "Email is required" }),
  name: z.string({ message: "Name is required" }),
  nid: z.string({ message: "NID number required" }).optional(),
  dob: z.string({ message: "Father name is required" }).optional(),
  workingPlase: z.string({ message: "Working Place is required" }),
  address: z.string({ message: "Address is required" }),
  mobile: z.string({ message: "Mobile number is required" }),
});

const updateEmployee = z.object({
  name: z.string({ message: "Name is required" }).optional(),
  nid: z.string({ message: "NID number required" }).optional(),
  dob: z.string({ message: "Father name is required" }).optional(),
  workingPlase: z
    .string({ message: "Working Place is required" })
    .optional(),
  address: z.string({ message: "Address is required" }).optional(),
  mobile: z.string({ message: "Working Place is required" }).optional(),
});

export const userValidaton = {
  createEmployee,
  updateEmployee,
};
