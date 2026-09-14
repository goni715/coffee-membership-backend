import asyncHandler from "@/utils/asyncHandler";
import ShopService from "./shop.service";
import pickValidFields from "@/utils/pickValidFields";
import { SHOP_VALID_FIELDS } from "./shop.constant";

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

const ShopController = {
    createShop,
    getShops,
    getMyShop,
    updateShop
}

export default ShopController