import generateQrCode from "@/utils/generateQrCode";
import { QRCODE_PREFIX, SHOP_STATUSES } from "../shop/shop.constant";
import RedemptionModel from "./redemption.model";
import ShopModel from "../shop/shop.model";
import NotFoundError from "@/errors/NotFoundError";
import MembershipModel from "../membership/membership.model";
import { MEMBERSHIP_STATUSES } from "../membership/membership.constant";
import ConflictError from "@/errors/ConflictError";
import ForbiddenError from "@/errors/ForbiddenError";
import { TRedemptionQuery } from "./redemption.interface";
import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { PipelineStage, Types } from "mongoose";
import { CUSTOMER_REDEMPTION_SEARCHABLE_FIELDS, OWNER_REDEMPTION_SEARCHABLE_FIELDS } from "./redemption.constant";
import { IUser } from "../user/user.interface";

/*============== generate redemption qr code =================*/
const generateRedemptionQrCode = async (customerId: string, shopId: string) => {
    //check shop
    const shop = await ShopModel.findById(shopId);
    if (!shop) {
        throw new NotFoundError("Shop not found with the provided ID.");
    }

    //check shop status
    if (shop.status !== SHOP_STATUSES.ACTIVE) {
        throw new ConflictError("You can't generate a qr code for an inactive shop.");
    }

    //check membership
    const membership = await MembershipModel.findOne({
        customerId,
        shopId
    });

    if (!membership) {
        throw new NotFoundError("Membership not found with the associated shop.");
    }

    //check membership status
    if (membership.status !== MEMBERSHIP_STATUSES.ACTIVE) {
        throw new ConflictError("You don't have an active membership with this shop.");
    }

    //check lastest redemption
    const redemption = await RedemptionModel.findOne({
        customerId,
        shopId,
        createdAt: {
            $gte: new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z')
        }
    });
    if (redemption) {
        return {
            qrCode: redemption.qrCode,
            isRedeemed: redemption.isRedeemed,
            expiresAt: redemption.expiresAt
        }
    }

    //generate qr code
    const qrCode = generateQrCode(QRCODE_PREFIX.COFFEE);

    const today = new Date().toISOString().split('T')[0];
    const expiresAt = new Date(`${today}T23:59:59.999Z`);

    //create redemption
    const result = await RedemptionModel.create({
        customerId,
        ownerId: shop.ownerId,
        shopId,
        qrCode,
        expiresAt
    });

    return {
        qrCode: result.qrCode,
        isRedeemed: result.isRedeemed,
        expiresAt: result.expiresAt
    };
}

