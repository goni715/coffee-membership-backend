"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const openingHour_service_1 = __importDefault(require("./openingHour.service"));
const createOpeningHour = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.headers;
    const result = await openingHour_service_1.default.createOpeningHour(userId, req.body);
    res.status(200).json({
        success: true,
        message: "Opening hour is created successfully",
        data: result,
    });
});
const OpeningHourController = {
    createOpeningHour,
};
exports.default = OpeningHourController;
