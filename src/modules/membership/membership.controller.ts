import asyncHandler from "@/utils/asyncHandler";
import MembershipService from "./membership.service";


const joinShop = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await MembershipService.joinShop(userId as string, req.body);

    res.status(200).json({
        success: true,
        message: "Join request sent successfully.",
        data: result
    })
})

const joinShopWithQrCode = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { qrCode } = req.body;
    const result = await MembershipService.joinShopWithQrCode(userId as string, qrCode);

    res.status(200).json({
        success: true,
        message: "Join request sent successfully.",
        data: result
    })
})

const getMembershipRequests = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = (req as any).validatedQuery;
    const result = await MembershipService.getMembershipRequests(userId as string, validatedQuery);

    res.status(200).json({
        success: true,
        message: "Membership requests retrieved successfully.",
        meta: result.meta,
        data: result.data
    })
})

const getSingleRequest = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { membershipId } = req.params;
    const result = await MembershipService.getSingleRequest(userId as string, membershipId as string);

    res.status(200).json({
        success: true,
        message: "Membership request retrieved successfully.",
        data: result
    })
})


const updateMembershipStatus = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { membershipId } = req.params;
    const { status } = req.body;
    const result = await MembershipService.updateMembershipStatus(userId as string, membershipId as string, status);

    res.status(200).json({
        success: true,
        message: "Membership status updated successfully.",
        data: result
    })
})

const getMyMemberships = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = (req as any).validatedQuery;
    const result = await MembershipService.getMyMemberships(userId as string, validatedQuery);

    res.status(200).json({
        success: true,
        message: "Memberships are retrieved successfully.",
        meta: result.meta,
        data: result.data
    })
})

const getSingleMembershipByShopId = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const { shopId } = req.params;
    const result = await MembershipService.getSingleMembershipByShopId(userId as string, shopId as string);

    res.status(200).json({
        success: true,
        message: "Membership retrieved successfully.",
        data: result
    })
})

const MembershipController = {
    joinShop,
    joinShopWithQrCode,
    getMembershipRequests,
    getSingleRequest,
    updateMembershipStatus,
    getMyMemberships,
    getSingleMembershipByShopId
}

export default MembershipController;
