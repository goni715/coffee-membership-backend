import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { TUserQuery } from "./user.interface";
import { USER_ROLES, USER_SEARCHABLE_FIELDS } from "./user.constant";
import { PipelineStage } from "mongoose";
import UserModel from "./user.model";



/*============== get owners ================== */
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

    const owners = await UserModel.aggregate([
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
        data: owners,
    };

    return result;
};

const getMyProfile = async (userId: string) => {
    return "get my profile service";
}

const UserService = {
    getCustomers,
    getMyProfile
}

export default UserService