import asyncHandler from "@/utils/asyncHandler";
import UserService from "./user.service";


const getCustomers = asyncHandler(async (req, res) => {
    const validatedQuery = (req as any).validatedQuery;
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

const getCustomersByShopId = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const validatedQuery = (req as any).validatedQuery;
    const result = await UserService.getCustomersByShopId(shopId as string, validatedQuery);

    res.status(200).json({
        success: true,
        message: "Customers are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getMyCustomers = asyncHandler(async (req, res) => {
    const { userId } = req.headers;
    const validatedQuery = (req as any).validatedQuery;
    const result = await UserService.getMyCustomers(userId as string, validatedQuery);

    res.status(200).json({
        success: true,
        message: "Customers are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});


const UserController = {
    getCustomers,
    getMyProfile,
    updateProfile,
    getCustomersByShopId,
    getMyCustomers
}

export default UserController