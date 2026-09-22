import { MEMBERSHIP_STATUSES } from "../membership/membership.constant"
import MembershipModel from "../membership/membership.model"
import RedemptionModel from "../redemption/redemption.model"


const getOwnerStats = async (ownerId: string) => {
    //total active customers for shop
    const totalActiveCustomers = await MembershipModel.countDocuments({
        status: MEMBERSHIP_STATUSES.ACTIVE,
        ownerId: ownerId
    })

    //total pending requests for shop
    const totalPendingRequests = await MembershipModel.countDocuments({
        status: MEMBERSHIP_STATUSES.PENDING,
        ownerId: ownerId
    })

    //todays redemptions
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const start = `${todayStr}T00:00:00.000+00:00`;
    const end = `${todayStr}T23:59:59.999+00:00`;

    const todaysRedemptions = await RedemptionModel.countDocuments({
        isUsed: true,
        createdAt: {
            $gte: new Date(start),
            $lte: new Date(end),
        }
    })

    return {
        totalActiveCustomers,
        totalPendingRequests,
        todaysRedemptions
    }
}



const DashboardService = {
    getOwnerStats
}

export default DashboardService