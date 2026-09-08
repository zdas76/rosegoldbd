"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidaton = void 0;
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "Email is required" }),
    password: zod_1.z.string({ message: "Password is required" }),
    name: zod_1.z.string({ message: "Name is required" }),
    phone: zod_1.z.string({ message: "Mobile number is required" }),
});
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).optional(),
    email: zod_1.z.string({ message: "Email is required" }).email().optional(),
    phone: zod_1.z.string({ message: "Mobile number is required" }).optional(),
});
exports.userValidaton = {
    createUserSchema,
    updateUserSchema,
};
