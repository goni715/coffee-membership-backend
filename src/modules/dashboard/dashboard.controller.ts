import asyncHandler from "@/utils/asyncHandler";
import DashboardService from "./dashboard.service";

const getStats = asyncHandler(async (req, res) => {
    const result = await DashboardService.getStats();

    res.status(200).json({
        success: true,
        message: 'Stats are retrieved successfully',
        data: result,
    });
});

const getOwnerStats = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await DashboardService.getOwnerStats(userId as string);

    res.status(200).json({
        success: true,
        message: 'Owner stats are retrieved successfully',
        data: result,
    });
});


const DashboardController = {
    getStats,
    getOwnerStats
}

export default DashboardController