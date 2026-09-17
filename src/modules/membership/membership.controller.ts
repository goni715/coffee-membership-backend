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

const MembershipController = {
    joinShop
}

export default MembershipController;
