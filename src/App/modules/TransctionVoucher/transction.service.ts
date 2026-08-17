import { VoucherType } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";

const getAllVoucher = async (payload: {
  startDate?: string;
  endDate?: string;
  voucherType?: VoucherType;
  searchTerm?: string | null;
}) => {
  const { startDate, endDate, voucherType, searchTerm } = payload;
  const where: any = {};
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
  const voucher = await prisma.transactionInfo.findMany({
    where,
    orderBy: {
      date: "desc",
    },
    include: {
      party: true,
      customer: true,
    }
  });
  return voucher;
};

const getVoucherByVoucherNo = async (voucherNo: string) => {
  const voucher = await prisma.transactionInfo.findFirst({
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
      customer: {
        select: {
          name: true,
          contactNumber: true,
          address: true,
          status: true,
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
      logOrderItem: {
        select: {
          id: true,
          radis: true,
          height: true,
          quantity: true,
          u_price: true,
          amount: true,
          logGrades: {
            select: {
              gradeName: true,
              logCategory: {
                select: {
                  name: true,
                }
              }
            }
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
      logOrdByCategory: {
        select: {
          date: true,
          unitPrice: true,
          quantityAdd: true,
          quantityLess: true,
          debitAmount: true,
          creditAmount: true,
          logCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  console.log(voucher, "voucher")
  return voucher;
};

const getVoucherByid = async (id: number) => {
  if (!id) {
    throw new Error("Invalid Voucher ID");
  }
  const voucher = await prisma.transactionInfo.findFirst({
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

      logOrderItem: {
        select: {
          id: true,
          logGradeId: true,
          radis: true,
          height: true,
          quantity: true,
          u_price: true,
          amount: true,
        },
      },
      logOrdByCategory: {
        select: {
          date: true,
          unitPrice: true,
          quantityAdd: true,
          quantityLess: true,
          debitAmount: true,
          creditAmount: true,
          logCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return voucher;
};
const getDailyReport = async (date: string) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const result = await prisma.transactionInfo.findMany({
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
      customer: {
        select: {
          name: true,
          contactNumber: true,
          address: true,
          status: true,
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
      logOrderItem: {
        select: {
          id: true,
          radis: true,
          height: true,
          quantity: true,
          u_price: true,
          amount: true,
          logGrades: {
            select: {
              gradeName: true,
              logCategory: {
                select: {
                  name: true,
                },
              },
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
      logOrdByCategory: {
        select: {
          date: true,
          unitPrice: true,
          quantityAdd: true,
          quantityLess: true,
          debitAmount: true,
          creditAmount: true,
          logCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return result;
};

export const VoucherService = {
  getAllVoucher,
  getVoucherByVoucherNo,
  getVoucherByid,
  getDailyReport,
};
