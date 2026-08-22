import { EmployeeControllers } from "./empoyee.controllers";
import express, { NextFunction, Request, Response } from "express";
import upload from "../../../helpars/uploads";
import { userValidaton } from "./employee.validation";

const route = express.Router();

route.post(
  "/create-employee",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    req.body = userValidaton.createEmployee.parse(payload);
    return EmployeeControllers.createEmployee(req, res, next);
  }
);

route.get("/", EmployeeControllers.getEmployee);

route.get("/:id", EmployeeControllers.getEmployeeById);

route.put(
  "/:id",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    req.body = userValidaton.updateEmployee.parse(payload);

    return EmployeeControllers.updateEmployeeById(req, res, next);
  }
);

route.delete("/:id", EmployeeControllers.deleteEmployeeById);

export const EmployeeRoute = route;
