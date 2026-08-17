import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
        },
    });
});
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Accerss token genereated Successfully",
        data: result,
        // data: {accessToken: result.accessToken, changePassword : result.changePassword}
    });
});
const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const data = req.body;
    const result = await AuthService.changePassword(user, data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Password Change Succesfully",
        data: result,
    });
});
const forgotPassword = catchAsync(async (req, res) => {
    const result = await AuthService.forgotPassword(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "check your email",
        data: null,
    });
});
const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization || " ";
    await AuthService.resetPassword(token, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Password reset Succesfully",
        data: null,
    });
});
export const AuthControllers = {
    loginUser,
    forgotPassword,
    changePassword,
    refreshToken,
    resetPassword,
};
