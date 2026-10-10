 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ProductionService } from "./production.service";

const createProduction = catchAsync(async (req, res) => {
  const id = req.params.id
    ? Number(req.params.id)
    : _optionalChain([req, 'access', _ => _.body, 'optionalAccess', _2 => _2.id])
    ? Number(req.body.id)
    : 0;
  const result = await ProductionService.createProduction(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: id ? "Production updated successfully" : "Production created successfully",
    data: result,
  });
});

const getProduction = catchAsync(async (req, res) => {
  const result = await ProductionService.getProduction();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Production records retrieved successfully",
    data: result,
  });
});

const getProductionById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const result = await ProductionService.getProductionById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Production record retrieved successfully",
    data: result,
  });
});

const deleteProduction = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id );
  await ProductionService.deleteProduction(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Production deleted successfully",
    data: null,
  });
});

export const ProductionController = {
  createProduction,
  getProduction,
  getProductionById,
  deleteProduction,
};
