import generateQrCode from "@/utils/generateQrCode";
import { IShop, TShopQuery } from "./shop.interface"
import { QRCODE_PREFIX, SHOP_SEARCHABLE_FIELDS } from "./shop.constant";
import ShopModel from "./shop.model";
import ConflictError from "@/errors/ConflictError";
import BadRequestError from "@/errors/BadRequestError";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import convertToSlug from "@/utils/convertToSlug";
import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";

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
    // const commonPipeline: PipelineStage = {
    //     $match: {
    //         role: USER_ROLES.OWNER,
    //         ...searchQuery,
    //         ...filterQuery,
    //     },
    // }

    const shops = await ShopModel.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
                image: 1,
                contactNumber: 1,
                description: 1,
                address: 1,
                dailyBenefitDescription: 1,
                qrCode: 1,
                status: 1,
                lastLoginAt: 1,
                createdAt: 1,
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);

    // total count
    const totalCountResult = await ShopModel.aggregate([
        // commonPipeline,
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


const ShopService = {
    createShop,
    getShops
}

export default ShopService