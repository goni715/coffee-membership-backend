import asyncHandler from "@/utils/asyncHandler";
import MembershipService from "./membership.service";
import pickValidFields from "@/utils/pickValidFields";
import { MEMBERSHIP_VALID_FIELDS } from "./membership.constant";


const joinShop = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await MembershipService.joinShop(userId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Join request sent successfully.",
        data: result
    })
})

const getMembershipRequests = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = pickValidFields(req.query, MEMBERSHIP_VALID_FIELDS);
    const result = await MembershipService.getMembershipRequests(userId as string, validatedQuery);
    res.status(200).json({
        success: true,
        message: "Membership requests retrieved successfully.",
        meta: result.meta,
        data: result.data
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
    const validatedQuery = pickValidFields(req.query, MEMBERSHIP_VALID_FIELDS);
    const result = await MembershipService.getMyMemberships(userId as string, validatedQuery);
    res.status(200).json({
        success: true,
        message: "Memberships are retrieved successfully.",
        meta: result.meta,
        data: result.data
    })
})

const MembershipController = {
    joinShop,
    getMembershipRequests,
    updateMembershipStatus,
    getMyMemberships
}

export default MembershipController;