/*=============== get owner redemptions ===============*/
const getOwnerRedemptions = async (ownerId: string, query: TRedemptionQuery) => {
    //destructuring
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        date,
        timeframe,
        ...filters // additional filters
    } = query;

    // set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    // setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, OWNER_REDEMPTION_SEARCHABLE_FIELDS);
    }

    // setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //date is available
    if (date) {
        const start = `${date}T00:00:00.000+00:00`;
        const end = `${date}T23:59:59.999+00:00`;
        filterQuery = {
            ...filterQuery,
            createdAt: { $gte: new Date(start), $lte: new Date(end) },
        };
    }

    //timeframe is available
    if (timeframe) {
        const now = new Date();

        if (timeframe === "today") {
            const todayStr = now.toISOString().split("T")[0];
            const start = `${todayStr}T00:00:00.000+00:00`;
            const end = `${todayStr}T23:59:59.999+00:00`;

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: new Date(start), $lte: new Date(end) },
            };
        } else if (timeframe === "last_week") {
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            lastWeek.setHours(0, 0, 0, 0);

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: lastWeek },
            };
        } else if (timeframe === "last_month") {
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);
            lastMonth.setHours(0, 0, 0, 0);

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: lastMonth },
            };
        }
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
                qrCode: "$qrCode",
                isRedeemed: "$isRedeemed",
                expiresAt: "$expiresAt",
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

    const memberships = await RedemptionModel.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await RedemptionModel.aggregate([
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

/*=============== get customer redemptions ===============*/
const getCustomerRedemptions = async (customerId: string, query: TRedemptionQuery) => {
    //destructuring
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        date,
        timeframe,
        ...filters // additional filters
    } = query;


    // set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    // setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, CUSTOMER_REDEMPTION_SEARCHABLE_FIELDS);
    }

    // setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //date is available
    if (date) {
        const start = `${date}T00:00:00.000+00:00`;
        const end = `${date}T23:59:59.999+00:00`;
        filterQuery = {
            ...filterQuery,
            createdAt: { $gte: new Date(start), $lte: new Date(end) },
        };
    }

    //timeframe is available
    if (timeframe) {
        const now = new Date();

        if (timeframe === "today") {
            const todayStr = now.toISOString().split("T")[0];
            const start = `${todayStr}T00:00:00.000+00:00`;
            const end = `${todayStr}T23:59:59.999+00:00`;

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: new Date(start), $lte: new Date(end) },
            };
        } else if (timeframe === "last_week") {
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            lastWeek.setHours(0, 0, 0, 0);

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: lastWeek },
            };
        } else if (timeframe === "last_month") {
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);
            lastMonth.setHours(0, 0, 0, 0);

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: lastMonth },
            };
        }
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
                qrCode: "$qrCode",
                isRedeemed: "$isRedeemed",
                expiresAt: "$expiresAt",
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

    const memberships = await RedemptionModel.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await RedemptionModel.aggregate([
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

/*============== verify redemption qr code =================*/
const verifyQrCode = async (ownerId: string, qrCode: string) => {
    //check redemption
    const redemption = await RedemptionModel.findOne({
        qrCode
    }).populate<{ customerId: IUser }>('customerId', 'fullName email phone profileImg');

    if (!redemption) {
        throw new NotFoundError("Redemption not found with the provided QR code.");
    }

    //check shop ownership
    if (!redemption.ownerId || redemption.ownerId.toString() !== ownerId.toString()) {
        throw new ForbiddenError("This QR code is not associated with your shop.");
    }

    //check if already used
    if (redemption.isRedeemed) {
        throw new ConflictError("This QR code has already been used.");
    }

    //check if expired
    if (redemption.expiresAt < new Date()) {
        throw new ConflictError("This QR code has expired.");
    }

    //mark as used
    redemption.isRedeemed = true;
    await redemption.save();

    // extract populated customer data
    const customer = redemption.customerId as unknown as IUser;

    return {
        customerId: customer?._id,
        customerName: customer?.fullName,
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        customerImg: customer?.profileImg,
        qrCode: redemption.qrCode,
        isRedeemed: redemption.isRedeemed,
        expiresAt: (redemption as any).expiresAt,
        createdAt: (redemption as any).createdAt,
    };

}

/*================= get single redemption by qr code =================*/
const getSingleRedemptionByQrCode = async (userId: string, role: 'owner' | 'customer', qrCode: string) => {

    if (role === 'owner') {
        const result = await RedemptionModel.aggregate([
            {
                $match: {
                    ownerId: new Types.ObjectId(userId),
                    qrCode
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
                    qrCode: "$qrCode",
                    isRedeemed: "$isRedeemed",
                    expiresAt: "$expiresAt",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                },
            },
        ])


        if (!result[0]) {
            throw new NotFoundError("Redemption not found with the provided QR code.");
        }
        return result[0];
    }


    //if role is customer
    const result = await RedemptionModel.aggregate([
        {
            $match: {
                customerId: new Types.ObjectId(userId)
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
                qrCode: "$qrCode",
                isRedeemed: "$isRedeemed",
                expiresAt: "$expiresAt",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        },
    ])

    if (!result[0]) {
        throw new NotFoundError("Redemption not found with the provided QR code.");
    }
    return result[0];
}

const RedemptionService = {
    generateRedemptionQrCode,
    getOwnerRedemptions,
    getCustomerRedemptions,
    verifyQrCode,
    getSingleRedemptionByQrCode
}

export default RedemptionService;