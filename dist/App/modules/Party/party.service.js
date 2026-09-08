"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const paginationHelpers_1 = require("../../../helpars/paginationHelpers");
const party_constant_1 = require("./party.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const client_1 = require("@prisma/client");
const getPertyLedgerInfo = async (params, paginat) => {
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.Pagination(paginat);
    const { searchTerm, ...filterData } = params;
    const andCondition = [];
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
                AND: filterConditions,
            });
        }
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = await prisma_1.default.transactionInfo.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginat.sortBy && paginat.sortOrder
            ? {
                [paginat.sortBy]: paginat.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    return result;
};
const createParty = async (payload) => {
    const isExist = await prisma_1.default.party.findFirst({
        where: {
            name: payload.name,
            contactNo: payload.contactNo,
            partyType: payload.partyType,
            isDeleted: false,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This User Already Exist");
    }
    const crateParty = await prisma_1.default.party.create({
        data: {
            name: payload.name,
            contactNo: payload.contactNo,
            address: payload.address,
            partyType: payload.partyType,
        },
    });
    return crateParty;
};
const getAllParty = async (params, paginat) => {
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.Pagination(paginat);
    const { searchTerm, ...filterData } = params;
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: party_constant_1.PartySearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                },
            })),
        });
    }
    if (params?.partyType) {
        andCondition.push({
            partyType: params.partyType,
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => {
            if (key === "partyType") {
                return {
                    [key]: {
                        equals: filterData[key] === client_1.PartyType.PARTY ? undefined : filterData[key],
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
                AND: filterConditions,
            });
        }
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : { isDeleted: false };
    const result = await prisma_1.default.party.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginat.sortBy && paginat.sortOrder
            ? {
                [paginat.sortBy]: paginat.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    return result;
};
const getPartyById = async (id) => {
    const result = await prisma_1.default.party.findFirst({
        where: {
            id: id,
        },
    });
    return result;
};
const updatePartyById = async (id, payload) => {
    const isExist = await prisma_1.default.party.findFirst({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Party Found ");
    }
    const result = await prisma_1.default.party.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return result;
};
const deletePartyById = async (id) => {
    const isExist = await prisma_1.default.party.findFirst({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No party found");
    }
    const result = await prisma_1.default.party.update({
        where: {
            id: id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
};
exports.PartyService = {
    getPertyLedgerInfo,
    createParty,
    getAllParty,
    getPartyById,
    updatePartyById,
    deletePartyById,
};
