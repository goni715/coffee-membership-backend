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

const getOpeningHours = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await OpeningHourService.getOpeningHours(userId as string);
    res.status(200).json({
        success: true,
        message: "Opening hours are retrieved successfully",
        data: result,
    });
});

const updateOpeningHour = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { openingId } = req.params;
    const result = await OpeningHourService.updateOpeningHour(userId as string, openingId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Opening hour is updated successfully",
        data: result,
    });
});

const deleteOpeningHour = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { openingId } = req.params;
    const result = await OpeningHourService.deleteOpeningHour(userId as string, openingId as string);
    res.status(200).json({
        success: true,
        message: "Opening hour is deleted successfully",
        data: result,
    });
});


const OpeningHourController = {
    createOpeningHour,
    getOpeningHours,
    updateOpeningHour,
    deleteOpeningHour
}

export default OpeningHourController;