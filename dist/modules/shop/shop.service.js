"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateQrCode_1 = __importDefault(require("../../utils/generateQrCode"));
const shop_constant_1 = require("./shop.constant");
const shop_model_1 = __importDefault(require("./shop.model"));
const ConflictError_1 = __importDefault(require("../../errors/ConflictError"));
const BadRequestError_1 = __importDefault(require("../../errors/BadRequestError"));
const uploadToCloudinary_1 = __importDefault(require("../../utils/uploadToCloudinary"));
const convertToSlug_1 = __importDefault(require("../../utils/convertToSlug"));
const QueryBuilder_1 = require("../../helpers/QueryBuilder");
const mongoose_1 = require("mongoose");
const makePublicID_1 = __importDefault(require("../../utils/makePublicID"));
const deleteFromCloudinary_1 = __importDefault(require("../../utils/deleteFromCloudinary"));
const NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
/*============== create shop ================== */
const createShop = async (ownerId, req) => {
    const payload = req.body;
    //check image
    if (!req.file) {
        throw new BadRequestError_1.default("Image is required");
    }
    //check if shop is already created
    const shop = await shop_model_1.default.findOne({ ownerId });
    if (shop) {
        throw new ConflictError_1.default("You have already created a shop.");
    }
    //generate slug
    const slug = (0, convertToSlug_1.default)(payload.name);
    payload.slug = slug;
    //check shop slug
    const isShopExist = await shop_model_1.default.findOne({ slug });
    if (isShopExist) {
        throw new ConflictError_1.default("Shop name already exists.");
    }
    //generate qr code
    const qrCode = (0, generateQrCode_1.default)(shop_constant_1.QRCODE_PREFIX.SHOP);
    //upload image
    const image = await (0, uploadToCloudinary_1.default)(req?.file?.path, "shop");
    //create shop
    const result = await shop_model_1.default.create({
        ...payload,
        ownerId,
        image: image.img_url,
        qrCode
    });
    return result;
};
/*============== get shops ================== */
const getShops = async (query) => {
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt", ...filters // additional filters
     } = query;
    // 1. set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //2. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //3. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, shop_constant_1.SHOP_SEARCHABLE_FIELDS);
    }
    //4 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    //common pipeline stage
    const commonPipeline = [
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
    ];
    const shops = await shop_model_1.default.aggregate([
        ...commonPipeline,
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = await shop_model_1.default.aggregate([
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
const getMyShop = async (ownerId) => {
    const result = await shop_model_1.default.aggregate([
        {
            $match: {
                ownerId: new mongoose_1.Types.ObjectId(ownerId)
            }
        },
        {
            $lookup: {
                from: "openinghours",
                localField: "_id",
                foreignField: "shopId",
                as: "openingHours"
            }
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
        throw new NotFoundError_1.default("No shop found associated with your account.");
    }
    return result[0];
};
/*============== update shop ================== */
const updateShop = async (ownerId, req) => {
    const payload = req.body;
    //check shop
    const shop = await shop_model_1.default.findOne({ ownerId });
    if (!shop) {
        throw new NotFoundError_1.default("No shop found associated with your account.");
    }
    // if name is available
    if (payload.name) {
        //generate slug
        const slug = (0, convertToSlug_1.default)(payload.name);
        payload.slug = slug;
        //check shop slug
        const isShopExist = await shop_model_1.default.findOne({
            ownerId: {
                $ne: ownerId
            },
            slug
        });
        if (isShopExist) {
            throw new ConflictError_1.default("Shop name already exists.");
        }
    }
    // if image is available
    if (req.file) {
        //upload image
        const image = await (0, uploadToCloudinary_1.default)(req?.file?.path, "shop");
        payload.image = image.img_url;
    }
    // update shop
    const result = await shop_model_1.default.updateOne({ ownerId }, payload);
    //delete existing image
    if (req.file) {
        const public_id = (0, makePublicID_1.default)(shop?.image, "shop");
        await (0, deleteFromCloudinary_1.default)(public_id);
    }
    return result;
};
const ShopService = {
    createShop,
    getShops,
    getMyShop,
    updateShop
};
exports.default = ShopService;
