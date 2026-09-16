import asyncHandler from "@/utils/asyncHandler";
import ShopService from "./shop.service";
import pickValidFields from "@/utils/pickValidFields";
import { CUSTOMER_SHOP_VALID_FIELDS, SHOP_VALID_FIELDS } from "./shop.constant";

const createShop = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await ShopService.createShop(userId as string, req);
    res.status(200).json({
        success: true,
        message: "Shop is created successfully",
        data: result,
    });
});

const getShops = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, SHOP_VALID_FIELDS);
    const result = await ShopService.getShops(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Shops are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getCustomerShops = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, CUSTOMER_SHOP_VALID_FIELDS);
    const result = await ShopService.getCustomerShops(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Shops are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSingleShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const result = await ShopService.getSingleShop(shopId as string);
    res.status(200).json({
        success: true,
        message: "Shop is retrieved successfully",
        data: result,
    });
});

const getSingleCustomerShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const result = await ShopService.getSingleCustomerShop(shopId as string);
    res.status(200).json({
        success: true,
        message: "Shop is retrieved successfully",
        data: result,
    });
});

const getMyShop = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await ShopService.getMyShop(userId as string);
    res.status(200).json({
        success: true,
        message: "My shop is retrieved successfully",
        data: result,
    });
});

const updateShop = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await ShopService.updateShop(userId as string, req);
    res.status(200).json({
        success: true,
        message: "Shop is updated successfully",
        data: result,
    });
});

const updateShopStatus = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const { status } = req.body;
    const result = await ShopService.updateShopStatus(shopId as string, status);
    res.status(200).json({
        success: true,
        message: "Shop status is updated successfully",
        data: result,
    });
});

const ShopController = {
    createShop,
    getShops,
    getCustomerShops,
    getSingleShop,
    getSingleCustomerShop,
    getMyShop,
    updateShop,
    updateShopStatus
}

export default ShopController