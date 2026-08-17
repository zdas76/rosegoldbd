import { StatusCodes } from "http-status-codes";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import config from "../../config";
import AppError from "../errors/AppError";
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorize");
            }
            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret);
            req.user = verifiedUser;
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw Error("Forbidden!");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default auth;
