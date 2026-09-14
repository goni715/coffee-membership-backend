"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const shop_service_1 = __importDefault(require("./shop.service"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const shop_constant_1 = require("./shop.constant");
const createShop = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.headers;
    const result = await shop_service_1.default.createShop(userId, req);
    res.status(200).json({
        success: true,
        message: "Shop is created successfully",
        data: result,
    });
});
const getShops = (0, asyncHandler_1.default)(async (req, res) => {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, shop_constant_1.SHOP_VALID_FIELDS);
    const result = await shop_service_1.default.getShops(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Shops are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getMyShop = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.headers;
    const result = await shop_service_1.default.getMyShop(userId);
    res.status(200).json({
        success: true,
        message: "My shop is retrieved successfully",
        data: result,
    });
});
const updateShop = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.headers;
    const result = await shop_service_1.default.updateShop(userId, req);
    res.status(200).json({
        success: true,
        message: "Shop is updated successfully",
        data: result,
    });
});
const ShopController = {
    createShop,
    getShops,
    getMyShop,
    updateShop
};
exports.default = ShopController;
