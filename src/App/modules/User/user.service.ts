
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { Request } from "express";
import { TUser } from "./user.validation";
import { Status } from "../../../../generated/prisma/enums";
import { User } from "../../../../generated/prisma/client";

const creatUserToDB = async (payload: TUser) => {
  const hashedPassword = bcrypt.hashSync(
    payload.password,
    parseInt(config.hash_round as any)
  );

  const createUser = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      name: payload.name,
      phone: payload.phone,
    },
  });
  return createUser;
};

const getAllUser = async () => {
  const result = await prisma.user.findMany({
    where: {
      status: Status.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      status: true,
    },
  });

  return result;
};

const getUserById = async (id: number) => {
  const result = await prisma.user.findFirst({
    where: {
      id: id,
      status: Status.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      status: true,
    },
  });
  return result;
};

const updateUserById = async (id: number, payload: Partial<User>) => {
  const result = await prisma.user.update({
    where: {
      id: id,
      status: Status.ACTIVE,
    },
    data: payload,
  });
  return result;
};

const deleteUserById = async (id: number) => {
  const result = await prisma.user.update({
    where: {
      id: id,
      status: Status.ACTIVE,
    },
    data: {
      status: Status.DELETED,
    },
  });
  return result;
};

export const UserService = {
  creatUserToDB,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
