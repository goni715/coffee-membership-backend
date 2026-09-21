import asyncHandler from "@/utils/asyncHandler";
import UserService from "./user.service";
import pickValidFields from "@/utils/pickValidFields";
import { USER_VALID_FIELDS } from "./user.constant";


const getCustomers = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, USER_VALID_FIELDS);
    const result = await UserService.getCustomers(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Customers are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getMyProfile = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await UserService.getMyProfile(userId as string);
    res.status(200).json({
        success: true,
        message: "My profile is retrieved successfully",
        data: result,
    });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const result = await UserService.updateProfile(userId as string, req);
    res.status(200).json({
        success: true,
        message: "Profile is updated successfully",
        data: result,
    });
})

const UserController = {
    getCustomers,
    getMyProfile,
    updateProfile,
}

export default UserController