"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const party_service_1 = require("./party.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const party_constant_1 = require("./party.constant");
const getPartyLedger = (0, catchAsync_1.default)(async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const id = parseInt(req.params.id);
    const result = await party_service_1.PartyService.getPertyLedgerInfo(id, { startDate, endDate });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const createParty = (0, catchAsync_1.default)(async (req, res) => {
    const result = await party_service_1.PartyService.createParty(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Employee create successfully",
        data: result,
    });
});
const getAllParty = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, party_constant_1.partyfiltersFields);
    const paginat = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await party_service_1.PartyService.getAllParty(filters, paginat);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const getPartyById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await party_service_1.PartyService.getPartyById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Party retrived Successfully",
        data: result,
    });
});
const updatePartyById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await party_service_1.PartyService.updatePartyById(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Party Update Successfully",
        data: result,
    });
});
const deletePartyById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await party_service_1.PartyService.deletePartyById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Party Update Successfully",
        data: result,
    });
});
exports.PartyControllers = {
    getPartyLedger,
    createParty,
    getAllParty,
    getPartyById,
    updatePartyById,
    deletePartyById,
};
