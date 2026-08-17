import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PartyService } from "./party.service";
import pick from "../../../shared/pick";
import { partyfiltersFields } from "./party.constant";
const getPartyLedger = catchAsync(async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const id = parseInt(req.params.id);
    const result = await PartyService.getPertyLedgerInfo(id, { startDate, endDate });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const createParty = catchAsync(async (req, res) => {
    const result = await PartyService.createParty(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Employee create successfully",
        data: result,
    });
});
const getAllParty = catchAsync(async (req, res) => {
    const filters = pick(req.query, partyfiltersFields);
    const paginat = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await PartyService.getAllParty(filters, paginat);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const getPartyById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await PartyService.getPartyById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Party retrived Successfully",
        data: result,
    });
});
const updatePartyById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await PartyService.updatePartyById(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Party Update Successfully",
        data: result,
    });
});
const deletePartyById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await PartyService.deletePartyById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Party Update Successfully",
        data: result,
    });
});
export const PartyControllers = {
    getPartyLedger,
    createParty,
    getAllParty,
    getPartyById,
    updatePartyById,
    deletePartyById,
};
