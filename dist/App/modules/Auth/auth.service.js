"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcryptjs"));
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const enums_1 = require("../../../generated/prisma/enums");
const loginUser = async (payLoad) => {
    const userData = await prisma_1.default.user.findFirst({
        where: {
            email: payLoad.email,
            status: enums_1.Status.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error("User name or password not found");
    }
    const isCurrentPasword = await bcrypt.compare(payLoad.password, userData?.password);
    if (!isCurrentPasword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        role: userData?.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        role: userData?.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const refreshToken = async (token) => {
    let userData;
    try {
        userData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your are not Authorized");
    }
    const checkUser = await prisma_1.default.employee.findUniqueOrThrow({
        where: {
            email: userData.email,
            status: enums_1.Status.ACTIVE,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        nid: userData.nid,
        role: userData?.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
};
const changePassword = async (user, data) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = await bcrypt.compare(data.olePassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your are not Authorized");
    }
    const hassPassWord = await bcrypt.hash(data.newPassword, parseInt(config_1.default.hash_round));
    await prisma_1.default.user.update({
        where: {
            email: userData.email,
            status: enums_1.Status.ACTIVE,
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
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: playLoad.email,
            status: enums_1.Status.ACTIVE,
        },
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData?.email,
        name: userData.name,
        role: userData?.role,
    }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link +
        `?email=${userData.email}&token=${resetPasswordToken}`;
    await (0, emailSender_1.default)(userData.email, `
    <p> Your password reset link 
    <a href=${resetPassLink}>
      Reset Password
    </a>
    </p>
    `);
};
const resetPassword = async (token, payLoad) => {
    const userData = await prisma_1.default.employee.findUniqueOrThrow({
        where: {
            email: payLoad.email,
            status: enums_1.Status.ACTIVE,
        },
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your are not Authorized");
    }
    const hassPassWord = await bcrypt.hash(payLoad.passWord, parseInt(config_1.default.hash_round));
    await prisma_1.default.user.update({
        where: {
            email: userData.email,
            status: enums_1.Status.ACTIVE,
        },
        data: {
            password: hassPassWord,
        },
    });
};
exports.AuthService = {
    loginUser,
    refreshToken,
    forgotPassword,
    changePassword,
    resetPassword,
};
