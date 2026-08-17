import prisma from "../../../shared/prisma";
const getCustomer = async (contact) => {
    const result = await prisma.customer.findMany({
        where: {
            contactNumber: {
                contains: contact,
            },
        },
    });
    return result;
};
export const CustomerService = {
    getCustomer,
};
