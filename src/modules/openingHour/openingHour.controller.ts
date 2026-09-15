import asyncHandler from "@/utils/asyncHandler";
import OpeningHourService from "./openingHour.service";

const createOpeningHour = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await OpeningHourService.createOpeningHour(userId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Opening hour is created successfully",
        data: result,
    });
});

const updateOpeningHour = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await OpeningHourService.updateOpeningHour(userId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Opening hour is updated successfully",
        data: result,
    });
});


const OpeningHourController = {
    createOpeningHour,
    updateOpeningHour,
}

export default OpeningHourController;