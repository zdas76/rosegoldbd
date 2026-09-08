"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllVoucher = async (payload) => {
    const { startDate, endDate, voucherType, searchTerm } = payload;
    const where = {};
    // Voucher Type
    if (voucherType) {
        where.voucherType = voucherType;
    }
    // Date Range (only if valid)
    if (startDate || endDate) {
        where.date = {};
        if (startDate && !isNaN(Date.parse(startDate))) {
            where.date.gte = new Date(startDate);
        }
        if (endDate && !isNaN(Date.parse(endDate))) {
            where.date.lte = new Date(endDate);
        }
        // remove empty date object
        if (Object.keys(where.date).length === 0) {
            delete where.date;
        }
    }
    // Search Term (ignore undefined / empty)
    if (searchTerm && searchTerm !== "undefined") {
        where.OR = [
            {
                voucherNo: {
                    contains: searchTerm,
                },
            },
            {
                invoiceNo: {
                    contains: searchTerm,
                },
            },
        ];
    }
    const voucher = await prisma_1.default.transactionInfo.findMany({
        where,
        orderBy: {
            date: "desc",
        },
        include: {
            party: true,
        }
    });
    return voucher;
};
const getVoucherByVoucherNo = async (voucherNo) => {
    const voucher = await prisma_1.default.transactionInfo.findFirst({
        where: {
            voucherNo: voucherNo,
        },
        include: {
            party: {
                select: {
                    name: true,
                    contactNo: true,
                    address: true,
                    partyType: true,
                },
            },
            bankTransaction: {
                select: {
                    date: true,
                    debitAmount: true,
                    creditAmount: true,
                    bankAccount: {
                        select: {
                            bankName: true,
                            branceName: true,
                            accountNumber: true,
                            status: true,
                        },
                    },
                },
            },
            journal: {
                select: {
                    accountsItemId: true,
                    date: true,
                    creditAmount: true,
                    debitAmount: true,
                    narration: true,
                    accountsItem: {
                        select: {
                            accountsItemName: true,
                        },
                    },
                },
            },
            inventory: {
                select: {
                    id: true,
                    productId: true,
                    rawId: true,
                    product: {
                        select: {
                            name: true,
                        },
                    },
                    raWMaterial: {
                        select: {
                            name: true,
                        },
                    },
                    date: true,
                    quantityAdd: true,
                    quantityLess: true,
                    debitAmount: true,
                    creditAmount: true,
                },
            },
        },
    });
    console.log(voucher, "voucher");
    return voucher;
};
const getVoucherByid = async (id) => {
    if (!id) {
        throw new Error("Invalid Voucher ID");
    }
    const voucher = await prisma_1.default.transactionInfo.findFirst({
        where: {
            id: id
        },
        include: {
            party: {
                select: {
                    name: true,
                    contactNo: true,
                    address: true,
                    partyType: true,
                },
            },
            bankTransaction: {
                select: {
                    date: true,
                    debitAmount: true,
                    creditAmount: true,
                    bankAccount: {
                        select: {
                            bankName: true,
                            branceName: true,
                            accountNumber: true,
                            status: true,
                        },
                    },
                },
            },
            journal: {
                select: {
                    accountsItemId: true,
                    date: true,
                    creditAmount: true,
                    debitAmount: true,
                    narration: true,
                    accountsItem: {
                        select: {
                            accountsItemName: true,
                        },
                    },
                },
            },
        },
    });
    return voucher;
};
const getDailyReport = async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const result = await prisma_1.default.transactionInfo.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            party: {
                select: {
                    name: true,
                    contactNo: true,
                    address: true,
                    partyType: true,
                },
            },
            bankTransaction: {
                select: {
                    date: true,
                    debitAmount: true,
                    creditAmount: true,
                    bankAccount: {
                        select: {
                            bankName: true,
                            branceName: true,
                            accountNumber: true,
                            status: true,
                        },
                    },
                },
            },
            journal: {
                select: {
                    accountsItemId: true,
                    date: true,
                    creditAmount: true,
                    debitAmount: true,
                    narration: true,
                    accountsItem: {
                        select: {
                            accountsItemName: true,
                        },
                    },
                },
            },
            inventory: {
                select: {
                    id: true,
                    productId: true,
                    rawId: true,
                    product: {
                        select: {
                            name: true,
                        },
                    },
                    raWMaterial: {
                        select: {
                            name: true,
                        },
                    },
                    date: true,
                    quantityAdd: true,
                    quantityLess: true,
                    debitAmount: true,
                    creditAmount: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });
    return result;
};
exports.VoucherService = {
    getAllVoucher,
    getVoucherByVoucherNo,
    getVoucherByid,
    getDailyReport,
};
