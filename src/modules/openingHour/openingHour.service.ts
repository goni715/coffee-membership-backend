import NotFoundError from "@/errors/NotFoundError";
import ShopModel from "../shop/shop.model";
import { IOpeningHour } from "./openingHour.interface";
import convertToSlug from "@/utils/convertToSlug";
import { OpeningHourModel } from "./openingHour.model";
import ConflictError from "@/errors/ConflictError";

/*======== create opening hour =========*/
const createOpeningHour = async (ownerId: string, payload: IOpeningHour) => {
    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }

    payload.shopId = shop._id

    //generate slug
    const slug = convertToSlug(payload.day);
    payload.slug = slug;

    // check exist
    const openingHour = await OpeningHourModel.findOne({
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

/*======== update opening hour =========*/
const updateOpeningHour = async (ownerId: string, payload: Partial<IOpeningHour>) => {
    //check shop
    const shop = await ShopModel.findOne({ ownerId })
    if (!shop) {
        throw new NotFoundError("No shop found associated with your account.");
    }

    //if day is available
    if (payload.day) {
        //generate slug
        const slug = convertToSlug(payload.day);
        payload.slug = slug;

        // check exist
        const openingHour = await OpeningHourModel.findOne({
            shopId: shop._id,
            slug
        })

        if (openingHour) {
            throw new ConflictError("This opening hour already exists.");
        }
    }

    // update 
    const result = await OpeningHourModel.updateOne(
        { shopId: shop._id, },
        payload
    );

    return result;
}

const OpeningHourService = {
    createOpeningHour,
    updateOpeningHour
}

export default OpeningHourService;