"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidaton = void 0;
const zod_1 = require("zod");
const createEmployee = zod_1.z.object({
    email: zod_1.z.string({ message: "Email is required" }),
    name: zod_1.z.string({ message: "Name is required" }),
    nid: zod_1.z.string({ message: "NID number required" }).optional(),
    dob: zod_1.z.string({ message: "Father name is required" }).optional(),
    workingPlase: zod_1.z.string({ message: "Working Place is required" }),
    address: zod_1.z.string({ message: "Address is required" }),
    mobile: zod_1.z.string({ message: "Mobile number is required" }),
});
const updateEmployee = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).optional(),
    nid: zod_1.z.string({ message: "NID number required" }).optional(),
    dob: zod_1.z.string({ message: "Father name is required" }).optional(),
    workingPlase: zod_1.z
        .string({ message: "Working Place is required" })
        .optional(),
    address: zod_1.z.string({ message: "Address is required" }).optional(),
    mobile: zod_1.z.string({ message: "Working Place is required" }).optional(),
});
exports.userValidaton = {
    createEmployee,
    updateEmployee,
};
