import generateQrCode from "@/utils/generateQrCode";
import { IShop, TShopQuery } from "./shop.interface"
import { CUSTOMER_SHOP_SEARCHABLE_FIELDS, QRCODE_PREFIX, SHOP_SEARCHABLE_FIELDS, SHOP_STATUSES } from "./shop.constant";
import ShopModel from "./shop.model";
import ConflictError from "@/errors/ConflictError";
import BadRequestError from "@/errors/BadRequestError";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import convertToSlug from "@/utils/convertToSlug";
import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { PipelineStage, Types } from "mongoose";
import makePublicID from "@/utils/makePublicID";
import deleteFromCloudinary from "@/utils/deleteFromCloudinary";
import NotFoundError from "@/errors/NotFoundError";

/*============== create shop ================== */
const createShop = async (ownerId: string, req: any) => {
    const payload: IShop = req.body;

    //check image
    if (!req.file) {
        throw new BadRequestError("Image is required");
    }

    //check if shop is already created
    const shop = await ShopModel.findOne({ ownerId })
    if (shop) {
        throw new ConflictError("You have already created a shop.");
    }

    //generate slug
    const slug = convertToSlug(payload.name);
    payload.slug = slug;

    //check shop slug
    const isShopExist = await ShopModel.findOne({ slug });
    if (isShopExist) {
        throw new ConflictError("Shop name already exists.");
    }

    //generate qr code
    const qrCode = generateQrCode(QRCODE_PREFIX.SHOP);

    //upload image
    const image = await uploadToCloudinary(req?.file?.path as string, "shop");

    //create shop
    const result = await ShopModel.create({
        ...payload,
        ownerId,
        image: image.img_url,
        qrCode
    });

    return result;
}

/*============== get shops ================== */
const getShops = async (query: TShopQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, SHOP_SEARCHABLE_FIELDS);
    }

    //4 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    //common pipeline stage
    const commonPipeline: PipelineStage[] = [
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                ownerName: "$owner.fullName",
                ownerEmail: "$owner.email",
                ownerPhone: "$owner.phone",
                ownerImage: "$owner.profileImg",
                name: "$name",
                image: "$image",
                contactNumber: "$contactNumber",
                description: "$description",
                address: "$address",
                dailyBenefitDescription: "$dailyBenefitDescription",
                qrCode: "$qrCode",
                status: "$status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            }
        },
    ]

    const shops = await ShopModel.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await ShopModel.aggregate([
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
        data: shops,
    };

    return result;
};

/*============== get customer shops ================== */
const getCustomerShops = async (query: TShopQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, CUSTOMER_SHOP_SEARCHABLE_FIELDS);
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
                status: SHOP_STATUSES.ACTIVE
            }
        },
        {
            $project: {
                _id: 1,
                name: "$name",
                image: "$image",
                contactNumber: "$contactNumber",
                description: "$description",
                address: "$address",
                dailyBenefitDescription: "$dailyBenefitDescription",
                qrCode: "$qrCode",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            }
        },
    ]

    const shops = await ShopModel.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await ShopModel.aggregate([
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
        data: shops,
    };

    return result;
};

/*============== get my shop ================== */
const getMyShop = async (ownerId: string) => {

    const result = await ShopModel.aggregate([
        {
            $match: {
                ownerId: new Types.ObjectId(ownerId)
            }
        },
        {
            $lookup: {
                from: "openinghours",
                let: { shopId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$shopId", "$$shopId"] },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            day: 1,
                            openTime: 1,
                            closeTime: 1,
                            isClosed: 1,
                        },
                    },
                ],
                as: "openingHours",
            },
        },
        {
            $project: {
                name: "$name",
                image: "$image",
                contactNumber: "$contactNumber",
                description: "$description",
                address: "$address",
                dailyBenefitDescription: "$dailyBenefitDescription",
                qrCode: "$qrCode",
                status: "$status",
                totalActiveCustomers: "$totalActiveCustomers",
                openingHours: "$openingHours",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        }
    ]);

    if (result.length === 0) {
        throw new NotFoundError("No shop found associated with your account.");
    }

    return result[0];
};

/*============== update shop ================== */
const updateShop = async (ownerId: string, req: any) => {
    const payload: Partial<IShop> = req.body;

    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }


    // if name is available
    if (payload.name) {
        //generate slug
        const slug = convertToSlug(payload.name);
        payload.slug = slug;

        //check shop slug
        const isShopExist = await ShopModel.findOne({
            ownerId: {
                $ne: ownerId
            },
            slug
        });
        if (isShopExist) {
            throw new ConflictError("Shop name already exists.");
        }
    }

    // if image is available
    if (req.file) {
        //upload image
        const image = await uploadToCloudinary(req?.file?.path as string, "shop");
        payload.image = image.img_url;
    }

    // update shop
    const result = await ShopModel.updateOne({ ownerId }, payload);

    //delete existing image
    if (req.file) {
        const public_id = makePublicID(shop?.image, "shop");
        await deleteFromCloudinary(public_id as string);
    }

    return result;
}


const ShopService = {
    createShop,
    getShops,
    getCustomerShops,
    getMyShop,
    updateShop
}

export default ShopService