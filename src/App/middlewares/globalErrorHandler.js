 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

import { StatusCodes } from "http-status-codes";
import handelZodError from "../errors/handelZorError";
import { ZodError } from "zod";
import AppError from "../errors/AppError";

const globalErrorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof ZodError) {
    const simplifedError = handelZodError(err);
    statusCode = _optionalChain([simplifedError, 'optionalAccess', _ => _.statusCode]);
    message = _optionalChain([simplifedError, 'optionalAccess', _2 => _2.message]);
    error = simplifedError.errorSources;
  } else if (err.code === "P2025") {
    message = "Validation Error";
    error = err.message;
  } else if (err.code === "P2002") {
    message = "Duplicate error";
    error = err.meta;
  } else if (err instanceof AppError) {
    statusCode = _optionalChain([err, 'optionalAccess', _3 => _3.statusCode]);
    message = _optionalChain([err, 'optionalAccess', _4 => _4.message]);
    error = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = _optionalChain([err, 'optionalAccess', _5 => _5.message]);
    error = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export default globalErrorHandler;
