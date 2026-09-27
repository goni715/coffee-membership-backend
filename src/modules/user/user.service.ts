import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { IUser, TCustomerByShopIdQuery, TUserQuery } from "./user.interface";
import { USER_ROLES, USER_SEARCHABLE_FIELDS } from "./user.constant";
import { PipelineStage, Types } from "mongoose";
import UserModel from "./user.model";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import MembershipModel from "../membership/membership.model";



/*============== get customers ================== */
const getCustomers = async (query: TUserQuery) => {
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters // additional filters
    } = query;

    // 1. set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //2. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //3. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, USER_SEARCHABLE_FIELDS);
    }

    //4 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //common pipeline stage
    const commonPipeline: PipelineStage = {
        $match: {
            role: USER_ROLES.CUSTOMER,
            ...searchQuery,
            ...filterQuery,
        },
    }

    // get customers
    const customers = await UserModel.aggregate([
        commonPipeline,
        {
            $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                phone: 1,
                profileImg: 1,
                status: 1,
                blockedAt: 1,
                lastLoginAt: 1,
                createdAt: 1,
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await UserModel.aggregate([
        commonPipeline,
        { $count: "totalCount" },
    ]);

    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    const result = {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: customers,
    };

    return result;
};

/*============== get user profile ================== */
const getMyProfile = async (userId: string) => {
    const user = await UserModel.findById(userId).select("fullName email phone profileImg status blockedAt lastLoginAt createdAt");
    return user;
}

/*============== update profile ================== */
const updateProfile = async (userId: string, req: any) => {
    const payload: Partial<IUser> = req.body;

    // if image is available
    if (req.file) {
        //upload image
        const image = await uploadToCloudinary(req?.file?.path as string, "user");
        payload.profileImg = image.img_url;
    }

    //update profile
    const result = await UserModel.updateOne(
        { _id: userId },
        payload,
    );

    return result;
}

/*============== get customers by shop id ================== */
const getCustomersByShopId = async (shopId: string, query: TUserQuery) => {
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters // additional filters
    } = query;

    // 1. set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //2. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //3. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, USER_SEARCHABLE_FIELDS);
    }

    //4 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //common pipeline stage
    const commonPipeline: PipelineStage[] = [
        {
            $match: {
                shopId: new Types.ObjectId(shopId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "customerId",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                _id: "$customerId",
                fullName: "$customer.fullName",
                email: "$customer.email",
                phone: "$customer.phone",
                profileImg: "$customer.profileImg",
                status: "$customer.status",
                blockedAt: "$customer.blockedAt",
                lastLoginAt: "$customer.lastLoginAt",
                membershipStatus: "$status",
                createdAt: "$createdAt",
            }
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
            }
        }
    ]

    // get customers
    const customers = await MembershipModel.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await MembershipModel.aggregate([
        ...commonPipeline,
        { $count: "totalCount" },
    ]);

    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    const result = {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: customers,
    };

    return result;
};

/*============== get my customers ================== */
const getMyCustomers = async (ownerId: string, query: TCustomerByShopIdQuery) => {
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters // additional filters
    } = query;

    // 1. set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //2. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //3. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, USER_SEARCHABLE_FIELDS);
    }

    //4 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //common pipeline stage
    const commonPipeline: PipelineStage[] = [
        {
            $match: {
                ownerId: new Types.ObjectId(ownerId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "customerId",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                _id: "$customerId",
                fullName: "$customer.fullName",
                email: "$customer.email",
                phone: "$customer.phone",
                profileImg: "$customer.profileImg",
                membershipStatus: "$status",
                createdAt: "$createdAt",
            }
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
            }
        }
    ]

    // get customers
    const customers = await MembershipModel.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await MembershipModel.aggregate([
        ...commonPipeline,
        { $count: "totalCount" },
    ]);

    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    const result = {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: customers,
    };

    return result;
};


const UserService = {
    getCustomers,
    getMyProfile,
    updateProfile,
    getCustomersByShopId,
    getMyCustomers
}

export default UserService