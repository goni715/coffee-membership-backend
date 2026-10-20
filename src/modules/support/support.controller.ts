import asyncHandler from "@/utils/asyncHandler";
import SupportService from "./support.service";

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

const replySupport = asyncHandler(async (req, res) => {
    const { supportId } = req.params;
    const { replyMessage } = req.body;
    const result = await SupportService.replySupport(supportId as string, replyMessage);
    
    res.status(200).json({
        success: true,
        message: "Reply message has been sent successfully",
        data: result
    })
})

const closeSupport = asyncHandler(async (req, res) => {
    const { supportId } = req.params;
    const result = await SupportService.closeSupport(supportId as string);
    
    res.status(200).json({
        success: true,
        message: "Support request has been closed successfully",
        data: result
    })
})

const deleteSupport = asyncHandler(async (req, res) => {
    const { supportId } = req.params;
    const result = await SupportService.deleteSupport(supportId as string);
    
    res.status(200).json({
        success: true,
        message: "Support request is deleted successfully",
        data: result
    })
})


const SupportController = {
    submitSupportRequest,
    getSupports,
    replySupport,
    closeSupport,
    deleteSupport
}
export default SupportController;