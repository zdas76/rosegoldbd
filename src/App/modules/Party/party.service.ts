
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PartySearchAbleFields } from "./party.constant";
import AppError from "../../errors/AppError";
import { Party, PartyType, Prisma } from "../../../../generated/prisma/browser";


const getPertyLedgerInfo = async (params: any, paginat: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);
  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.TransactionInfoWhereInput[] = [];
  if (params.searchTerm) {
    andCondition.push({
      OR: [
        {
          party: {
            partyType: params?.partyType,
          },
        },
        {
          voucherNo: {
            contains: params.searchTerm,
          },
        },
        {
          party: {
            name: {
              contains: params.searchTerm,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData)
      .map((key) => {
        if (key === "partyType") {
          // Handle the invalid "PARTY" value from the error report if necessary
          // or just ensure it's a valid enum value for the related Party model
          return {
            party: {
              partyType: filterData[key] === "PARTY" ? undefined : filterData[key],
            },
          };
        }
        return {
          [key]: {
            equals: filterData[key],
          },
        };
      })
      .filter((condition) => Object.values(condition)[0] !== undefined);

    if (filterConditions.length > 0) {
      andCondition.push({
        AND: filterConditions as Prisma.TransactionInfoWhereInput[],
      });
    }
  }
  const whereConditions: Prisma.TransactionInfoWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.transactionInfo.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginat.sortBy && paginat.sortOrder
        ? {
          [paginat.sortBy]: paginat.sortOrder,
        }
        : {
          createdAt: "desc",
        },
  });
  return result;
};

const createParty = async (payload: Party) => {

  const isExist = await prisma.party.findFirst({
    where: {
      name: payload.name,
      contactNo: payload.contactNo,
      partyType: payload.partyType,
      isDeleted: false,
    },
  });
  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This User Already Exist");
  }

  const crateParty = await prisma.party.create({
    data: {
      name: payload.name,
      contactNo: payload.contactNo,
      address: payload.address,
      partyType: payload.partyType,
    },
  });

  return crateParty;
};

const getAllParty = async (params: any, paginat: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.PartyWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: PartySearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
        },
      })),
    });
  }
  if (params?.partyType) {
    andCondition.push({
      partyType: params.partyType,
    })
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => {
      if (key === "partyType") {
        return {
          [key]: {
            equals: filterData[key] === PartyType.PARTY ? undefined : (filterData[key] as Prisma.EnumPartyTypeFilter),
          },
        };
      }
      return {
        [key]: {
          equals: filterData[key],
        },
      };
    }).filter(condition => Object.values(condition)[0].equals !== undefined);

    if (filterConditions.length > 0) {
      andCondition.push({
        AND: filterConditions as Prisma.PartyWhereInput[],
      });
    }
  }


  const whereConditions: Prisma.PartyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : { isDeleted: false };

  const result = await prisma.party.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginat.sortBy && paginat.sortOrder
        ? {
          [paginat.sortBy]: paginat.sortOrder,
        }
        : {
          createdAt: "desc",
        },
  });

  return result;
};

const getPartyById = async (id: number) => {
  const result = await prisma.party.findFirst({
    where: {
      id: id,
    },
  });

  return result;
};

const updatePartyById = async (id: number, payload: Partial<Party>) => {
  const isExist = await prisma.party.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Party Found ");
  }

  const result = await prisma.party.update({
    where: {
      id: id,
    },
    data: payload,
  });

  return result;
};

const deletePartyById = async (id: number) => {
  const isExist = await prisma.party.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No party found");
  }

  const result = await prisma.party.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const PartyService = {
  getPertyLedgerInfo,
  createParty,
  getAllParty,
  getPartyById,
  updatePartyById,
  deletePartyById,
};
