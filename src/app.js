
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./App/routes";
import globalErrorHandler from "./App/middlewares/globalErrorHandler";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zdas.com.bd",
      "http://zdas.com.bd",
      "https://rose-gold-chemical.vercel.app/dashboard",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
