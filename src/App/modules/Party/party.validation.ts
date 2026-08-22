import z from "zod";

const createParty = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).trim(),
    contactNo: z.string({ message: "Contact Number is required" }),
    partyType: z.enum(["VENDOR", "PARTY", "CUSTOMER", "SUPPLIER"]),
    address: z.string().optional(),
  }),
});

const UpdateParty = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).trim().optional(),
    contactNo: z
      .string({ message: "Contact Number is required" })
      .optional(),
    partyType: z
      .enum(["VENDOR", "PARTY", "CUSTOMER"])
      .optional(),
    address: z.string().optional(),
  }),
});


export const partyValidaton = {
  createParty,
  UpdateParty,
};
