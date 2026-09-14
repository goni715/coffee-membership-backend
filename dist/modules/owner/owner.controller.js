"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const owner_service_1 = __importDefault(require("./owner.service"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const owner_constant_1 = require("./owner.constant");
const createOwner = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await owner_service_1.default.createOwner(req.body);
    res.status(200).json({
        success: true,
        message: "Owner is created successfully",
        data: result,
    });
});
const getOwners = (0, asyncHandler_1.default)(async (req, res) => {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, owner_constant_1.OWNER_VALID_FIELDS);
    const result = await owner_service_1.default.getOwners(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Owners are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const updateOwner = (0, asyncHandler_1.default)(async (req, res) => {
    const { ownerId } = req.params;
    const result = await owner_service_1.default.updateOwner(ownerId, req.body);
    res.status(200).json({
        success: true,
        message: "Owner is updated successfully",
        data: result,
    });
});
const deleteOwner = (0, asyncHandler_1.default)(async (req, res) => {
    const { ownerId } = req.params;
    const result = await owner_service_1.default.deleteOwner(ownerId);
    res.status(200).json({
        success: true,
        message: "Owner is deleted successfully",
        data: result,
    });
});
const OwnerController = {
    createOwner,
    getOwners,
    updateOwner,
    deleteOwner
};
exports.default = OwnerController;
