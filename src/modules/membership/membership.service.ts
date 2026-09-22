import NotFoundError from "@/errors/NotFoundError";
import ShopModel from "../shop/shop.model";
import { IMembership, TMembershipQuery, TMembershipStatus } from "./membership.interface"
import MembershipModel from "./membership.model";
import ConflictError from "@/errors/ConflictError";
import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { MEMBERSHIP_SEARCHABLE_FIELDS, MEMBERSHIP_STATUSES, MY_MEMBERSHIPS_SEARCHABLE_FIELDS } from "./membership.constant";
import { PipelineStage, Types } from "mongoose";
import ForbiddenError from "@/errors/ForbiddenError";


/*=============== join shop ===============*/
const joinShop = async (customerId: string, payload: IMembership) => {
    //check shop
    const shop = await ShopModel.findById(payload.shopId);
    if (!shop) {
        throw new NotFoundError("Shop not found with the provided ID.");
    }

    //check already join
    const alreadyJoin = await MembershipModel.findOne({
        customerId,
        shopId: payload.shopId
    });
    if (alreadyJoin) {
        throw new ConflictError("You have already joined this shop.");
    }

    //create membership
    const result = await MembershipModel.create({
        customerId,
        ownerId: shop.ownerId,
        shopId: payload.shopId
    });

    return result;
}

/*=============== get membership requests ===============*/
const getMembershipRequests = async (ownerId: string, query: TMembershipQuery) => {
    //destructuring
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters // additional filters
    } = query;

    // set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    // setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, MEMBERSHIP_SEARCHABLE_FIELDS);
    }

    // setup filters
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
                as: "customer",
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                _id: 1,
                customerId: 1,
                customerName: "$customer.fullName",
                customerEmail: "$customer.email",
                customerPhone: "$customer.phone",
                customerImg: "$customer.profileImg",
                status: "$status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
            },
        }
    ]

    const memberships = await MembershipModel.aggregate([
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
        data: memberships,
    };

    return result;
}

/*=============== get single request ===============*/
const getSingleRequest = async (ownerId: string, membershipId: string) => {
    const result = await MembershipModel.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(membershipId),
                ownerId: new Types.ObjectId(ownerId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "customerId",
                foreignField: "_id",
                as: "customer",
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                _id: 1,
                customerId: 1,
                customerName: "$customer.fullName",
                customerEmail: "$customer.email",
                customerPhone: "$customer.phone",
                customerImg: "$customer.profileImg",
                status: "$status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        }
    ]);


    if (result.length === 0) {
        throw new NotFoundError("Membership not found with the provided ID.");
    }

    return result[0];
}

/*============== update membership status =================*/
const updateMembershipStatus = async (ownerId: string, membershipId: string, status: TMembershipStatus) => {
    //check membership
    const membership = await MembershipModel.findById(membershipId);
    if (!membership) {
        throw new NotFoundError("Membership not found with the provided ID.");
    }

    //check ownership
    if (membership.ownerId.toString() !== ownerId.toString()) {
        throw new ForbiddenError("This membership is not associated with your shop.");
    }

    if (membership.status === status) {
        throw new ConflictError(`Membership is already ${status}.`);
    }

    //when status is pending, then status rejected only
    if (
        (membership.status !== MEMBERSHIP_STATUSES.PENDING) &&
        status === MEMBERSHIP_STATUSES.REJECTED
    ) {
        throw new ForbiddenError(`Only pending membership can be rejected.`);
    }

    //when status is active, then status paused only
    if (status === MEMBERSHIP_STATUSES.PAUSED && membership.status !== MEMBERSHIP_STATUSES.ACTIVE) {
        throw new ForbiddenError(`Only active membership can be paused.`);
    }

    //update membership status
    const result = await MembershipModel.updateOne(
        { _id: membership._id },
        { status }
    );

    return result;
}

/*=============== get customer memberships ===============*/
const getMyMemberships = async (customerId: string, query: TMembershipQuery) => {
    //destructuring
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters // additional filters
    } = query;

    // set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    // setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, MY_MEMBERSHIPS_SEARCHABLE_FIELDS);
    }

    // setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //common pipeline stage
    const commonPipeline: PipelineStage[] = [
        {
            $match: {
                customerId: new Types.ObjectId(customerId)
            }
        },
        {
            $lookup: {
                from: "shops",
                localField: "shopId",
                foreignField: "_id",
                as: "shop",
            }
        },
        {
            $unwind: "$shop"
        },
        {
            $project: {
                _id: 1,
                shopId: 1,
                shopName: "$shop.name",
                contactNumber: "$shop.contactNumber",
                address: "$shop.address",
                image: "$shop.image",
                status: "$status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
            },
        }
    ]

    const memberships = await MembershipModel.aggregate([
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
        data: memberships,
    };

    return result;
}

/*========== get single membership by shop id ==========*/
const getSingleMembershipByShopId = async (customerId: string, shopId: string) => {
    const result = await MembershipModel.aggregate([
        {
            $match: {
                customerId: new Types.ObjectId(customerId),
                shopId: new Types.ObjectId(shopId),
            }
        },
        {
            $lookup: {
                from: "shops",
                localField: "shopId",
                foreignField: "_id",
                as: "shop",
            }
        },
        {
            $unwind: "$shop"
        },
        {
            $project: {
                _id: 1,
                shopId: 1,
                shopName: "$shop.name",
                contactNumber: "$shop.contactNumber",
                address: "$shop.address",
                image: "$shop.image",
                status: "$status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        },
    ]);

    if (result.length === 0) {
        throw new NotFoundError("Membership not found with the provided ID.");
    }

    return result[0];
}


const MembershipService = {
    joinShop,
    getMembershipRequests,
    getSingleRequest,
    updateMembershipStatus,
    getMyMemberships,
    getSingleMembershipByShopId
}

export default MembershipService