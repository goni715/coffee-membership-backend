import { MEMBERSHIP_STATUSES } from "../membership/membership.constant"
import MembershipModel from "../membership/membership.model"
import RedemptionModel from "../redemption/redemption.model"
import { SHOP_STATUSES } from "../shop/shop.constant"
import ShopModel from "../shop/shop.model"
import { USER_ROLES } from "../user/user.constant"
import UserModel from "../user/user.model"

/* ========= ADMIN DASHBOARD stats ========= */
const getStats = async () => {
    //total shops
    const totalShops = await ShopModel.countDocuments();

    //total active shops
    const totalActiveShops = await ShopModel.countDocuments({
        status: SHOP_STATUSES.ACTIVE,
    })

    //total customers
    const totalCustomers = await UserModel.countDocuments({
        role: USER_ROLES.CUSTOMER,
    });


    //todays redemptions
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const start = `${todayStr}T00:00:00.000+00:00`;
    const end = `${todayStr}T23:59:59.999+00:00`;

    const todaysRedemptions = await RedemptionModel.countDocuments({
        isRedeemed: true,
        createdAt: {
            $gte: new Date(start),
            $lte: new Date(end),
        }
    })

    return {
        totalShops,
        totalActiveShops,
        totalCustomers,
        todaysRedemptions
    }
}

/* ========= owner stats ========= */
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
        ownerId: ownerId,
        isRedeemed: true,
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
    getStats,
    getOwnerStats
}

export default DashboardService