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



const SupportController = {
    submitSupportRequest
}
export default SupportController;