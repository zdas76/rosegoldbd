"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const user_controllers_1 = require("./user.controllers");
const express_1 = __importDefault(require("express"));
const user_validation_1 = require("./user.validation");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const route = express_1.default.Router();
route.post("/", user_controllers_1.UserControllers.createUser);
route.get("/", user_controllers_1.UserControllers.getUser);
route.get("/:id", user_controllers_1.UserControllers.getUserById);
route.put("/:id", (0, validationRequest_1.default)(user_validation_1.userValidaton.updateUserSchema), user_controllers_1.UserControllers.updateUserById);
// route.put(
//     "/:id",
//     upload.single("photo"),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = userValidaton.updateUser.parse(JSON.parse(req.body.data));
//         return UserControllers.updateUserById(req, res, next);
//     }
// );
route.delete("/:id", user_controllers_1.UserControllers.deleteUserById);
exports.UserRoute = route;
