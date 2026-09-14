import asyncHandler from "@/utils/asyncHandler";
import ShopService from "./shop.service";

const createShop = asyncHandler(async (req, res) => {
    const result = await ShopService.createShop(req.body);
    res.status(200).json({
        success: true,
        message: "Shop is created successfully",
        data: result,
    });
});


const ShopController = {
    createShop
}

export default ShopController