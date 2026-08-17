import { UserControllers } from "./user.controllers";
import express, { NextFunction, Request, Response } from "express";
import upload from "../../../helpars/uploads";
import { userValidaton } from "./user.validation";
import validationRequiest from "../../middlewares/validationRequest";

const route = express.Router();

route.post("/", UserControllers.createUser);

route.get("/", UserControllers.getUser);

route.get("/:id", UserControllers.getUserById);

route.put("/:id", validationRequiest(userValidaton.updateUserSchema), UserControllers.updateUserById);

// route.put(
//     "/:id",
//     upload.single("photo"),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = userValidaton.updateUser.parse(JSON.parse(req.body.data));

//         return UserControllers.updateUserById(req, res, next);
//     }
// );

route.delete("/:id", UserControllers.deleteUserById);

export const UserRoute = route;
