import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
const createUser = catchAsync(async (req, res) => {
    const result = await UserService.creatUserToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User create successfully",
        data: result,
    });
});
const getUser = catchAsync(async (req, res) => {
    const result = await UserService.getAllUser();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users retrived Successfully",
        data: result,
    });
});
const getUserById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await UserService.getUserById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrived Successfully",
        data: result,
    });
});
const updateUserById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await UserService.updateUserById(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrived Successfully",
        data: result,
    });
});
const updateUser = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await UserService.updateUserById(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrived Successfully",
        data: result,
    });
});
const deleteUserById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await UserService.deleteUserById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User deleted Successfully",
        data: result,
    });
});
export const UserControllers = {
    createUser,
    getUser,
    getUserById,
    updateUserById,
    deleteUserById,
    updateUser,
};
