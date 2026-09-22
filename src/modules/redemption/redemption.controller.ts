import asyncHandler from "@/utils/asyncHandler";
import RedemptionService from "./redemption.service";


const generateRedemptionQrCode = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { shopId } = req.body;
    const result = await RedemptionService.generateRedemptionQrCode(userId as string, shopId as string);

    res.status(200).json({
        success: true,
        message: "Qr Code generated successfully.",
        data: result
    })
})

const getOwnerRedemptions = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = (req as any).validatedQuery;
    const result = await RedemptionService.getOwnerRedemptions(userId as string, validatedQuery);

    res.status(200).json({
        success: true,
        message: "Redemptions are retrieved successfully.",
        meta: result.meta,
        data: result.data
    })
})

const getCustomerRedemptions = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = (req as any).validatedQuery;
    const result = await RedemptionService.getCustomerRedemptions(userId as string, validatedQuery);

    res.status(200).json({
        success: true,
        message: "Redemptions are retrieved successfully.",
        meta: result.meta,
        data: result.data
    })
})

const verifyQrCode = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { qrCode } = req.body;
    const result = await RedemptionService.verifyQrCode(userId as string, qrCode as string);

    res.status(200).json({
        success: true,
        message: "QR code verified successfully.",
        data: result
    })
})


const getSingleRedemptionByQrCode = asyncHandler(async (req, res) => {
    const { userId, role } = req.headers;
    const { qrCode } = req.params;
    const result = await RedemptionService.getSingleRedemptionByQrCode(userId as string, role as 'owner' | 'customer', qrCode as string);

    res.status(200).json({
        success: true,
        message: "Redemption is retrieved successfully.",
        data: result
    })
})


const RedemptionController = {
    generateRedemptionQrCode,
    getOwnerRedemptions,
    getCustomerRedemptions,
    verifyQrCode,
    getSingleRedemptionByQrCode
}

export default RedemptionController;
