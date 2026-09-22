import asyncHandler from "@/utils/asyncHandler";
import DashboardService from "./dashboard.service";

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
    getOwnerStats
}

export default DashboardController