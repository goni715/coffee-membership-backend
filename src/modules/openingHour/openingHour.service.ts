import NotFoundError from "@/errors/NotFoundError";
import ShopModel from "../shop/shop.model";
import { IOpeningHour } from "./openingHour.interface";
import convertToSlug from "@/utils/convertToSlug";
import { OpeningHourModel } from "./openingHour.model";
import ConflictError from "@/errors/ConflictError";
import { Types } from "mongoose";

/*======== create opening hour =========*/
const createOpeningHour = async (ownerId: string, payload: IOpeningHour) => {
    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }

    //set shopId and ownerId
    payload.ownerId = shop.ownerId
    payload.shopId = shop._id

    //generate slug
    const slug = convertToSlug(payload.day);
    payload.slug = slug;

    // check exist
    const openingHour = await OpeningHourModel.findOne({
        ownerId,
        shopId: shop._id,
        slug
    })

    if (openingHour) {
        throw new ConflictError("This opening hour already exists.");
    }

    // create 
    const result = await OpeningHourModel.create(payload);

    return result;
}

/*======== get opening hours =========*/
const getOpeningHours = async (ownerId: string) => {
    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }
    const result = await OpeningHourModel.aggregate([
        {
            $match: {
                ownerId: new Types.ObjectId(ownerId)
            }
        },
        {
            $project: {
                day: 1,
                openTime: 1,
                closeTime: 1,
                isClosed: 1,
            }
        }
    ])
    return result;
}

/*======== update opening hour =========*/
const updateOpeningHour = async (ownerId: string, openingId: string, payload: Partial<IOpeningHour>) => {
    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }

    //check opening hour
    const openingHour = await OpeningHourModel.findOne({
        ownerId,
        shopId: shop._id,
        _id: openingId
    })

    if (!openingHour) {
        throw new NotFoundError("No opening hour found with the provided ID.");
    }

    //if day is available
    if (payload.day) {
        //generate slug
        const slug = convertToSlug(payload.day);
        payload.slug = slug;

        // check exist
        const openingHour = await OpeningHourModel.findOne({
            ownerId,
            shopId: shop._id,
            slug
        })

        if (openingHour) {
            throw new ConflictError("This opening hour already exists.");
        }
    }

    // update 
    const result = await OpeningHourModel.updateOne(
        { ownerId, shopId: shop._id, },
        payload
    );

    return result;
}

/*======== delete opening hour =========*/
const deleteOpeningHour = async (ownerId: string, openingId: string) => {
    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }

    //check opening hour
    const openingHour = await OpeningHourModel.findOne({
        ownerId,
        shopId: shop._id,
        _id: openingId
    })

    if (!openingHour) {
        throw new NotFoundError("No opening hour found with the provided ID.");
    }

    // delete 
    const result = await OpeningHourModel.deleteOne({
        ownerId,
        shopId: shop._id,
        _id: openingId
    });

    return result;
}

const OpeningHourService = {
    createOpeningHour,
    getOpeningHours,
    updateOpeningHour,
    deleteOpeningHour
}

export default OpeningHourService;