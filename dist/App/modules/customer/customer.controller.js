import catchAsync from "../../../shared/catchAsync";
import { CustomerService } from "./customer.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
const getCustomer = catchAsync(async (req, res) => {
    const contactNumber = req.query.contact;
    const result = await CustomerService.getCustomer(contactNumber);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Get customer Successfully by contact Number",
        data: result,
    });
});
export const CustomerControllers = {
    getCustomer,
};
