import asyncHandler from "@/utils/asyncHandler";
import SupportService from "./support.service";
import pickValidFields from "@/utils/pickValidFields";
import { SUPPORT_VALID_FIELDS } from "./support.constant";

const submitSupportRequest = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await SupportService.submitSupportRequest(userId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Your support message has been submitted successfully.",
        data: result
    })
})

const getSupports = asyncHandler(async (req, res) => {
    const validatedQuery = (req as any).validatedQuery;
    const result = await SupportService.getSupports(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Supports are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});


const SupportController = {
    submitSupportRequest,
    getSupports
}
export default SupportController;