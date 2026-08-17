import StatusCodes from "http-status-codes";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcryptjs";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";
import emailSender from "./emailSender";
import AppError from "../../errors/AppError";
import { Status } from "../../../generated/prisma/enums";
const loginUser = async (payLoad) => {
    const userData = await prisma.user.findFirst({
        where: {
            email: payLoad.email,
            status: Status.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error("User name or password not found");
    }
    const isCurrentPasword = await bcrypt.compare(payLoad.password, userData?.password);
    if (!isCurrentPasword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        role: userData?.role,
    }, config.jwt.jwt_secret, config.jwt.expires_in);
    const refreshToken = jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        role: userData?.role,
    }, config.jwt.refresh_token_secret, config.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const refreshToken = async (token) => {
    let userData;
    try {
        userData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret);
    }
    catch (error) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Your are not Authorized");
    }
    const checkUser = await prisma.employee.findUniqueOrThrow({
        where: {
            email: userData.email,
            status: Status.ACTIVE,
        },
    });
    const accessToken = jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        nid: userData.nid,
        role: userData?.role,
    }, config.jwt.jwt_secret, config.jwt.expires_in);
    return {
        accessToken,
    };
};
const changePassword = async (user, data) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = await bcrypt.compare(data.olePassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Your are not Authorized");
    }
    const hassPassWord = await bcrypt.hash(data.newPassword, parseInt(config.hash_round));
    await prisma.user.update({
        where: {
            email: userData.email,
            status: Status.ACTIVE,
        },
        data: {
            password: hassPassWord,
        },
    });
    return {
        message: "Password Change Succesfully",
    };
};
const forgotPassword = async (playLoad) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: playLoad.email,
            status: Status.ACTIVE,
        },
    });
    const resetPasswordToken = jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        role: userData?.role,
    }, config.jwt.reset_pass_secret, config.jwt.reset_pass_token_expires_in);
    const resetPassLink = config.reset_pass_link +
        `?email=${userData.email}&token=${resetPasswordToken}`;
    await emailSender(userData.email, `
    <p> Your password reset link 
    <a href=${resetPassLink}>
      Reset Password
    </a>
    </p>
    `);
};
const resetPassword = async (token, payLoad) => {
    const userData = await prisma.employee.findUniqueOrThrow({
        where: {
            email: payLoad.email,
            status: Status.ACTIVE,
        },
    });
    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Your are not Authorized");
    }
    const hassPassWord = await bcrypt.hash(payLoad.passWord, parseInt(config.hash_round));
    await prisma.user.update({
        where: {
            email: userData.email,
            status: Status.ACTIVE,
        },
        data: {
            password: hassPassWord,
        },
    });
};
export const AuthService = {
    loginUser,
    refreshToken,
    forgotPassword,
    changePassword,
    resetPassword,
};
